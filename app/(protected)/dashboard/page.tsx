import type { Metadata } from 'next';
import { DashboardModule } from '@/components/dashboard/dashboard-module';

export const metadata: Metadata = {
  title: 'Tablero',
};

export default function DashboardPage() {
  return <DashboardModule />;
}