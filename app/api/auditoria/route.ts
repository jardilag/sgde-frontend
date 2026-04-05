import { NextResponse } from 'next/server';
import type { AuditoriaFilters } from '@/types/auditoria';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
import { listAuditoria } from '@/services/mock-db';

function parseFilters(request: Request): AuditoriaFilters {
  const url = new URL(request.url);

  return {
    q: url.searchParams.get('q') ?? '',
    page: Number(url.searchParams.get('page') ?? '1'),
    pageSize: Number(url.searchParams.get('pageSize') ?? String(DEFAULT_PAGE_SIZE)),
    usuario: url.searchParams.get('usuario') ?? undefined,
    entidadAfectada: url.searchParams.get('entidadAfectada') ?? undefined,
    accion: url.searchParams.get('accion') ?? undefined,
    fechaDesde: url.searchParams.get('fechaDesde') ?? undefined,
    fechaHasta: url.searchParams.get('fechaHasta') ?? undefined,
    sortBy: 'fechaHora',
    sortDirection: (url.searchParams.get('sortDirection') as 'asc' | 'desc' | null) ?? 'desc',
  };
}

export async function GET(request: Request) {
  const filters = parseFilters(request);
  const result = listAuditoria(filters);

  return NextResponse.json(result, { status: 200 });
}
