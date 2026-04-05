'use client';

import { useMemo, useState } from 'react';
import { Button, Tag, notification } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { PageHeader } from '@/components/shared/page-header';
import { ResourceTable } from '@/components/shared/resource-table';
import { useTableControls } from '@/hooks/use-table-controls';
import { useExpedientesQuery } from '@/hooks/use-expediente';
import {
  useExpedientesTransferiblesQuery,
  useTransferenciaMutations,
  useTransferenciasQuery,
} from '@/hooks/use-transferencias';
import { ExpedientesElegiblesTable } from '@/components/transferencias/expedientes-eligibles-table';
import { TransferenciaForm } from '@/components/transferencias/transferencia-form';
import { TransferenciasFilters } from '@/components/transferencias/transferencias-filters';
import type {
  Transferencia,
  TransferenciaFilters,
  TransferenciaRequest,
  TipoTransferencia,
} from '@/types/transferencia';
import { formatDate } from '@/utils/formatters';

type TransferenciaAdvancedFilters = Omit<TransferenciaFilters, 'q' | 'page' | 'pageSize'>;

const initialAdvancedFilters: TransferenciaAdvancedFilters = {};

function buildFilters(
  table: ReturnType<typeof useTableControls<Transferencia>>,
  advancedFilters: TransferenciaAdvancedFilters,
): TransferenciaFilters {
  return {
    q: table.query,
    page: table.page,
    pageSize: table.pageSize,
    ...advancedFilters,
  };
}

function tipoTagColor(tipo: TipoTransferencia) {
  return tipo === 'Primaria' ? 'geekblue' : 'purple';
}

