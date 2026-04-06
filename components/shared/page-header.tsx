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
    <div className="sgde-hero-surface sgde-panel" style={{ borderRadius: 24 }}>
      <Space orientation="vertical" size={10} style={{ width: '100%' }}>
        {eyebrow ? <span className="sgde-chip">{eyebrow}</span> : null}
        <Space align="start" style={{ width: '100%', justifyContent: 'space-between' }} wrap>
          <div>
            <Typography.Title level={2} className="sgde-panel-title">
              {title}
            </Typography.Title>
            <Typography.Paragraph className="sgde-muted sgde-panel-subtitle" style={{ maxWidth: 760 }}>
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
    </div>
  );
}