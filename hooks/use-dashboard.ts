'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchDashboardSummary } from '@/services/dashboard.service';

export const dashboardKeys = {
  all: ['dashboard'] as const,
};

export function useDashboardQuery() {
  return useQuery({
    queryKey: dashboardKeys.all,
    queryFn: fetchDashboardSummary,
  });
}