'use client';

import { Button, Card, Form, Input, Select, Space, Typography } from 'antd';
import type { AuditoriaFilters } from '@/types/auditoria';

type AuditoriaAdvancedFilters = Omit<AuditoriaFilters, 'q' | 'page' | 'pageSize' | 'sortBy' | 'sortDirection'>;

interface AuditoriaFiltersProps {
  usuarios: string[];
  entidades: string[];
  acciones: string[];
  onApply: (filters: AuditoriaAdvancedFilters) => void;
  onClear: () => void;
}

interface AuditoriaFiltersValues {
  usuario?: string;
  entidadAfectada?: string;
  accion?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}

export function AuditoriaFilters({ usuarios, entidades, acciones, onApply, onClear }: Readonly<AuditoriaFiltersProps>) {
  const [form] = Form.useForm<AuditoriaFiltersValues>();

  return (
    <Card className="sgde-surface" styles={{ body: { display: 'grid', gap: 16 } }}>
      <Space orientation="vertical" size={8} style={{ width: '100%' }}>
        <span className="sgde-chip">Filtros avanzados</span>
        <Typography.Title level={4} style={{ margin: 0 }}>
          Consulta administrativa de auditoría
        </Typography.Title>
        <Typography.Text className="sgde-muted">
          Filtra por usuario, entidad, acción y rango de fechas para inspección de trazabilidad.
        </Typography.Text>
      </Space>

      <Form<AuditoriaFiltersValues>
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={(values) => onApply(values)}
      >
        <Space wrap size={16} style={{ width: '100%' }} align="start">
          <Form.Item label="Usuario" name="usuario" style={{ minWidth: 220, marginBottom: 0 }}>
            <Select
              allowClear
              placeholder="Todos"
              options={usuarios.map((value) => ({ label: value, value }))}
            />
          </Form.Item>

          <Form.Item label="Entidad" name="entidadAfectada" style={{ minWidth: 220, marginBottom: 0 }}>
            <Select
              allowClear
              placeholder="Todas"
              options={entidades.map((value) => ({ label: value, value }))}
            />
          </Form.Item>

          <Form.Item label="Acción" name="accion" style={{ minWidth: 220, marginBottom: 0 }}>
            <Select
              allowClear
              placeholder="Todas"
              options={acciones.map((value) => ({ label: value, value }))}
            />
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
