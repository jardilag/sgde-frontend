/**
 * Route handler para cerrar expediente
 */

import { NextResponse } from 'next/server';
import { cerrarExpediente } from '@/services/mock-db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const payload = await request.json();

    if (!payload.fechaCierre || typeof payload.fechaCierre !== 'string') {
      return NextResponse.json(
        { error: 'La fecha de cierre es obligatoria' },
        { status: 400 }
      );
    }

    const item = cerrarExpediente(id, payload.fechaCierre);

    if (!item) {
      return NextResponse.json(
        { message: 'Expediente no encontrado.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Expediente cerrado correctamente.', item }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: 'No fue posible cerrar el expediente.' },
      { status: 500 }
    );
  }
}
