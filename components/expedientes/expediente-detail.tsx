/**
 * Componente de vista de detalle de expediente
 */

import { Drawer, Descriptions, Empty, Spin, Tabs, Timeline, Alert, Divider, Button, Row, Col, Modal, message } from 'antd';
import { CloseOutlined, UnlockOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { ExpedienteExtended, EstadoExpediente } from '@/types/expediente';
import { EstadoBadge } from './estado-badge';

interface ExpedienteDetailProps {
  open: boolean;
  onClose: () => void;
  expediente: ExpedienteExtended | null;
  loading?: boolean;
  onCerrar?: (fechaCierre: string) => Promise<void>;
  onReabrir?: () => Promise<void>;
}

export function ExpedienteDetail({
  open,
  onClose,
  expediente,
  loading = false,
  onCerrar,
  onReabrir,
}: ExpedienteDetailProps) {
  const handleCerrar = () => {
    if (!expediente || !onCerrar) return;

    Modal.confirm({
      title: 'Cerrar expediente',
      content: `¿Deseas cerrar el expediente ${expediente.codigoExpediente}? Esta acción archivará el expediente.`,
      okText: 'Cerrar',
      cancelText: 'Cancelar',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await onCerrar(dayjs().format('YYYY-MM-DD'));
          message.success('Expediente cerrado correctamente');
          onClose();
        } catch {
          message.error('Error al cerrar el expediente');
        }
      },
    });
  };

  const handleReabrir = () => {
    if (!expediente || !onReabrir) return;

    Modal.confirm({
      title: 'Reabrir expediente',
      content: `¿Deseas reabrir el expediente ${expediente.codigoExpediente}? El expediente volverá a estado abierto.`,
      okText: 'Reabrir',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await onReabrir();
          message.success('Expediente reabierto correctamente');
          onClose();
        } catch {
          message.error('Error al reabrir el expediente');
        }
      },
    });
  };

  if (!expediente) {
    return (
      <Drawer title="Detalle del expediente" placement="right" onClose={onClose} open={open}>
        <Empty description="No hay expediente seleccionado" />
      </Drawer>
    );
  }

  return (
    <Drawer
      title={`Detalle: ${expediente.codigoExpediente}`}
      placement="right"
      onClose={onClose}
      open={open}
      width={600}
      footer={null}
    >
      <Spin spinning={loading}>
        <Tabs
          items={[
            {
              key: 'info',
              label: 'Información General',
              children: (
                <>
                  <Descriptions bordered column={1} size="small" style={{ marginBottom: 16 }}>
                    <Descriptions.Item label="Código">
                      {expediente.codigoExpediente}
                    </Descriptions.Item>
                    <Descriptions.Item label="Nombre">{expediente.nombre}</Descriptions.Item>
                    <Descriptions.Item label="Estado">
                      <EstadoBadge estado={expediente.estadoActual} size="small" />
                    </Descriptions.Item>
                    <Descriptions.Item label="Fecha de apertura">
                      {dayjs(expediente.fechaApertura).format('YYYY-MM-DD')}
                    </Descriptions.Item>
                    {expediente.fechaCierre && (
                      <Descriptions.Item label="Fecha de cierre">
                        {dayjs(expediente.fechaCierre).format('YYYY-MM-DD')}
                      </Descriptions.Item>
                    )}
                    <Descriptions.Item label="Dependencia">
                      {expediente.dependencia?.nombre || 'No asignada'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Subserie">
                      {expediente.subserie?.codigo} - {expediente.subserie?.nombre}
                    </Descriptions.Item>
                    {expediente.observacion && (
                      <Descriptions.Item label="Observación">
                        {expediente.observacion}
                      </Descriptions.Item>
                    )}
                  </Descriptions>

                  <Divider />

                  <Row gutter={8}>
                    {expediente.estadoActual === EstadoExpediente.ABIERTO && onCerrar && (
                      <Col xs={12}>
                        <Button
                          type="primary"
                          danger
                          block
                          icon={<CloseOutlined />}
                          onClick={handleCerrar}
                        >
                          Cerrar
                        </Button>
                      </Col>
                    )}
                    {[EstadoExpediente.CERRADO, EstadoExpediente.SUSPENDIDO].includes(
                      expediente.estadoActual
                    ) && onReabrir && (
                      <Col xs={12}>
                        <Button
                          type="primary"
                          block
                          icon={<UnlockOutlined />}
                          onClick={handleReabrir}
                        >
                          Reabrir
                        </Button>
                      </Col>
                    )}
                  </Row>
                </>
              ),
            },
            {
              key: 'documentos',
              label: `Documentos (${expediente.documentosCount || 0})`,
              children: (
                <Alert message="Documentos asociados serán listados aquí" type="info" showIcon />
              ),
            },
            {
              key: 'historial',
              label: `Historial (${expediente.historialCount || 0})`,
              children: (
                <Timeline
                  items={[
                    {
                      children: (
                        <>
                          <p>
                            <strong>Expediente creado</strong>
                          </p>
                          <p>{dayjs(expediente.createdAt).format('YYYY-MM-DD HH:mm')}</p>
                        </>
                      ),
                    },
                  ]}
                />
              ),
            },
          ]}
        />
      </Spin>
    </Drawer>
  );
}
