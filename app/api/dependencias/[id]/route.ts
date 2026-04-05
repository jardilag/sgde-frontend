import { NextResponse } from 'next/server';
import { deleteDependencia, updateDependencia } from '@/services/mock-db';
import { validateDependenciaPayload } from '@/utils/validators';

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const payload = (await request.json()) as Record<string, unknown>;
    const validation = validateDependenciaPayload(payload);

    if (!validation.valid) {
      return NextResponse.json(
        { message: 'Revise los campos obligatorios de la dependencia.', errors: validation.errors },
        { status: 400 },
      );
    }

    const item = updateDependencia(id, payload as unknown as Parameters<typeof updateDependencia>[1]);

    if (!item) {
      return NextResponse.json({ message: 'Dependencia no encontrada.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Dependencia actualizada correctamente.', item }, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'No fue posible actualizar la dependencia.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const deleted = deleteDependencia(id);

  if (!deleted) {
    return NextResponse.json({ message: 'Dependencia no encontrada.' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Dependencia eliminada correctamente.' }, { status: 200 });
}
