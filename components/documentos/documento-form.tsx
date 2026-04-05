'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button, Form, Input, Modal, Progress, Select, Space, Upload, message } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { Documento, DocumentoRequest, TipoRadicadoDocumento } from '@/types/documento';

const allowedMimeTypes = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.docx'];
const maxFileSizeBytes = 25 * 1024 * 1024;

export const tipoRadicadoOptions: Array<{ label: string; value: TipoRadicadoDocumento }> = [
  { label: 'Entrada', value: 'Entrada' },
  { label: 'Salida', value: 'Salida' },
  { label: 'Interno', value: 'Interno' },
];

export function validateDocumentoArchivo(file: File) {
  const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
  const isAllowedType = allowedMimeTypes.has(file.type) || allowedExtensions.includes(extension);

  if (!isAllowedType) {
    return 'Solo se permiten archivos PDF, PNG, JPG o DOCX.';
  }

  if (file.size > maxFileSizeBytes) {
    return 'El archivo supera el tamaño máximo permitido de 25 MB.';
  }

  return null;
}

function normalizeUploadValue(event: { fileList?: UploadFile[] }) {
  return event?.fileList ?? [];
}

function isValidFileList(fileList?: UploadFile[]) {
  const file = fileList?.[0]?.originFileObj as File | undefined;
  if (!file) {
    return 'Adjunta un archivo para continuar.';
  }

  return validateDocumentoArchivo(file);
}

interface DocumentoFormValues {
  tipoDocumento: string;
  tipoRadicado: TipoRadicadoDocumento;
  titulo: string;
  fechaDocumento: string;
  dependenciaId: string;
  expedienteId?: string;
  observacion?: string;
  archivo?: UploadFile[];
}

type DocumentoFormProps = Readonly<{
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (payload: DocumentoRequest, onProgress: (progress: number) => void) => Promise<Documento>;
  dependencias: Array<{ label: string; value: string }>;
  expedientes: Array<{ label: string; value: string }>;
}>;

export function DocumentoForm({ open, loading, onClose, onSubmit, dependencias, expedientes }: DocumentoFormProps) {
  const [form] = Form.useForm<DocumentoFormValues>();
  const [uploadProgress, setUploadProgress] = useState(0);
  const uploadButtonLabel = useMemo(() => (loading ? 'Radicando...' : 'Adjuntar archivo'), [loading]);

  useEffect(() => {
    if (!open) {
      form.resetFields();
      setUploadProgress(0);
    }
  }, [form, open]);

  const handleFinish = async (values: DocumentoFormValues) => {
    const validationMessage = isValidFileList(values.archivo);
    if (validationMessage) {
      message.error(validationMessage);
      return;
    }

    const archivo = values.archivo?.[0]?.originFileObj as File;
    const payload: DocumentoRequest = {
      tipoDocumento: values.tipoDocumento,
      tipoRadicado: values.tipoRadicado,
      titulo: values.titulo,
      fechaDocumento: values.fechaDocumento,
      dependenciaId: values.dependenciaId,
      expedienteId: values.expedienteId || undefined,
      observacion: values.observacion?.trim() || undefined,
      archivo,
    };

    try {
      await onSubmit(payload, setUploadProgress);
      form.resetFields();
      setUploadProgress(0);
      onClose();
    } catch {
      // The parent handles the notification and the drawer stays open.
    }
  };

  const uploadProps: UploadProps = {
    accept: allowedExtensions.join(','),
    maxCount: 1,
    multiple: false,
    beforeUpload(file) {
      const validationMessage = validateDocumentoArchivo(file);
      if (validationMessage) {
        message.error(validationMessage);
        return Upload.LIST_IGNORE;
      }

      return false;
    },
  };

  return (
    <Modal
      open={open}
      title="Nueva radicación documental"
      width={760}
      destroyOnHidden
      onCancel={onClose}
      footer={
        <Space>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="primary" htmlType="submit" form="documento-radicacion-form" loading={loading}>
            Radicar
          </Button>
        </Space>
      }
    >
      <Form<DocumentoFormValues>
        id="documento-radicacion-form"
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={handleFinish}
        initialValues={{ tipoRadicado: 'Entrada' }}
      >
        <Form.Item label="Tipo de radicado" name="tipoRadicado" rules={[{ required: true, message: 'Selecciona el tipo de radicado.' }]}>
          <Select options={tipoRadicadoOptions} />
        </Form.Item>

        <Form.Item label="Tipo de documento" name="tipoDocumento" rules={[{ required: true, message: 'Ingresa el tipo de documento.' }]}>
          <Input placeholder="Oficio, resolución, informe, memorando..." />
        </Form.Item>

        <Form.Item label="Título" name="titulo" rules={[{ required: true, message: 'Ingresa el título.' }]}>
          <Input placeholder="Título del documento radicado" />
        </Form.Item>

        <Form.Item label="Fecha del documento" name="fechaDocumento" rules={[{ required: true, message: 'Selecciona la fecha del documento.' }]}>
          <Input type="date" />
        </Form.Item>

        <Form.Item label="Dependencia" name="dependenciaId" rules={[{ required: true, message: 'Selecciona la dependencia.' }]}>
          <Select
            placeholder="Selecciona una dependencia"
            options={dependencias}
          />
        </Form.Item>

        <Form.Item label="Expediente" name="expedienteId">
          <Select
            allowClear
            placeholder="Asociar a expediente si aplica"
            options={expedientes}
          />
        </Form.Item>

        <Form.Item
          label="Archivo"
          name="archivo"
          valuePropName="fileList"
          getValueFromEvent={normalizeUploadValue}
          rules={[{ validator: async (_, fileList) => {
            const error = isValidFileList(fileList);
            if (error) {
              throw new Error(error);
            }
          } }]}
          extra="Archivos permitidos: PDF, PNG, JPG o DOCX. Tamaño máximo: 25 MB."
        >
          <Upload {...uploadProps} aria-label="Archivo a adjuntar">
            <Button icon={<UploadOutlined />}>{uploadButtonLabel}</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Observación" name="observacion">
          <Input.TextArea rows={4} placeholder="Observaciones, referencia interna o metadatos adicionales" />
        </Form.Item>

        <Progress percent={loading ? uploadProgress : 0} status={loading ? 'active' : 'normal'} showInfo={loading} />
      </Form>
    </Modal>
  );
}
