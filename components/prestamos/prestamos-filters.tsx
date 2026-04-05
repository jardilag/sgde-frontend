'use client';

import { Button, Card, Form, Select, Space, Typography } from 'antd';
import type { PrestamoEstado, PrestamoFilters } from '@/types/prestamo';

interface PrestamosFiltersFormValues {
  estado?: PrestamoEstado;
  dependenciaSolicitanteId?: string;
  expedienteId?: string;
}

interface PrestamosFiltersProps {
  dependencias: Array<{ label: string; value: string }>;
  expedientes: Array<{ label: string; value: string }>;
  onApply: (filters: Omit<PrestamoFilters, 'q' | 'page' | 'pageSize'>) => void;
  onClear: () => void;
}

const estadoOptions: Array<{ label: string; value: PrestamoEstado }> = [
  { label: 'Activo', value: 'Activo' },
  { label: 'Devuelto', value: 'Devuelto' },
  { label: 'Vencido', value: 'Vencido' },
];

export function PrestamosFilters({ dependencias, expedientes, onApply, onClear }: Readonly<PrestamosFiltersProps>) {
  const [form] = Form.useForm<PrestamosFiltersFormValues>();

  const handleSubmit = (values: PrestamosFiltersFormValues) => {
    onApply({
      estado: values.estado,
      dependenciaSolicitanteId: values.dependenciaSolicitanteId,
      expedienteId: values.expedienteId,
    });
  };

  return (
    <Card className="sgde-surface" styles={{ body: { display: 'grid', gap: 16 } }}>
      <Space orientation="vertical" size={8} style={{ width: '100%' }}>
        <span className="sgde-chip">Filtros de préstamo</span>
        <div>
          <Typography.Title level={4} style={{ marginBottom: 4 }}>
            Préstamos activos y devoluciones
          </Typography.Title>
          <Typography.Text className="sgde-muted">
            Filtra por estado, dependencia solicitante o expediente para priorizar seguimiento.
          </Typography.Text>
        </div>
      </Space>

      <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
        <Space wrap size={16} style={{ width: '100%' }}>
          <Form.Item label="Estado" name="estado" style={{ minWidth: 220, marginBottom: 0 }}>
            <Select allowClear placeholder="Todos" options={estadoOptions} />
          </Form.Item>

          <Form.Item label="Dependencia" name="dependenciaSolicitanteId" style={{ minWidth: 260, marginBottom: 0 }}>
            <Select allowClear placeholder="Todas" options={dependencias} />
          </Form.Item>

          <Form.Item label="Expediente" name="expedienteId" style={{ minWidth: 260, marginBottom: 0 }}>
            <Select allowClear placeholder="Todos" options={expedientes} />
          </Form.Item>
        </Space>

        <Space style={{ marginTop: 16 }}>
          <Button
            onClick={() => {
              form.resetFields();
              onClear();
            }}
          >
            Limpiar
          </Button>
          <Button type="primary" htmlType="submit">
            Aplicar filtros
          </Button>
        </Space>
      </Form>
    </Card>
  );
}
