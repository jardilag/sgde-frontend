/**
 * Componente reutilizable para badge de estado de expediente
 */

import { Badge, Tooltip } from 'antd';
import type { BadgeProps } from 'antd';
import { EstadoExpediente } from '@/types/expediente';

interface EstadoBadgeProps {
  estado: EstadoExpediente;
  size?: 'small' | 'default';
}

const estadoConfig: Record<EstadoExpediente, { color: BadgeProps['status']; tooltip: string }> = {
  [EstadoExpediente.ABIERTO]: {
    color: 'processing',
    tooltip: 'Expediente activo y en procesamiento',
  },
  [EstadoExpediente.CERRADO]: {
    color: 'success',
    tooltip: 'Expediente cerrado y archivado',
  },
  [EstadoExpediente.SUSPENDIDO]: {
    color: 'warning',
    tooltip: 'Expediente suspendido temporalmente',
  },
  [EstadoExpediente.REABIERTO]: {
    color: 'processing',
    tooltip: 'Expediente reabierto para revision',
  },
};

export function EstadoBadge({ estado, size = 'default' }: EstadoBadgeProps) {
  const config = estadoConfig[estado];
  const isSmall = size === 'small';

  return (
    <Tooltip title={config.tooltip}>
      <Badge
        status={config.color}
        text={estado}
        style={{
          fontSize: isSmall ? '12px' : '14px',
          fontWeight: 500,
        }}
      />
    </Tooltip>
  );
}
