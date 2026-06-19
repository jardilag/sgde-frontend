import { NextResponse } from 'next/server';
import { createCarpetaExpediente, listCarpetasExpediente } from '@/services/mock-db';

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  return NextResponse.json({ items: listCarpetasExpediente(id) }, { status: 200 });
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const payload = (await request.json()) as { nombre?: unknown; descripcion?: unknown };
    const nombre = typeof payload.nombre === 'string' ? payload.nombre.trim() : '';

    if (!nombre) {
      return NextResponse.json(
        { message: 'El nombre de la carpeta es obligatorio.', errors: { nombre: 'Requerido' } },
        { status: 400 },
      );
    }

    const item = createCarpetaExpediente(id, {
      nombre,
      descripcion: typeof payload.descripcion === 'string' ? payload.descripcion : undefined,
    });

    if (!item) {
      return NextResponse.json({ message: 'Expediente no encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Carpeta creada correctamente.', item }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'No fue posible crear la carpeta.' }, { status: 500 });
  }
}
