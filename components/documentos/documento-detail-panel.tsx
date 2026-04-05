'use client';

import { Descriptions, Empty, Image, Modal, Tag } from 'antd';
import type { Documento } from '@/types/documento';
import { formatDate, formatFileSize } from '@/utils/formatters';

type DocumentoDetailPanelProps = Readonly<{
  documento: Documento | null;
  open: boolean;
  onClose: () => void;
}>;

function renderPreview(documento: Documento) {
  if (!documento.previewUrl) {
    return (
      <Empty
        description="El backend no entregó una URL de vista previa para este documento."
        style={{ margin: '24px 0' }}
      />
    );
  }

  if (documento.mimeType?.startsWith('image/')) {
    return <Image src={documento.previewUrl} alt={documento.titulo} style={{ width: '100%', borderRadius: 12 }} />;
  }

  return (
    <iframe
      title={`Vista previa de ${documento.numeroRadicado ?? documento.radicado}`}
      src={documento.previewUrl}
      style={{ width: '100%', minHeight: 560, border: '1px solid rgba(16, 32, 51, 0.12)', borderRadius: 12 }}
    />
  );
}

export function DocumentoDetailPanel({ documento, open, onClose }: DocumentoDetailPanelProps) {
  return (
    <Modal
      open={open}
      title={documento ? `Detalle de ${documento.numeroRadicado ?? documento.radicado}` : 'Detalle de radicación'}
      onCancel={onClose}
      footer={null}
      centered
      style={{ width: 860 }}
    >
      {documento ? (
        <div style={{ display: 'grid', gap: 16, width: '100%' }}>
          <p className="sgde-muted" style={{ marginBottom: 0 }}>
            {documento.titulo}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <Tag color="blue">{documento.tipoRadicado ?? 'Sin tipo'}</Tag>
            <Tag color="geekblue">{documento.tipoDocumento}</Tag>
            <Tag color="cyan">{documento.dependenciaNombre ?? documento.dependencia ?? 'Sin dependencia'}</Tag>
            {documento.expedienteCodigo ? <Tag color="green">{documento.expedienteCodigo}</Tag> : null}
          </div>

          <Descriptions bordered size="small" column={1}>
            <Descriptions.Item label="Número de radicado">{documento.numeroRadicado ?? documento.radicado}</Descriptions.Item>
            <Descriptions.Item label="Fecha del documento">{formatDate(documento.fechaDocumento ?? documento.fechaRadicacion)}</Descriptions.Item>
            <Descriptions.Item label="Dependencia">{documento.dependenciaNombre ?? documento.dependencia ?? 'Sin dato'}</Descriptions.Item>
            <Descriptions.Item label="Expediente">{documento.expedienteCodigo ?? documento.expedienteId ?? 'No asociado'}</Descriptions.Item>
            <Descriptions.Item label="Archivo">{documento.archivoNombre ?? documento.metadata?.nombreArchivo ?? 'Sin archivo'}</Descriptions.Item>
            <Descriptions.Item label="Tipo MIME">{documento.mimeType ?? documento.metadata?.mimeType ?? 'Sin dato'}</Descriptions.Item>
            <Descriptions.Item label="Tamaño">{formatFileSize(documento.tamanioBytes ?? documento.metadata?.tamanioBytes)}</Descriptions.Item>
            <Descriptions.Item label="Hash">{documento.hash ?? documento.metadata?.hash ?? 'Sin hash'}</Descriptions.Item>
            <Descriptions.Item label="Observación">{documento.observacion ?? documento.resumen ?? 'Sin observación'}</Descriptions.Item>
          </Descriptions>

          {documento.previewUrl ? (
            <div>
              <strong>Vista previa</strong>
              {renderPreview(documento)}
            </div>
          ) : (
            <output className="sgde-surface" style={{ padding: 16, borderRadius: 12, display: 'block' }}>
              <strong>Sin vista previa</strong>
              <p className="sgde-muted" style={{ marginBottom: 0, marginTop: 8 }}>
                La API puede devolver una URL de preview para documentos PDF o imágenes. Si no existe, el archivo sigue disponible para consulta de metadatos.
              </p>
            </output>
          )}
        </div>
      ) : (
        <Empty description="Selecciona un documento para ver el detalle." />
      )}
    </Modal>
  );
}
