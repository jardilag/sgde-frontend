import { NextResponse } from 'next/server';
import { createRadicado, listRadicados } from '@/services/mock-db';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
import { validateRadicadoPayload } from '@/utils/validators';

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
  const result = listRadicados(filters);

  return NextResponse.json(result, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const validation = validateRadicadoPayload(payload);

    if (!validation.valid) {
      return NextResponse.json(
        { message: 'Revise los campos obligatorios del radicado.', errors: validation.errors },
        { status: 400 },
      );
    }

    const item = createRadicado(payload as unknown as Parameters<typeof createRadicado>[0]);

    return NextResponse.json({ message: 'Radicado creado correctamente.', item }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'No fue posible crear el radicado.' }, { status: 500 });
  }
}