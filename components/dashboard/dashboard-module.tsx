'use client';

import { Alert, Button, Card, Col, Row, Skeleton, Space, Typography } from 'antd';
import {
  ClockCircleOutlined,
  InboxOutlined,
  ReloadOutlined,
  RiseOutlined,
  ScheduleOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { useDashboardQuery } from '@/hooks/use-dashboard';
import { PageHeader } from '@/components/shared/page-header';
import { MetricCard } from '@/components/dashboard/widgets/metric-card';
import { ExpedientesEstadoChart } from '@/components/dashboard/widgets/expedientes-estado-chart';
import { ActividadRecienteTable } from '@/components/dashboard/widgets/actividad-reciente-table';
import { AlertasVencimientoPanel } from '@/components/dashboard/widgets/alertas-vencimiento-panel';
import { ModulosPrincipalesCard } from '@/components/dashboard/widgets/modulos-principales-card';

function metricIcon(key: 'radicacionesMes' | 'prestamosActivos' | 'prestamosVencidos' | 'transferenciasRealizadas') {
  switch (key) {
    case 'radicacionesMes':
      return <InboxOutlined />;
    case 'prestamosActivos':
      return <ClockCircleOutlined />;
    case 'prestamosVencidos':
      return <WarningOutlined />;
    default:
      return <ScheduleOutlined />;
  }
}

export function DashboardModule() {
  const dashboardQuery = useDashboardQuery();

  if (dashboardQuery.isLoading) {
    return (
      <Space orientation="vertical" size={16} style={{ width: '100%' }}>
        <Skeleton.Button active block style={{ height: 78 }} />
        <Row gutter={[16, 16]}>
          {['skeleton-a', 'skeleton-b', 'skeleton-c', 'skeleton-d'].map((item) => (
            <Col key={item} xs={24} sm={12} xl={6}>
              <Card className="sgde-surface">
                <Skeleton active paragraph={{ rows: 2 }} />
              </Card>
            </Col>
          ))}
        </Row>
        <Card className="sgde-surface">
          <Skeleton active paragraph={{ rows: 8 }} />
        </Card>
      </Space>
    );
  }

  if (dashboardQuery.isError) {
    const errorMessage = dashboardQuery.error instanceof Error ? dashboardQuery.error.message : 'Error no identificado.';

    return (
      <Alert
        type="error"
        showIcon
        title="No fue posible cargar el dashboard"
        description={errorMessage}
        action={
          <Button onClick={() => dashboardQuery.refetch()} icon={<ReloadOutlined />}>
            Reintentar
          </Button>
        }
      />
    );
  }

  const data = dashboardQuery.data;

  if (!data) {
    return (
      <Alert
        type="warning"
        showIcon
        title="No hay datos disponibles para el tablero"
        description="Intente refrescar la vista o validar la conexión con la API."
      />
    );
  }

  return (
    <div className="sgde-page-grid">
      <PageHeader
        eyebrow="Tablero principal"
        title="Dashboard Ejecutivo SGDE"
        description="Métricas clave de expedientes, radicaciones, préstamos, transferencias, actividad reciente y alertas operativas."
        extra={
          <Button onClick={() => dashboardQuery.refetch()} loading={dashboardQuery.isFetching} icon={<ReloadOutlined />}>
            Refrescar
          </Button>
        }
      />

      <Row gutter={[16, 16]}>
        {data.metricasClave.map((metric) => {
          const icon = metricIcon(metric.key);

          return (
            <Col key={metric.key} xs={24} sm={12} xl={6}>
              <MetricCard label={metric.label} value={metric.total} hint={metric.hint} icon={icon} />
            </Col>
          );
        })}
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <ExpedientesEstadoChart data={data.metricasExpedientes} />
        </Col>
        <Col xs={24} xl={12}>
          <Card className="sgde-surface" title="Transferencias realizadas">
            <Space orientation="vertical" size={10} style={{ width: '100%' }}>
              {data.transferenciasResumen.map((item) => (
                <div key={item.tipoTransferencia} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography.Text>{item.tipoTransferencia}</Typography.Text>
                  <Typography.Text strong>{item.total}</Typography.Text>
                </div>
              ))}
              <Typography.Text className="sgde-muted">
                Seguimiento de transferencia primaria y secundaria por periodo de corte.
              </Typography.Text>
            </Space>
          </Card>
        </Col>
      </Row>

      <ActividadRecienteTable data={data.actividadReciente} />

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={14}>
          <AlertasVencimientoPanel data={data.alertasVencimientos} />
        </Col>
        <Col xs={24} xl={10}>
          <ModulosPrincipalesCard />
          <Card className="sgde-surface" style={{ marginTop: 16 }}>
            <Space>
              <RiseOutlined />
              <Typography.Text className="sgde-muted">
                Fecha de corte del dashboard: {new Date(data.fechaCorte).toLocaleString('es-CO')}
              </Typography.Text>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}