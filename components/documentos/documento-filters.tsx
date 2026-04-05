'use client';

import { Button, Card, Form, Input, Select, Space, Typography } from 'antd';
import type { DocumentoFilters, TipoRadicadoDocumento } from '@/types/documento';
import { tipoRadicadoOptions } from '@/components/documentos/documento-form';

interface DocumentoFiltersFormValues {
  tipoRadicado?: TipoRadicadoDocumento;
  dependenciaId?: string;
  titulo?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}

type DocumentoFiltersProps = Readonly<{
  dependencias: Array<{ label: string; value: string }>;
  onApply: (filters: Omit<DocumentoFilters, 'q' | 'page' | 'pageSize'>) => void;
  onClear: () => void;
}>;

export function DocumentoFiltersCard({ dependencias, onApply, onClear }: DocumentoFiltersProps) {
  const [form] = Form.useForm<DocumentoFiltersFormValues>();

  const handleSubmit = (values: DocumentoFiltersFormValues) => {
    onApply({
      tipoRadicado: values.tipoRadicado,
      dependenciaId: values.dependenciaId,
      titulo: values.titulo?.trim() || undefined,
      fechaDesde: values.fechaDesde,
      fechaHasta: values.fechaHasta,
    });
  };

  const handleClear = () => {
    form.resetFields();
    onClear();
  };

  return (
    <Card className="sgde-surface" styles={{ body: { display: 'grid', gap: 16 } }}>
      <Space orientation="vertical" size={8} style={{ width: '100%' }}>
        <span className="sgde-chip">Búsqueda avanzada</span>
        <div>
          <Typography.Title level={4} style={{ marginBottom: 4 }}>
            Filtros de radicación
          </Typography.Title>
          <Typography.Text className="sgde-muted">
            Ajusta el tipo, la dependencia, la fecha o el título para reducir el listado.
          </Typography.Text>
        </div>
      </Space>

      <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
        <Form.Item label="Tipo de radicado" name="tipoRadicado">
          <Select allowClear placeholder="Todos" options={tipoRadicadoOptions} />
        </Form.Item>

        <Form.Item label="Dependencia" name="dependenciaId">
          <Select
            allowClear
            placeholder="Todas"
            options={dependencias}
          />
        </Form.Item>

        <Form.Item label="Título" name="titulo">
          <Input placeholder="Buscar por título" />
        </Form.Item>

        <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space wrap>
            <Form.Item label="Fecha desde" name="fechaDesde" style={{ marginBottom: 0 }}>
              <Input type="date" />
            </Form.Item>
            <Form.Item label="Fecha hasta" name="fechaHasta" style={{ marginBottom: 0 }}>
              <Input type="date" />
            </Form.Item>
          </Space>
          <Space>
            <Button onClick={handleClear}>Limpiar</Button>
            <Button type="primary" htmlType="submit">
              Aplicar filtros
            </Button>
          </Space>
        </Space>
      </Form>
    </Card>
  );
}
