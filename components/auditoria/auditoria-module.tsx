'use client';

import { useMemo, useState } from 'react';
import { Button, notification } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { PageHeader } from '@/components/shared/page-header';
import { ResourceTable } from '@/components/shared/resource-table';
import { AuditoriaFilters } from '@/components/auditoria/auditoria-filters';
import { useTableControls } from '@/hooks/use-table-controls';
import { useAuditoriaMutations, useAuditoriaOptionsQuery, useAuditoriaQuery } from '@/hooks/use-auditoria';
import type { AuditoriaFilters as AuditoriaFiltersType, AuditoriaRegistro } from '@/types/auditoria';

type AuditoriaAdvancedFilters = Omit<AuditoriaFiltersType, 'q' | 'page' | 'pageSize' | 'sortBy' | 'sortDirection'>;

const initialAdvancedFilters: AuditoriaAdvancedFilters = {};

function buildFilters(
  table: ReturnType<typeof useTableControls<AuditoriaRegistro>>,
  advancedFilters: AuditoriaAdvancedFilters,
): AuditoriaFiltersType {
  return {
    q: table.query,
    page: table.page,
    pageSize: table.pageSize,
    sortBy: 'fechaHora',
    sortDirection: 'desc',
    ...advancedFilters,
  };
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function AuditoriaModule() {
  const table = useTableControls<AuditoriaRegistro>();
  const [advancedFilters, setAdvancedFilters] = useState<AuditoriaAdvancedFilters>(initialAdvancedFilters);

  const filters = buildFilters(table, advancedFilters);
  const auditoriaQuery = useAuditoriaQuery(filters);
  const optionsQuery = useAuditoriaOptionsQuery();
  const { exportMutation } = useAuditoriaMutations();

  const columns: ColumnsType<AuditoriaRegistro> = [
    {
      title: 'Fecha y hora',
      dataIndex: 'fechaHora',
      width: 180,
      render: (value: string) => formatDateTime(value),
    },
    {
      title: 'Usuario',
      dataIndex: 'usuario',
      width: 180,
    },
    {
      title: 'Acción',
      dataIndex: 'accion',
      width: 160,
    },
    {
      title: 'Entidad',
      dataIndex: 'entidadAfectada',
      width: 170,
    },
    {
      title: 'ID entidad',
      dataIndex: 'idEntidad',
      width: 160,
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      width: 330,
    },
    {
      title: 'IP',
      dataIndex: 'ipAddress',
      width: 140,
      render: (value?: string) => value || 'N/A',
    },
  ];

  const canExport = useMemo(() => (auditoriaQuery.data?.items.length ?? 0) > 0, [auditoriaQuery.data?.items.length]);

  const handleExport = async () => {
    try {
      const result = await exportMutation.mutateAsync(filters);

      if (result.downloadUrl) {
        globalThis.open(result.downloadUrl, '_blank', 'noopener,noreferrer');
      }

      notification.success({
        title: 'Exportación preparada',
        description: 'Se procesó la exportación de auditoría.',
      });
    } catch (error) {
      notification.error({
        title: 'No fue posible exportar la auditoría',
        description: error instanceof Error ? error.message : 'Ocurrió un error inesperado.',
      });
    }
  };

  return (
    <div className="sgde-page-grid">
      <PageHeader
        eyebrow="Módulo de auditoría"
        title="Auditoría del Sistema"
        description="Consulta trazabilidad de acciones administrativas con filtros por usuario, entidad, acción y fechas."
        extra={
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExport}
            loading={exportMutation.isPending}
            disabled={!canExport}
          >
            Exportar auditoría
          </Button>
        }
      />

      <AuditoriaFilters
        usuarios={optionsQuery.data?.usuarios ?? []}
        entidades={optionsQuery.data?.entidades ?? []}
        acciones={optionsQuery.data?.acciones ?? []}
        onApply={(value) => {
          setAdvancedFilters(value);
          table.setPage(1);
        }}
        onClear={() => {
          setAdvancedFilters(initialAdvancedFilters);
          table.setPage(1);
        }}
      />

      <ResourceTable<AuditoriaRegistro>
        eyebrow="Registros del sistema"
        title="Historial de auditoría"
        description="Ordenado por fecha descendente para revisión administrativa prioritaria."
        searchValue={table.query}
        searchPlaceholder="Buscar por usuario, acción, entidad, descripción o IP"
        onSearchChange={table.updateQuery}
        onCreate={handleExport}
        createLabel="Exportar auditoría"
        loading={auditoriaQuery.isLoading || auditoriaQuery.isFetching}
        dataSource={auditoriaQuery.data?.items ?? []}
        columns={columns}
        rowKey="id"
        pagination={{
          current: auditoriaQuery.data?.meta.page,
          pageSize: auditoriaQuery.data?.meta.pageSize,
          total: auditoriaQuery.data?.meta.total,
          showSizeChanger: true,
          showTotal: (total) => `${total} registros`,
        }}
        onTableChange={table.handleTableChange}
      />
    </div>
  );
}
