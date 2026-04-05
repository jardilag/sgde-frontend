'use client';

import { Button, Form, Input, Modal, Select, Space } from 'antd';
import type { PrestamoRequest } from '@/types/prestamo';

interface PrestamoFormValues {
  expedienteId: string;
  dependenciaSolicitanteId: string;
  fechaPrestamo: string;
  fechaDevolucionEsperada: string;
  observacion?: string;
}

interface PrestamoFormProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (payload: PrestamoRequest) => Promise<void>;
  expedientes: Array<{ label: string; value: string }>;
  dependencias: Array<{ label: string; value: string }>;
}

export function PrestamoForm({ open, loading, onClose, onSubmit, expedientes, dependencias }: Readonly<PrestamoFormProps>) {
  const [form] = Form.useForm<PrestamoFormValues>();

  const handleFinish = async (values: PrestamoFormValues) => {
    await onSubmit({
      expedienteId: values.expedienteId,
      dependenciaSolicitanteId: values.dependenciaSolicitanteId,
      fechaPrestamo: values.fechaPrestamo,
      fechaDevolucionEsperada: values.fechaDevolucionEsperada,
      observacion: values.observacion?.trim() || undefined,
    });

    form.resetFields();
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Registrar préstamo"
      footer={
        <Space>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="primary" htmlType="submit" form="prestamo-form" loading={loading}>
            Registrar
          </Button>
        </Space>
      }
      destroyOnHidden
    >
      <Form<PrestamoFormValues>
        id="prestamo-form"
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={handleFinish}
      >
        <Form.Item
          label="Expediente"
          name="expedienteId"
          rules={[{ required: true, message: 'Selecciona un expediente.' }]}
        >
          <Select placeholder="Selecciona un expediente" options={expedientes} />
        </Form.Item>

        <Form.Item
          label="Dependencia solicitante"
          name="dependenciaSolicitanteId"
          rules={[{ required: true, message: 'Selecciona la dependencia solicitante.' }]}
        >
          <Select placeholder="Selecciona la dependencia" options={dependencias} />
        </Form.Item>

        <Form.Item
          label="Fecha de préstamo"
          name="fechaPrestamo"
          rules={[{ required: true, message: 'Selecciona la fecha de préstamo.' }]}
        >
          <Input type="date" />
        </Form.Item>

        <Form.Item
          label="Fecha de devolución esperada"
          name="fechaDevolucionEsperada"
          dependencies={['fechaPrestamo']}
          rules={[
            { required: true, message: 'Selecciona la fecha de devolución esperada.' },
            ({ getFieldValue }) => ({
              validator(_, value: string | undefined) {
                const fechaPrestamo = getFieldValue('fechaPrestamo') as string | undefined;

                if (!value || !fechaPrestamo || value >= fechaPrestamo) {
                  return Promise.resolve();
                }

                return Promise.reject(
                  new Error('La devolución esperada no puede ser anterior a la fecha de préstamo.'),
                );
              },
            }),
          ]}
        >
          <Input type="date" />
        </Form.Item>

        <Form.Item label="Observación" name="observacion">
          <Input.TextArea rows={3} placeholder="Motivo del préstamo o notas de control" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
