'use client';

import { Tag } from 'antd';
import type { PrestamoEstado } from '@/types/prestamo';

const estadoColor: Record<PrestamoEstado, string> = {
  Activo: 'processing',
  Devuelto: 'green',
  Vencido: 'red',
};

interface PrestamoEstadoTagProps {
  estado: PrestamoEstado;
}

export function PrestamoEstadoTag({ estado }: Readonly<PrestamoEstadoTagProps>) {
  return <Tag color={estadoColor[estado]}>{estado}</Tag>;
}
