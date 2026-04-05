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
  return <Tag color={colorMap[value.toLowerCase()] ?? 'default'}>{value}</Tag>;
}