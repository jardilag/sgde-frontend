/**
 * Componente de formulario para crear/editar expediente
 */

import { Form, Input, Select, DatePicker, Drawer, Button, Space, message } from 'antd';
import dayjs from 'dayjs';
import { Expediente, ExpedienteRequest, EstadoExpediente } from '@/types/expediente';
import { validateExpedientePayload } from '@/utils/validators';

interface ExpedienteFormProps {
  open: boolean;
  mode: 'create' | 'edit';
  expediente?: Expediente | null;
  dependencias?: Array<{ id: string; nombre: string }>;
  subseries?: Array<{ id: string; codigo: string; nombre: string }>;
  onSubmit: (payload: ExpedienteRequest) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

type ExpedienteFormValues = {
  codigoExpediente: string;
  nombre: string;
  fechaApertura: dayjs.Dayjs;
  fechaCierre?: dayjs.Dayjs;
  estadoActual: EstadoExpediente;
  dependenciaId: string;
  subserieId: string;
  observacion?: string;
};

export function ExpedienteForm({
  open,
  mode,
  expediente,
  dependencias = [],
  subseries = [],
  onSubmit,
  onClose,
  loading = false,
}: ExpedienteFormProps) {
  const [form] = Form.useForm();
  const isEdit = mode === 'edit';

  const handleSubmit = async (values: ExpedienteFormValues) => {
    try {
      const payload: ExpedienteRequest = {
        codigoExpediente: values.codigoExpediente,
        nombre: values.nombre,
        fechaApertura: values.fechaApertura.format('YYYY-MM-DD'),
        fechaCierre: values.fechaCierre?.format('YYYY-MM-DD'),
        estadoActual: values.estadoActual,
        dependenciaId: values.dependenciaId,
        subserieId: values.subserieId,
        observacion: values.observacion,
      };

      const validation = validateExpedientePayload(payload as unknown as Record<string, unknown>);
      if (!validation.valid) {
        const firstError = Object.values(validation.errors)[0];
        message.error(firstError || 'Revisa los campos del formulario.');
        return;
      }

      await onSubmit(payload);
      form.resetFields();
      onClose();
      message.success(`Expediente ${isEdit ? 'actualizado' : 'creado'} correctamente`);
    } catch {
      message.error(`Error al ${isEdit ? 'actualizar' : 'crear'} expediente`);
    }
  };

  return (
    <Drawer
      title={`${isEdit ? 'Editar' : 'Nuevo'} expediente`}
      placement="right"
      onClose={onClose}
      open={open}
      width={500}
      footer={
        <Space style={{ float: 'right' }}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="primary" loading={loading} onClick={() => form.submit()}>
            {isEdit ? 'Actualizar' : 'Crear'}
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={
          expediente
            ? {
                codigoExpediente: expediente.codigoExpediente,
                nombre: expediente.nombre,
                fechaApertura: dayjs(expediente.fechaApertura),
                fechaCierre: expediente.fechaCierre ? dayjs(expediente.fechaCierre) : null,
                estadoActual: expediente.estadoActual,
                dependenciaId: expediente.dependenciaId,
                subserieId: expediente.subserieId,
                observacion: expediente.observacion,
              }
            : {
                estadoActual: EstadoExpediente.ABIERTO,
                fechaApertura: dayjs(),
                dependenciaId: dependencias[0]?.id,
                subserieId: subseries[0]?.id,
              }
        }
      >
        <Form.Item
          name="codigoExpediente"
          label="Código"
          rules={[{ required: true, message: 'Requerido' }]}
        >
          <Input placeholder="EXP-2026-0001" disabled={isEdit} />
        </Form.Item>

        <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: 'Requerido' }]}>
          <Input placeholder="Nombre del expediente" />
        </Form.Item>

        <Form.Item
          name="fechaApertura"
          label="Fecha de apertura"
          rules={[{ required: true, message: 'Requerido' }]}
        >
          <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          name="fechaCierre"
          label="Fecha de cierre"
          rules={[
            {
              validator: async (_, value) => {
                if (!value) return Promise.resolve();
                const apertura = form.getFieldValue('fechaApertura');
                if (dayjs(value).isBefore(dayjs(apertura))) {
                  return Promise.reject(new Error('Debe ser mayor a fecha de apertura'));
                }
              },
            },
          ]}
        >
          <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          name="estadoActual"
          label="Estado"
          rules={[{ required: true, message: 'Requerido' }]}
        >
          <Select placeholder="Seleccionar estado">
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

        <Form.Item
          name="dependenciaId"
          label="Dependencia"
          rules={[{ required: true, message: 'Requerido' }]}
        >
          <Select placeholder="Seleccionar dependencia">
            {dependencias.map((dep) => (
              <Select.Option key={dep.id} value={dep.id}>
                {dep.nombre}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="subserieId"
          label="Subserie"
          rules={[{ required: true, message: 'Requerido' }]}
        >
          <Select placeholder="Seleccionar subserie">
            {subseries.map((sub) => (
              <Select.Option key={sub.id} value={sub.id}>
                {sub.codigo} - {sub.nombre}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="observacion" label="Observación">
          <Input.TextArea placeholder="Notas adicionales..." rows={3} />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
