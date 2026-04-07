'use client';

import { useMemo, useState } from 'react';
import { App, Button, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CheckCircleOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/shared/page-header';
import { ResourceTable } from '@/components/shared/resource-table';
import { useTableControls } from '@/hooks/use-table-controls';
import { useDependenciasQuery } from '@/hooks/use-dependencias';
import { useExpedientesQuery } from '@/hooks/use-expediente';
import { usePrestamoMutations, usePrestamosQuery } from '@/hooks/use-prestamos';
import type { Prestamo, PrestamoFilters, PrestamoRequest } from '@/types/prestamo';
import { formatDate } from '@/utils/formatters';
import { PrestamoEstadoTag } from '@/components/prestamos/prestamo-estado-tag';
import { PrestamoForm } from '@/components/prestamos/prestamo-form';
import { PrestamosFilters } from '@/components/prestamos/prestamos-filters';

type PrestamoAdvancedFilters = Omit<PrestamoFilters, 'q' | 'page' | 'pageSize'>;

const initialAdvancedFilters: PrestamoAdvancedFilters = {};

function buildFilters(
  table: ReturnType<typeof useTableControls<Prestamo>>,
  advancedFilters: PrestamoAdvancedFilters,
): PrestamoFilters {
  return {
    q: table.query,
    page: table.page,
    pageSize: table.pageSize,
    ...advancedFilters,
  };
}

export function PrestamosModule() {
  const { notification } = App.useApp();
  const table = useTableControls<Prestamo>();
  const [formOpen, setFormOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<PrestamoAdvancedFilters>(initialAdvancedFilters);

  const prestamosQuery = usePrestamosQuery(buildFilters(table, advancedFilters));
  const dependenciasQuery = useDependenciasQuery({ q: '', page: 1, pageSize: 100 });
  const expedientesQuery = useExpedientesQuery();
  const { createMutation, devolverMutation } = usePrestamoMutations();

  const dependenciasOptions = useMemo(
    () => dependenciasQuery.data?.items.map((item) => ({ label: `${item.nombre} (${item.codigo})`, value: item.id })) ?? [],
    [dependenciasQuery.data?.items],
  );

  const expedientesOptions = useMemo(
    () =>
      expedientesQuery.data?.items.map((item) => ({ label: `${item.codigoExpediente} - ${item.nombre}`, value: item.id })) ?? [],
    [expedientesQuery.data?.items],
  );

  const handleCreatePrestamo = async (payload: PrestamoRequest) => {
    try {
      await createMutation.mutateAsync(payload);
      notification.success({
        title: 'Préstamo registrado',
        description: 'El préstamo quedó en seguimiento con estado actualizado.',
      });
    } catch (error) {
      notification.error({
        title: 'Error al registrar préstamo',
        description: error instanceof Error ? error.message : 'No fue posible registrar el préstamo.',
      });
      throw error;
    }
  };

  const handleRegistrarDevolucion = async (prestamo: Prestamo) => {
    try {
      const fechaDevolucionReal = new Date().toISOString().slice(0, 10);
      await devolverMutation.mutateAsync({
        id: prestamo.id,
        payload: {
          fechaDevolucionReal,
          observacion: prestamo.observacion,
        },
      });

      notification.success({
        title: 'Devolución registrada',
        description: `El expediente ${prestamo.expedienteCodigo ?? ''} se marcó como devuelto.`,
      });
    } catch (error) {
      notification.error({
        title: 'Error al registrar devolución',
        description: error instanceof Error ? error.message : 'No fue posible registrar la devolución.',
      });
    }
  };

  const columns: ColumnsType<Prestamo> = [
    { title: 'Expediente', dataIndex: 'expedienteCodigo', width: 180, render: (_value, record) => record.expedienteCodigo ?? record.expedienteId },
    { title: 'Nombre expediente', dataIndex: 'expedienteNombre', width: 240 },
    {
      title: 'Dependencia solicitante',
      dataIndex: 'dependenciaSolicitanteNombre',
      width: 210,
      render: (_value, record) => record.dependenciaSolicitanteNombre ?? record.dependenciaSolicitanteId,
    },
    { title: 'Fecha préstamo', dataIndex: 'fechaPrestamo', width: 140, render: (value: string) => formatDate(value) },
    {
      title: 'Devolución esperada',
      dataIndex: 'fechaDevolucionEsperada',
      width: 170,
      render: (value: string) => formatDate(value),
    },
    {
      title: 'Devolución real',
      dataIndex: 'fechaDevolucionReal',
      width: 160,
      render: (value?: string) => (value ? formatDate(value) : 'Pendiente'),
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      width: 120,
      render: (value: Prestamo['estado']) => <PrestamoEstadoTag estado={value} />,
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_value, record) =>
        record.estado === 'Devuelto' ? (
          'Sin acciones'
        ) : (
          <Popconfirm
            title="Confirmar devolución"
            description="Esta acción marcará el expediente como devuelto en la fecha actual."
            okText="Confirmar"
            cancelText="Cancelar"
            onConfirm={() => handleRegistrarDevolucion(record)}
          >
            <Button icon={<CheckCircleOutlined />} loading={devolverMutation.isPending}>
              Registrar devolución
            </Button>
          </Popconfirm>
        ),
    },
  ];

  return (
    <div className="sgde-page-grid">
      <PageHeader
        eyebrow="Módulo de préstamos documentales"
        title="Préstamos de Expedientes"
        description="Registra préstamos, controla devoluciones y visualiza vencimientos de expedientes con trazabilidad operativa."
        actionLabel="Registrar préstamo"
        onAction={() => setFormOpen(true)}
      />

      <PrestamosFilters
        dependencias={dependenciasOptions}
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

      <ResourceTable<Prestamo>
        eyebrow="Control de préstamos"
        title="Listado de préstamos"
        description="Consulta expedientes prestados, vigencias y devoluciones con estados visibles."
        searchValue={table.query}
        searchPlaceholder="Buscar por expediente, dependencia o estado"
        onSearchChange={table.updateQuery}
        onCreate={() => setFormOpen(true)}
        createLabel="Registrar préstamo"
        loading={prestamosQuery.isLoading || prestamosQuery.isFetching}
        dataSource={prestamosQuery.data?.items ?? []}
        columns={columns}
        rowKey="id"
        rowClassName={(record) => (record.estado === 'Vencido' ? 'sgde-row-vencido' : '')}
        pagination={{
          current: prestamosQuery.data?.meta.page,
          pageSize: prestamosQuery.data?.meta.pageSize,
          total: prestamosQuery.data?.meta.total,
          showSizeChanger: true,
          showTotal: (total) => `${total} préstamos`,
        }}
        onTableChange={table.handleTableChange}
      />

      <PrestamoForm
        open={formOpen}
        loading={createMutation.isPending}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreatePrestamo}
        expedientes={expedientesOptions}
        dependencias={dependenciasOptions}
      />
    </div>
  );
}
