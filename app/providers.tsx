'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as AntdApp, ConfigProvider, theme } from 'antd';
import esES from 'antd/locale/es_ES';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30_000,
    },
  },
});

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        locale={esES}
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: {
            colorPrimary: '#0f4c81',
            colorInfo: '#0f4c81',
            colorSuccess: '#0a7f7c',
            colorWarning: '#c2410c',
            colorError: '#b42318',
            borderRadius: 10,
            fontFamily: 'var(--font-manrope), Manrope, sans-serif',
          },
          components: {
            Layout: {
              bodyBg: 'transparent',
              headerBg: 'transparent',
              siderBg: 'transparent',
            },
            Card: {
              borderRadiusLG: 18,
            },
            Table: {
              headerBg: '#f3f6fa',
            },
          },
        }}
      >
        <AntdApp>{children}</AntdApp>
      </ConfigProvider>
    </QueryClientProvider>
  );
}