/**
 * Componentes reutilizables para filtros avanzados de expedientes
 */

import { Form, Input, Select, DatePicker, Button, Col, Row, Collapse } from 'antd';
import { ClearOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import { ExpedienteFilters, EstadoExpediente } from '@/types/expediente';

interface FiltrosAvanzadosProps {
  onFilter: (filters: ExpedienteFilters) => void;
  dependencias?: Array<{ id: string; nombre: string }>;
  subseries?: Array<{ id: string; codigo: string; nombre: string }>;
  loading?: boolean;
}

type FiltroFormValues = {
  codigoExpediente?: string;
  nombre?: string;
  dependenciaId?: string;
  subserieId?: string;
  estadoActual?: EstadoExpediente;
  fechaFecha?: [Dayjs, Dayjs];
};

export function FiltrosAvanzados({
  onFilter,
  dependencias = [],
  subseries = [],
  loading = false,
}: FiltrosAvanzadosProps) {
  const [form] = Form.useForm();

  const handleFilter = (values: FiltroFormValues) => {
    const filters: ExpedienteFilters = {
      codigoExpediente: values.codigoExpediente || undefined,
      nombre: values.nombre || undefined,
      dependenciaId: values.dependenciaId || undefined,
      subserieId: values.subserieId || undefined,
      estadoActual: values.estadoActual || undefined,
      fechaDesde: values.fechaFecha?.[0]?.format('YYYY-MM-DD') || undefined,
      fechaHasta: values.fechaFecha?.[1]?.format('YYYY-MM-DD') || undefined,
    };
    onFilter(filters);
  };

  const handleReset = () => {
    form.resetFields();
    onFilter({});
  };

  return (
    <Collapse
      items={[
        {
          key: '1',
          label: 'Filtros Avanzados',
          children: (
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFilter}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item name="codigoExpediente" label="Código">
                    <Input placeholder="EXP-2026-0001" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <Form.Item name="nombre" label="Nombre">
                    <Input placeholder="Búsqueda de nombre" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <Form.Item name="estadoActual" label="Estado">
                    <Select placeholder="Seleccionar estado" allowClear>
                      <Select.Option value={EstadoExpediente.ABIERTO}>
                        {EstadoExpediente.ABIERTO}
                      </Select.Option>
                      <Select.Option value={EstadoExpediente.CERRADO}>
                        {EstadoExpediente.CERRADO}
                      </Select.Option>
                      <Select.Option value={EstadoExpediente.SUSPENDIDO}>
                        {EstadoExpediente.SUSPENDIDO}
                      </Select.Option>
                      <Select.Option value={EstadoExpediente.REABIERTO}>
                        {EstadoExpediente.REABIERTO}
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <Form.Item name="dependenciaId" label="Dependencia">
                    <Select placeholder="Seleccionar dependencia" allowClear>
                      {dependencias.map((dep) => (
                        <Select.Option key={dep.id} value={dep.id}>
                          {dep.nombre}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <Form.Item name="subserieId" label="Subserie">
                    <Select placeholder="Seleccionar subserie" allowClear>
                      {subseries.map((sub) => (
                        <Select.Option key={sub.id} value={sub.id}>
                          {sub.codigo} - {sub.nombre}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={6}>
                  <Form.Item name="fechaFecha" label="Rango de fechas">
                    <DatePicker.RangePicker
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD"
                      placeholder={['Desde', 'Hasta']}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={12} sm={6}>
                  <Button type="primary" htmlType="submit" block loading={loading}>
                    Filtrar
                  </Button>
                </Col>
                <Col xs={12} sm={6}>
                  <Button icon={<ClearOutlined />} onClick={handleReset} block>
                    Limpiar
                  </Button>
                </Col>
              </Row>
            </Form>
          ),
        },
      ]}
    />
  );
}
