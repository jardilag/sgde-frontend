/**
 * Route handler para reabrir expediente
 */

import { NextResponse } from 'next/server';
import { reabrirExpediente } from '@/services/mock-db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const item = reabrirExpediente(id);

    if (!item) {
      return NextResponse.json(
        { message: 'Expediente no encontrado.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Expediente reabierto correctamente.', item }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: 'No fue posible reabrir el expediente.' },
      { status: 500 }
    );
  }
}
