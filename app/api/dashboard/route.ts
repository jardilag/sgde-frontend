import { NextResponse } from 'next/server';
import { getDashboardSummary } from '@/services/mock-db';

export async function GET() {
  return NextResponse.json(getDashboardSummary(), { status: 200 });
}