import { http } from '@/services/http';
import type { DashboardSummary } from '@/types/dashboard';

export async function fetchDashboardSummary() {
  const { data } = await http.get<DashboardSummary>('/dashboard');
  return data;
}