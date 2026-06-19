'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button, Form, Input, Modal, Progress, Select, Space, Upload, message } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { Documento, DocumentoRequest, TipoRadicadoDocumento } from '@/types/documento';
import { EstadoExpediente, type CarpetaExpediente, type CarpetaExpedienteRequest, type Expediente, type ExpedienteRequest } from '@/types/expediente';

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
  carpetaId?: string;
  observacion?: string;
  archivo?: UploadFile[];
}

interface ExpedienteQuickFormValues {
  codigoExpediente: string;
  nombre: string;
  dependenciaId: string;
  subserieId: string;
  observacion?: string;
}

interface CarpetaQuickFormValues {
  nombre: string;
  descripcion?: string;
}

type DocumentoFormProps = Readonly<{
  open: boolean;
  loading: boolean;
  initialExpedienteId?: string | null;
  onClose: () => void;
  onSubmit: (payload: DocumentoRequest, onProgress: (progress: number) => void) => Promise<Documento>;
  dependencias: Array<{ label: string; value: string }>;
  expedientes: Array<{ label: string; value: string }>;
  subseries: Array<{ label: string; value: string }>;
  carpetas: Array<{ label: string; value: string }>;
  carpetasLoading: boolean;
  onExpedienteChange: (expedienteId: string | null) => void;
  onCreateExpediente: (payload: ExpedienteRequest) => Promise<Expediente>;
  onCreateCarpeta: (expedienteId: string, payload: CarpetaExpedienteRequest) => Promise<CarpetaExpediente>;
}>;

