import { NextResponse } from 'next/server';
import { getTransferenciaInventario } from '@/services/mock-db';

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const url = new URL(request.url);
  const shouldDownload = url.searchParams.get('download') === '1';

  const inventario = getTransferenciaInventario(id);
  if (!inventario) {
    return NextResponse.json({ message: 'Transferencia no encontrada.' }, { status: 404 });
  }

  if (shouldDownload) {
    const fileName = inventario.fileName ?? `FUID-${id}.csv`;
    const csv = ['codigoExpediente,nombreExpediente,estadoExpediente', `MOCK-${id},Inventario de transferencia,Transferido`].join('\n');

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${fileName.replace('.xlsx', '.csv')}"`,
      },
    });
  }

  return NextResponse.json(inventario, { status: 200 });
}
