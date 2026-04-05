import { NextResponse } from 'next/server';
import { deleteDocumento, updateDocumento } from '@/services/mock-db';
import { validateDocumentoPayload } from '@/utils/validators';

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const contentType = request.headers.get('content-type') ?? '';
    const payload = contentType.includes('multipart/form-data')
      ? Object.fromEntries((await request.formData()).entries())
      : ((await request.json()) as Record<string, unknown>);
    const validation = validateDocumentoPayload(payload);

    if (!validation.valid) {
      return NextResponse.json(
        { message: 'Revise los campos obligatorios de la radicación.', errors: validation.errors },
        { status: 400 },
      );
    }

    const item = updateDocumento(id, payload as unknown as Parameters<typeof updateDocumento>[1]);

    if (!item) {
      return NextResponse.json({ message: 'Documento no encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Documento actualizado correctamente.', item }, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'No fue posible actualizar el documento.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const deleted = deleteDocumento(id);

  if (!deleted) {
    return NextResponse.json({ message: 'Documento no encontrado.' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Documento eliminado correctamente.' }, { status: 200 });
}