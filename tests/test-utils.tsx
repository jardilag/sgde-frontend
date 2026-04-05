import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as AntdApp, ConfigProvider, theme } from 'antd';
import esES from 'antd/locale/es_ES';
import { render } from '@testing-library/react';

if (typeof window !== 'undefined') {
  window.getComputedStyle = (() => ({
    getPropertyValue: () => '',
  })) as typeof window.getComputedStyle;
}

export function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={esES} theme={{ algorithm: theme.defaultAlgorithm }}>
        <AntdApp>{ui}</AntdApp>
      </ConfigProvider>
    </QueryClientProvider>,
  );
}