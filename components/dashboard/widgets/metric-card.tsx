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
    <Card className="sgde-surface">
      <Space orientation="vertical" size={8}>
        <span className="sgde-chip">{label}</span>
        <Statistic value={value} title={hint} prefix={icon} />
      </Space>
    </Card>
  );
}
