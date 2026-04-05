'use client';

import { Card, Empty, Progress, Space, Typography } from 'antd';
import type { DashboardExpedienteEstadoMetric } from '@/types/dashboard';

interface ExpedientesEstadoChartProps {
  data: DashboardExpedienteEstadoMetric[];
}

export function ExpedientesEstadoChart({ data }: Readonly<ExpedientesEstadoChartProps>) {
  const total = data.reduce((acc, item) => acc + item.total, 0);
  const hasData = data.length > 0;

  return (
    <Card className="sgde-surface" title="Expedientes por estado">
      {hasData ? (
        <Space orientation="vertical" size={12} style={{ width: '100%' }}>
          {data.map((item) => {
            const percent = total > 0 ? Math.round((item.total / total) * 100) : 0;

            return (
              <div key={item.estado}>
                <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                  <Typography.Text strong>{item.estado}</Typography.Text>
                  <Typography.Text>{item.total}</Typography.Text>
                </Space>
                <Progress percent={percent} showInfo={false} />
              </div>
            );
          })}
        </Space>
      ) : (
        <Empty description="Sin datos de expedientes" />
      )}
    </Card>
  );
}
