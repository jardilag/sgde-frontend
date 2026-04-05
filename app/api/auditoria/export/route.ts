import { NextResponse } from 'next/server';
import type { AuditoriaFilters } from '@/types/auditoria';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
import { getAuditoriaExport } from '@/services/mock-db';

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
  const url = new URL(request.url);
  const shouldDownload = url.searchParams.get('download') === '1';
  const filters = parseFilters(request);
  const result = getAuditoriaExport(filters);

  if (shouldDownload) {
    const csv = [
      'fechaHora,usuario,accion,entidadAfectada,idEntidad,descripcion,ipAddress',
      '2026-04-05T10:35:00.000Z,Andrea Castro,Crear,Transferencia,TRANS-2026-0003,"Registro de transferencia primaria con 2 expedientes.",10.20.31.15',
    ].join('\n');

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${(result.fileName ?? 'auditoria.csv').replaceAll(' ', '_')}"`,
      },
    });
  }

  return NextResponse.json(result, { status: 200 });
}
