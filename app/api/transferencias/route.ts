import { NextResponse } from 'next/server';
import { createTransferencia, listTransferencias } from '@/services/mock-db';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
import { validateTransferenciaPayload } from '@/utils/validators';
import type { TipoTransferencia } from '@/types/transferencia';

function parseFilters(request: Request) {
  const url = new URL(request.url);

  return {
    q: url.searchParams.get('q') ?? '',
    page: Number(url.searchParams.get('page') ?? '1'),
    pageSize: Number(url.searchParams.get('pageSize') ?? String(DEFAULT_PAGE_SIZE)),
    tipoTransferencia: (url.searchParams.get('tipoTransferencia') as TipoTransferencia | null) ?? undefined,
    fechaDesde: url.searchParams.get('fechaDesde') ?? undefined,
    fechaHasta: url.searchParams.get('fechaHasta') ?? undefined,
    expedienteId: url.searchParams.get('expedienteId') ?? undefined,
  };
}

export async function GET(request: Request) {
  const filters = parseFilters(request);
  const result = listTransferencias(filters);

  return NextResponse.json(result, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const validation = validateTransferenciaPayload(payload);

    if (!validation.valid) {
      return NextResponse.json(
        { message: 'Revise los campos obligatorios de la transferencia.', errors: validation.errors },
        { status: 400 },
      );
    }

    const item = createTransferencia(payload as unknown as Parameters<typeof createTransferencia>[0]);

    if (!item) {
      return NextResponse.json(
        { message: 'Al menos un expediente no es elegible para el tipo de transferencia solicitado.' },
        { status: 400 },
      );
    }

    return NextResponse.json({ message: 'Transferencia registrada correctamente.', item }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'No fue posible registrar la transferencia.' }, { status: 500 });
  }
}
