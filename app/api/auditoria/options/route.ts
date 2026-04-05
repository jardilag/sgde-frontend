import { NextResponse } from 'next/server';
import { getAuditoriaOptions } from '@/services/mock-db';

export async function GET() {
  const result = getAuditoriaOptions();
  return NextResponse.json(result, { status: 200 });
}
