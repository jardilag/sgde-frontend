'use client';

import { Card, Space, Statistic } from 'antd';

interface MetricCardProps {
  label: string;
  value: number;
  hint: string;
  icon: React.ReactNode;
}

export function MetricCard({ label, value, hint, icon }: Readonly<MetricCardProps>) {
  return (
    <Card className="sgde-card-elevated sgde-card-hover" styles={{ body: { padding: 24 } }}>
      <Space orientation="vertical" size={12} style={{ width: '100%' }}>
        <span className="sgde-chip">{label}</span>
        <Space align="center" style={{ justifyContent: 'space-between', width: '100%' }}>
          <div>
            <Statistic value={value} title={hint} prefix={icon} />
          </div>
        </Space>
      </Space>
    </Card>
  );
}
