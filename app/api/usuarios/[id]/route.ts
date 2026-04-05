import { NextResponse } from 'next/server';
import { deleteUsuario, updateUsuario } from '@/services/mock-db';
import { validateUsuarioPayload } from '@/utils/validators';

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const payload = (await request.json()) as Record<string, unknown>;
    const validation = validateUsuarioPayload(payload);

    if (!validation.valid) {
      return NextResponse.json(
        { message: 'Revise los campos obligatorios del usuario.', errors: validation.errors },
        { status: 400 },
      );
    }

    const item = updateUsuario(id, payload as unknown as Parameters<typeof updateUsuario>[1]);

    if (!item) {
      return NextResponse.json({ message: 'Usuario no encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Usuario actualizado correctamente.', item }, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'No fue posible actualizar el usuario.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const deleted = deleteUsuario(id);

  if (!deleted) {
    return NextResponse.json({ message: 'Usuario no encontrado.' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Usuario eliminado correctamente.' }, { status: 200 });
}