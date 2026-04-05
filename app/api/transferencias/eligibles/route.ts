import { NextResponse } from 'next/server';
import { listExpedientesTransferibles } from '@/services/mock-db';
import type { TipoTransferencia } from '@/types/transferencia';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tipoTransferencia = (url.searchParams.get('tipoTransferencia') as TipoTransferencia | null) ?? 'Primaria';

  if (tipoTransferencia !== 'Primaria' && tipoTransferencia !== 'Secundaria') {
    return NextResponse.json({ message: 'Tipo de transferencia no válido.' }, { status: 400 });
  }

  const items = listExpedientesTransferibles(tipoTransferencia);
  return NextResponse.json({ items }, { status: 200 });
}