export function DocumentoForm({
  open,
  loading,
  initialExpedienteId,
  onClose,
  onSubmit,
  dependencias,
  expedientes,
  subseries,
  carpetas,
  carpetasLoading,
  onExpedienteChange,
  onCreateExpediente,
  onCreateCarpeta,
}: DocumentoFormProps) {
  const [form] = Form.useForm<DocumentoFormValues>();
  const [expedienteForm] = Form.useForm<ExpedienteQuickFormValues>();
  const [carpetaForm] = Form.useForm<CarpetaQuickFormValues>();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [expedienteModalOpen, setExpedienteModalOpen] = useState(false);
  const [carpetaModalOpen, setCarpetaModalOpen] = useState(false);
  const [quickCreateLoading, setQuickCreateLoading] = useState(false);
  const selectedExpedienteId = Form.useWatch('expedienteId', form);
  const currentExpedienteId = selectedExpedienteId ?? initialExpedienteId ?? null;
  const uploadButtonLabel = useMemo(() => (loading ? 'Radicando...' : 'Adjuntar archivo'), [loading]);

  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [form, open]);

  useEffect(() => {
    if (open && initialExpedienteId) {
      form.setFieldsValue({ expedienteId: initialExpedienteId, carpetaId: undefined });
      onExpedienteChange(initialExpedienteId);
    }
  }, [form, initialExpedienteId, onExpedienteChange, open]);

  const handleClose = () => {
    setUploadProgress(0);
    onExpedienteChange(null);
    onClose();
  };

  const handleCreateExpediente = async (values: ExpedienteQuickFormValues) => {
    setQuickCreateLoading(true);

    try {
      const expediente = await onCreateExpediente({
        codigoExpediente: values.codigoExpediente,
        nombre: values.nombre,
        fechaApertura: new Date().toISOString().slice(0, 10),
        estadoActual: EstadoExpediente.ABIERTO,
        dependenciaId: values.dependenciaId,
        subserieId: values.subserieId,
        observacion: values.observacion?.trim() || undefined,
      });

      form.setFieldsValue({ expedienteId: expediente.id, carpetaId: undefined });
      onExpedienteChange(expediente.id);
      expedienteForm.resetFields();
      setExpedienteModalOpen(false);
      message.success('Expediente creado y seleccionado.');
    } catch {
      message.error('No fue posible crear el expediente.');
    } finally {
      setQuickCreateLoading(false);
    }
  };

  const handleCreateCarpeta = async (values: CarpetaQuickFormValues) => {
    if (!currentExpedienteId) {
      message.warning('Selecciona un expediente antes de crear la carpeta.');
      return;
    }

    setQuickCreateLoading(true);

    try {
      const carpeta = await onCreateCarpeta(currentExpedienteId, {
        nombre: values.nombre,
        descripcion: values.descripcion?.trim() || undefined,
      });

      form.setFieldsValue({ carpetaId: carpeta.id });
      carpetaForm.resetFields();
      setCarpetaModalOpen(false);
      message.success('Carpeta creada y seleccionada.');
    } catch {
      message.error('No fue posible crear la carpeta.');
    } finally {
      setQuickCreateLoading(false);
    }
  };

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
      carpetaId: values.carpetaId || undefined,
      observacion: values.observacion?.trim() || undefined,
      archivo,
    };

    try {
      await onSubmit(payload, setUploadProgress);
      form.resetFields();
      setUploadProgress(0);
      onExpedienteChange(null);
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
      onCancel={handleClose}
      footer={
        <Space>
          <Button onClick={handleClose}>Cancelar</Button>
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

        <Form.Item label="Expediente" required>
          <Space.Compact style={{ width: '100%' }}>
            <Form.Item name="expedienteId" noStyle rules={[{ required: true, message: 'Selecciona o crea el expediente.' }]}>
              <Select
                showSearch
                allowClear
                placeholder="Buscar o asociar expediente"
                options={expedientes}
                filterOption={(input, option) => String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                onChange={(value) => {
                  form.setFieldsValue({ carpetaId: undefined });
                  onExpedienteChange(value ?? null);
                }}
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Button onClick={() => setExpedienteModalOpen(true)}>Nuevo</Button>
          </Space.Compact>
        </Form.Item>

        <Form.Item label="Carpeta del expediente" required>
          <Space.Compact style={{ width: '100%' }}>
            <Form.Item name="carpetaId" noStyle rules={[{ required: true, message: 'Selecciona la carpeta donde se guardará el documento.' }]}>
              <Select
                showSearch
                disabled={!currentExpedienteId}
                loading={carpetasLoading}
                placeholder={currentExpedienteId ? 'Selecciona carpeta' : 'Selecciona primero un expediente'}
                options={carpetas}
                filterOption={(input, option) => String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Button disabled={!currentExpedienteId} onClick={() => setCarpetaModalOpen(true)}>Nueva</Button>
          </Space.Compact>
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

      <Modal
        open={expedienteModalOpen}
        title="Crear expediente"
        onCancel={() => setExpedienteModalOpen(false)}
        onOk={() => expedienteForm.submit()}
        confirmLoading={quickCreateLoading}
        destroyOnHidden
      >
        <Form form={expedienteForm} layout="vertical" onFinish={handleCreateExpediente}>
          <Form.Item name="codigoExpediente" label="Código" rules={[{ required: true, message: 'Ingresa el código.' }]}>
            <Input placeholder="EXP-2026-0007" />
          </Form.Item>
          <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: 'Ingresa el nombre.' }]}>
            <Input placeholder="Nombre del expediente" />
          </Form.Item>
          <Form.Item name="dependenciaId" label="Dependencia" rules={[{ required: true, message: 'Selecciona la dependencia.' }]}>
            <Select options={dependencias} />
          </Form.Item>
          <Form.Item name="subserieId" label="Subserie" rules={[{ required: true, message: 'Selecciona la subserie.' }]}>
            <Select options={subseries} />
          </Form.Item>
          <Form.Item name="observacion" label="Observación">
            <Input.TextArea rows={3} placeholder="Notas del expediente" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={carpetaModalOpen}
        title="Crear carpeta"
        onCancel={() => setCarpetaModalOpen(false)}
        onOk={() => carpetaForm.submit()}
        confirmLoading={quickCreateLoading}
        destroyOnHidden
      >
        <Form form={carpetaForm} layout="vertical" onFinish={handleCreateCarpeta}>
          <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: 'Ingresa el nombre.' }]}>
            <Input placeholder="Carpeta principal, Anexos, Soportes..." />
          </Form.Item>
          <Form.Item name="descripcion" label="Descripción">
            <Input.TextArea rows={3} placeholder="Descripción opcional" />
          </Form.Item>
        </Form>
      </Modal>
    </Modal>
  );
}
