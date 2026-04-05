import { NextResponse } from 'next/server';
import { createUsuario, listUsuarios } from '@/services/mock-db';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
import { validateUsuarioPayload } from '@/utils/validators';

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
  const result = listUsuarios(filters);

  return NextResponse.json(result, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const validation = validateUsuarioPayload(payload);

    if (!validation.valid) {
      return NextResponse.json(
        { message: 'Revise los campos obligatorios del usuario.', errors: validation.errors },
        { status: 400 },
      );
    }

    const item = createUsuario(payload as unknown as Parameters<typeof createUsuario>[0]);

    return NextResponse.json({ message: 'Usuario creado correctamente.', item }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'No fue posible crear el usuario.' }, { status: 500 });
  }
}