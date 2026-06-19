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
            colorWarning: '#b54708',
            colorError: '#b42318',
            colorBgBase: '#eef3f8',
            colorBgContainer: 'rgba(255, 255, 255, 0.92)',
            colorBorder: 'rgba(16, 32, 51, 0.12)',
            borderRadius: 14,
            borderRadiusLG: 20,
            fontFamily: 'var(--font-manrope), Manrope, sans-serif',
            boxShadow: '0 28px 60px rgba(16, 32, 51, 0.08)',
          },
          components: {
            Layout: {
              bodyBg: 'transparent',
              headerBg: 'transparent',
              siderBg: 'transparent',
            },
            Card: {
              borderRadiusLG: 20,
              bodyPaddingSM: 20,
            },
            Button: {
              controlHeight: 44,
            },
            Input: {
              controlHeight: 44,
            },
            Menu: {
              itemBg: 'transparent',
              itemBorderRadius: 12,
            },
            Table: {
              headerBg: '#f3f6fa',
              headerColor: '#102033',
              borderColor: 'rgba(16, 32, 51, 0.08)',
            },
            Alert: {
              borderRadiusLG: 14,
            },
            Tag: {
              borderRadiusSM: 999,
            },
          },
        }}
      >
        <AntdApp>{children}</AntdApp>
      </ConfigProvider>
    </QueryClientProvider>
  );
}