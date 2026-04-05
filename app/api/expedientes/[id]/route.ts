/**
 * Route handler para GET, PUT y DELETE de expediente por ID
 */

import { NextResponse } from 'next/server';
import { getExpedienteById, updateExpediente, deleteExpediente } from '@/services/mock-db';
import { validateExpedientePayload } from '@/utils/validators';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const expediente = getExpedienteById(id);

    if (!expediente) {
      return NextResponse.json(
        { error: 'Expediente no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ item: expediente }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: 'No fue posible obtener el expediente.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const payload = await request.json();

    const validation = validateExpedientePayload(payload);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validación fallida', details: validation.errors },
        { status: 400 }
      );
    }

    const item = updateExpediente(id, payload);

    if (!item) {
      return NextResponse.json(
        { message: 'Expediente no encontrado.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Expediente actualizado correctamente.', item }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: 'No fue posible actualizar el expediente.' },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const deleted = deleteExpediente(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Expediente no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Expediente eliminado correctamente.' }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: 'No fue posible eliminar el expediente.' },
      { status: 500 }
    );
  }
}
