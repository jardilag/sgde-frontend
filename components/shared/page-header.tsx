'use client';

import { Button, Space, Typography } from 'antd';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  extra?: React.ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actionLabel,
  onAction,
  extra,
}: PageHeaderProps) {
  return (
    <Space orientation="vertical" size={10} style={{ width: '100%' }}>
      {eyebrow ? <span className="sgde-chip">{eyebrow}</span> : null}
      <Space align="start" style={{ width: '100%', justifyContent: 'space-between' }} wrap>
        <div>
          <Typography.Title level={2} style={{ margin: 0 }}>
            {title}
          </Typography.Title>
          <Typography.Paragraph style={{ marginBottom: 0, maxWidth: 760 }} className="sgde-muted">
            {description}
          </Typography.Paragraph>
        </div>
        <Space>
          {extra}
          {actionLabel && onAction ? (
            <Button type="primary" onClick={onAction}>
              {actionLabel}
            </Button>
          ) : null}
        </Space>
      </Space>
    </Space>
  );
}