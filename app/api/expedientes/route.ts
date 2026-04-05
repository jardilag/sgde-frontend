/**
 * Route handler para GET y POST de expedientes
 */

import { NextRequest, NextResponse } from 'next/server';
import { listExpedientes, createExpediente } from '@/services/mock-db';
import { validateExpedientePayload } from '@/utils/validators';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || String(DEFAULT_PAGE_SIZE), 10);
    const q = searchParams.get('q') || '';
    const dependenciaId = searchParams.get('dependenciaId') || undefined;
    const subserieId = searchParams.get('subserieId') || undefined;
    const estadoActual = searchParams.get('estadoActual') || undefined;
    const fechaDesde = searchParams.get('fechaDesde') || undefined;
    const fechaHasta = searchParams.get('fechaHasta') || undefined;

    const result = listExpedientes({
      q,
      page,
      pageSize,
      dependenciaId,
      subserieId,
      estadoActual: estadoActual as never,
      fechaDesde,
      fechaHasta,
    });

    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: 'No fue posible obtener los expedientes.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    const validation = validateExpedientePayload(payload);
    if (!validation.valid) {
      return NextResponse.json(
        { message: 'Revise los campos obligatorios del expediente.', errors: validation.errors },
        { status: 400 }
      );
    }

    const item = createExpediente(payload);

    return NextResponse.json({ message: 'Expediente creado correctamente.', item }, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: 'No fue posible crear el expediente.' },
      { status: 500 }
    );
  }
}
