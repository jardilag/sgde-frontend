'use client';

import { Card, Select, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { ExpedienteTransferible, TipoTransferencia } from '@/types/transferencia';

interface ExpedientesElegiblesTableProps {
  tipoTransferencia: TipoTransferencia;
  loading: boolean;
  dataSource: ExpedienteTransferible[];
  onTipoTransferenciaChange: (tipo: TipoTransferencia) => void;
}

export function ExpedientesElegiblesTable({
  tipoTransferencia,
  loading,
  dataSource,
  onTipoTransferenciaChange,
}: Readonly<ExpedientesElegiblesTableProps>) {
  const columns: ColumnsType<ExpedienteTransferible> = [
    { title: 'Codigo', dataIndex: 'codigoExpediente', width: 170 },
    { title: 'Expediente', dataIndex: 'nombre', width: 260 },
    {
      title: 'Estado',
      dataIndex: 'estadoActual',
      width: 120,
      render: (value: string) => <Tag color={value === 'Cerrado' ? 'blue' : 'gold'}>{value}</Tag>,
    },
    { title: 'Dependencia', dataIndex: 'dependenciaNombre', width: 200 },
    { title: 'Motivo elegible', dataIndex: 'motivoElegible', width: 260 },
  ];

  return (
    <Card className="sgde-surface" styles={{ body: { display: 'grid', gap: 14 } }}>
      <Space align="start" style={{ justifyContent: 'space-between', width: '100%' }} wrap>
        <div>
          <span className="sgde-chip">Expedientes listos</span>
          <Typography.Title level={4} style={{ margin: '8px 0 4px 0' }}>
            Elegibles para transferencia
          </Typography.Title>
          <Typography.Text className="sgde-muted">
            Consulta expedientes que ya cumplen condiciones para traslado archivistico.
          </Typography.Text>
        </div>

        <Select
          value={tipoTransferencia}
          style={{ minWidth: 180 }}
          options={[
            { label: 'Primaria', value: 'Primaria' },
            { label: 'Secundaria', value: 'Secundaria' },
          ]}
          onChange={(value) => onTipoTransferenciaChange(value as TipoTransferencia)}
        />
      </Space>

      <Table<ExpedienteTransferible>
        rowKey="id"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: 5,
          showSizeChanger: false,
          showTotal: (total) => `${total} elegibles`,
        }}
        scroll={{ x: 960 }}
      />
    </Card>
  );
}
