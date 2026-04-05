import { NextResponse } from 'next/server';
import { createSubserie, listSubseries } from '@/services/mock-db';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
import { validateSubseriePayload } from '@/utils/validators';

type RouteParams = {
  params: Promise<{ id: string }>;
};

function parseFilters(request: Request) {
  const url = new URL(request.url);

  return {
    q: url.searchParams.get('q') ?? '',
    page: Number(url.searchParams.get('page') ?? '1'),
    pageSize: Number(url.searchParams.get('pageSize') ?? String(DEFAULT_PAGE_SIZE)),
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  const { id: serieId } = await params;
  const filters = parseFilters(request);
  const result = listSubseries(serieId, filters);

  return NextResponse.json(result, { status: 200 });
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id: serieId } = await params;
    const payload = (await request.json()) as Record<string, unknown>;

    // Asegurar que serieId está en el payload
    (payload as Record<string, unknown>).serieId = serieId;

    const validation = validateSubseriePayload(payload);

    if (!validation.valid) {
      return NextResponse.json(
        { message: 'Revise los campos obligatorios de la subserie.', errors: validation.errors },
        { status: 400 },
      );
    }

    const item = createSubserie(payload as unknown as Parameters<typeof createSubserie>[0]);

    return NextResponse.json({ message: 'Subserie creada correctamente.', item }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'No fue posible crear la subserie.' }, { status: 500 });
  }
}
