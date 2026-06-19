'use client';

import { Tag } from 'antd';

const colorMap: Record<string, string> = {
  activo: 'green',
  inactivo: 'default',
  borrador: 'gold',
  'en revisión': 'processing',
  aprobado: 'blue',
  archivado: 'purple',
  abierto: 'geekblue',
  cerrado: 'green',
  pendiente: 'orange',
  activo: 'processing',
  devuelto: 'green',
  vencido: 'red',
};

interface StatusTagProps {
  value: string;
}

export function StatusTag({ value }: StatusTagProps) {
  const color = colorMap[value.toLowerCase()] ?? 'default';

  return (
    <Tag color={color} style={{ fontWeight: 600, letterSpacing: '0.01em', paddingInline: 12, boxShadow: '0 6px 16px rgba(16, 32, 51, 0.08)' }}>
      {value}
    </Tag>
  );
}