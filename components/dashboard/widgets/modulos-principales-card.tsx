'use client';

import Link from 'next/link';
import { Card, Space, Typography } from 'antd';
import { APP_ROUTES } from '@/utils/constants';

const links = [
  { label: 'Documentos', href: APP_ROUTES.documentos },
  { label: 'Radicados', href: APP_ROUTES.radicados },
  { label: 'Préstamos', href: APP_ROUTES.prestamos },
  { label: 'Transferencias', href: APP_ROUTES.transferencias },
  { label: 'Auditoría', href: APP_ROUTES.auditoria },
];

export function ModulosPrincipalesCard() {
  return (
    <Card className="sgde-card-elevated sgde-card-hover" title="Navegación rápida" styles={{ body: { paddingTop: 20 } }}>
      <Space wrap size={[10, 10]}>
        {links.map((item) => (
          <Link key={item.href} href={item.href}>
            <span className="sgde-chip" style={{ padding: '10px 14px' }}>{item.label}</span>
          </Link>
        ))}
      </Space>
      <Typography.Paragraph className="sgde-muted" style={{ marginTop: 14, marginBottom: 0 }}>
        Accede a los módulos principales desde el tablero para seguimiento operativo.
      </Typography.Paragraph>
    </Card>
  );
}
