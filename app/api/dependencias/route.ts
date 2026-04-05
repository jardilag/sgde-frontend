import { NextResponse } from 'next/server';
import { createDependencia, listDependencias } from '@/services/mock-db';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
import { validateDependenciaPayload } from '@/utils/validators';

function parseFilters(request: Request) {
  const url = new URL(request.url);

  return {
    q: url.searchParams.get('q') ?? '',
    page: Number(url.searchParams.get('page') ?? '1'),
    pageSize: Number(url.searchParams.get('pageSize') ?? String(DEFAULT_PAGE_SIZE)),
  };
}

export async function GET(request: Request) {
  const filters = parseFilters(request);
  const result = listDependencias(filters);

  return NextResponse.json(result, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const validation = validateDependenciaPayload(payload);

    if (!validation.valid) {
      return NextResponse.json(
        { message: 'Revise los campos obligatorios de la dependencia.', errors: validation.errors },
        { status: 400 },
      );
    }

    const item = createDependencia(payload as unknown as Parameters<typeof createDependencia>[0]);

    return NextResponse.json({ message: 'Dependencia creada correctamente.', item }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'No fue posible crear la dependencia.' }, { status: 500 });
  }
}
