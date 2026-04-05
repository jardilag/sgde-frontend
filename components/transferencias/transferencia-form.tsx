'use client';

import { Button, Form, Input, Modal, Select, Space, Typography } from 'antd';
import type { TransferenciaRequest, TipoTransferencia } from '@/types/transferencia';

interface TransferenciaFormValues {
  tipoTransferencia: TipoTransferencia;
  fechaTransferencia: string;
  observacion?: string;
  expedienteIds: string[];
}

interface TransferenciaFormProps {
  open: boolean;
  loading: boolean;
  tipoTransferencia: TipoTransferencia;
  expedientes: Array<{ label: string; value: string }>;
  onTipoTransferenciaChange: (tipo: TipoTransferencia) => void;
  onClose: () => void;
  onSubmit: (payload: TransferenciaRequest) => Promise<void>;
}

export function TransferenciaForm({
  open,
  loading,
  tipoTransferencia,
  expedientes,
  onTipoTransferenciaChange,
  onClose,
  onSubmit,
}: Readonly<TransferenciaFormProps>) {
  const [form] = Form.useForm<TransferenciaFormValues>();

  const handleFinish = async (values: TransferenciaFormValues) => {
    await onSubmit({
      tipoTransferencia: values.tipoTransferencia,
      fechaTransferencia: values.fechaTransferencia,
      observacion: values.observacion?.trim() || undefined,
      expedienteIds: values.expedienteIds,
    });

    form.resetFields();
    form.setFieldsValue({ tipoTransferencia });
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Registrar transferencia documental"
      footer={
        <Space>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="primary" htmlType="submit" form="transferencia-form" loading={loading}>
            Registrar transferencia
          </Button>
        </Space>
      }
      destroyOnHidden
    >
      <Form<TransferenciaFormValues>
        id="transferencia-form"
        form={form}
        layout="vertical"
        requiredMark={false}
        initialValues={{
          tipoTransferencia,
          expedienteIds: [],
          fechaTransferencia: new Date().toISOString().slice(0, 10),
        }}
        onFinish={handleFinish}
      >
        <Form.Item
          label="Tipo de transferencia"
          name="tipoTransferencia"
          rules={[{ required: true, message: 'Selecciona el tipo de transferencia.' }]}
        >
          <Select
            options={[
              { value: 'Primaria', label: 'Primaria' },
              { value: 'Secundaria', label: 'Secundaria' },
            ]}
            onChange={(value) => {
              form.setFieldValue('expedienteIds', []);
              onTipoTransferenciaChange(value as TipoTransferencia);
            }}
          />
        </Form.Item>

        <Form.Item
          label="Fecha de transferencia"
          name="fechaTransferencia"
          rules={[{ required: true, message: 'Selecciona la fecha de transferencia.' }]}
        >
          <Input type="date" />
        </Form.Item>

        <Form.Item
          label="Expedientes listos para transferencia"
          name="expedienteIds"
          rules={[
            {
              validator(_, value: string[] | undefined) {
                if (value && value.length > 0) {
                  return Promise.resolve();
                }

                return Promise.reject(new Error('Selecciona al menos un expediente.'));
              },
            },
          ]}
        >
          <Select
            mode="multiple"
            allowClear
            placeholder={expedientes.length ? 'Selecciona uno o más expedientes' : 'No hay expedientes elegibles para este tipo'}
            options={expedientes}
            disabled={!expedientes.length}
          />
        </Form.Item>

        <Form.Item label="Observacion" name="observacion">
          <Input.TextArea rows={3} placeholder="Notas de control para la transferencia" />
        </Form.Item>

        {!expedientes.length ? (
          <Typography.Text type="warning">
            No se encontraron expedientes elegibles para el tipo de transferencia seleccionado.
          </Typography.Text>
        ) : null}
      </Form>
    </Modal>
  );
}
