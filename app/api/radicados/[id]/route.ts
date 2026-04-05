import { NextResponse } from 'next/server';
import { deleteRadicado, updateRadicado } from '@/services/mock-db';
import { validateRadicadoPayload } from '@/utils/validators';

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const payload = (await request.json()) as Record<string, unknown>;
    const validation = validateRadicadoPayload(payload);

    if (!validation.valid) {
      return NextResponse.json(
        { message: 'Revise los campos obligatorios del radicado.', errors: validation.errors },
        { status: 400 },
      );
    }

    const item = updateRadicado(id, payload as unknown as Parameters<typeof updateRadicado>[1]);

    if (!item) {
      return NextResponse.json({ message: 'Radicado no encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Radicado actualizado correctamente.', item }, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'No fue posible actualizar el radicado.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const deleted = deleteRadicado(id);

  if (!deleted) {
    return NextResponse.json({ message: 'Radicado no encontrado.' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Radicado eliminado correctamente.' }, { status: 200 });
}