export function TransferenciasModule() {
  const table = useTableControls<Transferencia>();
  const [formOpen, setFormOpen] = useState(false);
  const [tipoConsulta, setTipoConsulta] = useState<TipoTransferencia>('Primaria');
  const [tipoFormulario, setTipoFormulario] = useState<TipoTransferencia>('Primaria');
  const [advancedFilters, setAdvancedFilters] = useState<TransferenciaAdvancedFilters>(initialAdvancedFilters);

  const transferenciasQuery = useTransferenciasQuery(buildFilters(table, advancedFilters));
  const expedientesQuery = useExpedientesQuery();
  const elegiblesConsultaQuery = useExpedientesTransferiblesQuery(tipoConsulta);
  const elegiblesFormularioQuery = useExpedientesTransferiblesQuery(tipoFormulario);
  const { createMutation, downloadMutation } = useTransferenciaMutations();

  const expedientesOptions = useMemo(
    () =>
      expedientesQuery.data?.items.map((item) => ({
        label: `${item.codigoExpediente} - ${item.nombre}`,
        value: item.id,
      })) ?? [],
    [expedientesQuery.data?.items],
  );

  const eligiblesFormularioOptions = useMemo(
    () =>
      elegiblesFormularioQuery.data?.map((item) => ({
        label: `${item.codigoExpediente} - ${item.nombre}`,
        value: item.id,
      })) ?? [],
    [elegiblesFormularioQuery.data],
  );

  const handleCreateTransferencia = async (payload: TransferenciaRequest) => {
    try {
      await createMutation.mutateAsync(payload);
      notification.success({
        title: 'Transferencia registrada',
        description: 'La transferencia quedo registrada correctamente.',
      });
    } catch (error) {
      notification.error({
        title: 'No fue posible registrar la transferencia',
        description: error instanceof Error ? error.message : 'Ocurrio un error inesperado.',
      });
      throw error;
    }
  };

  const handleDownloadInventario = async (transferencia: Transferencia) => {
    try {
      const response = await downloadMutation.mutateAsync(transferencia.id);

      if (response.downloadUrl) {
        globalThis.open(response.downloadUrl, '_blank', 'noopener,noreferrer');
      }

      notification.success({
        title: 'Inventario disponible',
        description: 'Se proceso la descarga del inventario/FUID.',
      });
    } catch (error) {
      notification.error({
        title: 'No fue posible descargar el inventario',
        description: error instanceof Error ? error.message : 'Ocurrio un error inesperado.',
      });
    }
  };

  const columns: ColumnsType<Transferencia> = [
    {
      title: 'Tipo',
      dataIndex: 'tipoTransferencia',
      width: 130,
      render: (value: TipoTransferencia) => <Tag color={tipoTagColor(value)}>{value}</Tag>,
    },
    {
      title: 'Fecha',
      dataIndex: 'fechaTransferencia',
      width: 140,
      render: (value: string) => formatDate(value),
    },
    {
      title: 'Expedientes',
      dataIndex: 'expedientes',
      width: 350,
      render: (expedientes: Transferencia['expedientes']) => (
        <div style={{ display: 'grid', gap: 6 }}>
          {expedientes.map((expediente) => (
            <div key={expediente.id}>
              <strong>{expediente.codigoExpediente}</strong> - {expediente.nombreExpediente}
              {' '}
              <Tag>{expediente.estadoExpediente}</Tag>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Cantidad',
      dataIndex: 'cantidadExpedientes',
      width: 100,
    },
    {
      title: 'Observacion',
      dataIndex: 'observacion',
      width: 250,
      render: (value?: string) => value || 'Sin observacion',
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 190,
      fixed: 'right',
      render: (_value, record) => (
        <Button
          icon={<DownloadOutlined />}
          onClick={() => handleDownloadInventario(record)}
          disabled={!record.inventarioDisponible}
          loading={downloadMutation.isPending}
        >
          Descargar inventario
        </Button>
      ),
    },
  ];

  return (
    <div className="sgde-page-grid">
      <PageHeader
        eyebrow="Modulo de transferencias documentales"
        title="Transferencias Documentales"
        description="Registra transferencias primarias y secundarias, consulta elegibles y descarga inventarios/FUID."
        actionLabel="Registrar transferencia"
        onAction={() => {
          setTipoFormulario(tipoConsulta);
          setFormOpen(true);
        }}
      />

      <TransferenciasFilters
        expedientes={expedientesOptions}
        onApply={(filters) => {
          setAdvancedFilters(filters);
          table.setPage(1);
        }}
        onClear={() => {
          setAdvancedFilters(initialAdvancedFilters);
          table.setPage(1);
        }}
      />

      <ExpedientesElegiblesTable
        tipoTransferencia={tipoConsulta}
        loading={elegiblesConsultaQuery.isLoading || elegiblesConsultaQuery.isFetching}
        dataSource={elegiblesConsultaQuery.data ?? []}
        onTipoTransferenciaChange={setTipoConsulta}
      />

      <ResourceTable<Transferencia>
        eyebrow="Control de transferencias"
        title="Listado de transferencias"
        description="Consulta historicos de transferencia con filtros por tipo, fecha y expediente."
        searchValue={table.query}
        searchPlaceholder="Buscar por tipo, expediente u observacion"
        onSearchChange={table.updateQuery}
        onCreate={() => {
          setTipoFormulario(tipoConsulta);
          setFormOpen(true);
        }}
        createLabel="Registrar transferencia"
        loading={transferenciasQuery.isLoading || transferenciasQuery.isFetching}
        dataSource={transferenciasQuery.data?.items ?? []}
        columns={columns}
        rowKey="id"
        pagination={{
          current: transferenciasQuery.data?.meta.page,
          pageSize: transferenciasQuery.data?.meta.pageSize,
          total: transferenciasQuery.data?.meta.total,
          showSizeChanger: true,
          showTotal: (total) => `${total} transferencias`,
        }}
        onTableChange={table.handleTableChange}
      />

      <TransferenciaForm
        open={formOpen}
        loading={createMutation.isPending}
        tipoTransferencia={tipoFormulario}
        expedientes={eligiblesFormularioOptions}
        onTipoTransferenciaChange={setTipoFormulario}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreateTransferencia}
      />
    </div>
  );
}
