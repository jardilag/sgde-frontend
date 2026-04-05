'use client';

import { Button, Card, Form, Input, Select, Space, Typography } from 'antd';
import type { TransferenciaFilters, TipoTransferencia } from '@/types/transferencia';

type TransferenciaAdvancedFilters = Omit<TransferenciaFilters, 'q' | 'page' | 'pageSize'>;

interface TransferenciasFiltersProps {
  expedientes: Array<{ label: string; value: string }>;
  onApply: (filters: TransferenciaAdvancedFilters) => void;
  onClear: () => void;
}

interface TransferenciasFiltersValues {
  tipoTransferencia?: TipoTransferencia;
  expedienteId?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}

export function TransferenciasFilters({ expedientes, onApply, onClear }: Readonly<TransferenciasFiltersProps>) {
  const [form] = Form.useForm<TransferenciasFiltersValues>();

  return (
    <Card className="sgde-surface" styles={{ body: { display: 'grid', gap: 16 } }}>
      <Space orientation="vertical" size={8} style={{ width: '100%' }}>
        <span className="sgde-chip">Filtros de transferencias</span>
        <Typography.Title level={4} style={{ margin: 0 }}>
          Consulta por tipo, fecha y expediente
        </Typography.Title>
        <Typography.Text className="sgde-muted">
          Ajusta criterios para auditar transferencias primarias y secundarias.
        </Typography.Text>
      </Space>

      <Form<TransferenciasFiltersValues>
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={(values) => onApply(values)}
      >
        <Space wrap size={16} style={{ width: '100%' }} align="start">
          <Form.Item label="Tipo" name="tipoTransferencia" style={{ minWidth: 200, marginBottom: 0 }}>
            <Select
              allowClear
              placeholder="Todos"
              options={[
                { label: 'Primaria', value: 'Primaria' },
                { label: 'Secundaria', value: 'Secundaria' },
              ]}
            />
          </Form.Item>

          <Form.Item label="Expediente" name="expedienteId" style={{ minWidth: 280, marginBottom: 0 }}>
            <Select allowClear placeholder="Todos" options={expedientes} />
          </Form.Item>

          <Form.Item label="Fecha desde" name="fechaDesde" style={{ minWidth: 190, marginBottom: 0 }}>
            <Input type="date" />
          </Form.Item>

          <Form.Item label="Fecha hasta" name="fechaHasta" style={{ minWidth: 190, marginBottom: 0 }}>
            <Input type="date" />
          </Form.Item>
        </Space>

        <Space style={{ marginTop: 16 }}>
          <Button
            onClick={() => {
              form.resetFields();
              onClear();
            }}
          >
            Limpiar filtros
          </Button>
          <Button type="primary" htmlType="submit">
            Aplicar filtros
          </Button>
        </Space>
      </Form>
    </Card>
  );
}
