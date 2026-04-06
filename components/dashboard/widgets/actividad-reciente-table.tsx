'use client';

import { Card, Empty, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { DashboardActividadReciente } from '@/types/dashboard';

interface ActividadRecienteTableProps {
  data: DashboardActividadReciente[];
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function ActividadRecienteTable({ data }: Readonly<ActividadRecienteTableProps>) {
  const columns: ColumnsType<DashboardActividadReciente> = [
    { title: 'Fecha y hora', dataIndex: 'fechaHora', width: 170, render: (value: string) => formatDateTime(value) },
    { title: 'Usuario', dataIndex: 'usuario', width: 160 },
    { title: 'Acción', dataIndex: 'accion', width: 140 },
    { title: 'Entidad', dataIndex: 'entidadAfectada', width: 150 },
    { title: 'Descripción', dataIndex: 'descripcion', width: 320 },
  ];

  return (
    <Card className="sgde-card-elevated sgde-card-hover" title="Actividad reciente del sistema">
      <Table<DashboardActividadReciente>
        rowKey="id"
        dataSource={data}
        columns={columns}
        pagination={false}
        locale={{ emptyText: <Empty description="Sin actividad reciente" /> }}
        scroll={{ x: 900 }}
        size="middle"
      />
    </Card>
  );
}
