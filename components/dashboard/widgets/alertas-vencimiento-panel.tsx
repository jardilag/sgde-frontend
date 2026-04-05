'use client';

import { Card, Empty, Space, Tag, Typography } from 'antd';
import type { DashboardAlertaVencimiento } from '@/types/dashboard';

interface AlertasVencimientoPanelProps {
  data: DashboardAlertaVencimiento[];
}

export function AlertasVencimientoPanel({ data }: Readonly<AlertasVencimientoPanelProps>) {
  const hasAlerts = data.length > 0;

  return (
    <Card className="sgde-surface" title="Alertas de vencimientos">
      {hasAlerts ? (
        <Space orientation="vertical" size={12} style={{ width: '100%' }}>
          {data.map((alerta) => (
            <Card
              key={alerta.id}
              size="small"
              style={{ borderColor: alerta.severidad === 'Alta' ? '#ffccc7' : '#ffe58f' }}
            >
              <Space size={8} wrap>
                <Typography.Text strong>{alerta.titulo}</Typography.Text>
                <Tag>{alerta.tipo}</Tag>
                <Tag color={alerta.severidad === 'Alta' ? 'red' : 'orange'}>{alerta.severidad}</Tag>
              </Space>
              <Typography.Paragraph style={{ marginTop: 8, marginBottom: 0 }}>
                {`${alerta.detalle} - Fecha límite: ${alerta.fechaLimite}`}
              </Typography.Paragraph>
            </Card>
          ))}
        </Space>
      ) : (
        <Empty description="Sin alertas activas" />
      )}
    </Card>
  );
}
