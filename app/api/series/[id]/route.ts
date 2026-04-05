import { NextResponse } from 'next/server';
import { deleteSerie, updateSerie } from '@/services/mock-db';
import { validateSeriePayload } from '@/utils/validators';

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const payload = (await request.json()) as Record<string, unknown>;
    const validation = validateSeriePayload(payload);

    if (!validation.valid) {
      return NextResponse.json(
        { message: 'Revise los campos obligatorios de la serie.', errors: validation.errors },
        { status: 400 },
      );
    }

    const item = updateSerie(id, payload as unknown as Parameters<typeof updateSerie>[1]);

    if (!item) {
      return NextResponse.json({ message: 'Serie no encontrada.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Serie actualizada correctamente.', item }, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'No fue posible actualizar la serie.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const deleted = deleteSerie(id);

  if (!deleted) {
    return NextResponse.json({ message: 'Serie no encontrada.' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Serie eliminada correctamente.' }, { status: 200 });
}
