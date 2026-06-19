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
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ minWidth: 0, flex: '1 1 320px' }}>
            <Typography.Title level={2} className="sgde-panel-title">
              {title}
            </Typography.Title>
            <Typography.Paragraph className="sgde-muted sgde-panel-subtitle" style={{ maxWidth: 760 }}>
              {description}
            </Typography.Paragraph>
          </div>
          <Space wrap style={{ flex: '0 1 auto', maxWidth: '100%' }}>
            {extra}
            {actionLabel && onAction ? (
              <Button type="primary" onClick={onAction}>
                {actionLabel}
              </Button>
            ) : null}
          </Space>
        </div>
      </Space>
    </div>
  );
}
