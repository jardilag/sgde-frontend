import { NextResponse } from 'next/server';
import { deleteSubserie, updateSubserie } from '@/services/mock-db';
import { validateSubseriePayload } from '@/utils/validators';

type RouteParams = {
  params: Promise<{ id: string; subId: string }>;
};

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id: serieId, subId } = await params;
    const payload = (await request.json()) as Record<string, unknown>;

    // Asegurar que serieId está en el payload
    (payload as Record<string, unknown>).serieId = serieId;

    const validation = validateSubseriePayload(payload);

    if (!validation.valid) {
      return NextResponse.json(
        { message: 'Revise los campos obligatorios de la subserie.', errors: validation.errors },
        { status: 400 },
      );
    }

    const item = updateSubserie(serieId, subId, payload as unknown as Parameters<typeof updateSubserie>[2]);

    if (!item) {
      return NextResponse.json({ message: 'Subserie no encontrada.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Subserie actualizada correctamente.', item }, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'No fue posible actualizar la subserie.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id: serieId, subId } = await params;
  const deleted = deleteSubserie(serieId, subId);

  if (!deleted) {
    return NextResponse.json({ message: 'Subserie no encontrada.' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Subserie eliminada correctamente.' }, { status: 200 });
}
