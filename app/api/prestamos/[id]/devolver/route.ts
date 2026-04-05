import { NextResponse } from 'next/server';
import { registrarDevolucionPrestamo } from '@/services/mock-db';
import { validatePrestamoDevolucionPayload } from '@/utils/validators';

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const payload = (await request.json()) as Record<string, unknown>;
    const validation = validatePrestamoDevolucionPayload(payload);

    if (!validation.valid) {
      return NextResponse.json(
        { message: 'Revise los datos de devolución.', errors: validation.errors },
        { status: 400 },
      );
    }

    const item = registrarDevolucionPrestamo(id, payload as unknown as Parameters<typeof registrarDevolucionPrestamo>[1]);

    if (!item) {
      return NextResponse.json({ message: 'Préstamo no encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Devolución registrada correctamente.', item }, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'No fue posible registrar la devolución.' }, { status: 500 });
  }
}
