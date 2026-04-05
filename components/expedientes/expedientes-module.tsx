/**
 * Módulo principal de Expedientes
 */

'use client';

import { useState, useMemo } from 'react';
import {
  Table,
  Button,
  Space,
  Popconfirm,
  TableColumnsType,
  Empty,
  Spin,
  FloatButton,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

import { PageHeader } from '@/components/shared/page-header';
import { EstadoBadge } from './estado-badge';
import { FiltrosAvanzados } from './filtros-avanzados';
import { ExpedienteForm } from './expediente-form';
import { ExpedienteDetail } from './expediente-detail';

import { useExpedientesQuery, useExpedienteMutations } from '@/hooks/use-expediente';
import { Expediente, ExpedienteRequest, ExpedienteFilters, ExpedienteExtended } from '@/types/expediente';

export function ExpedientesModule() {
  const [filters, setFilters] = useState<ExpedienteFilters>({});
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedExpediente, setSelectedExpediente] = useState<Expediente | null>(null);
  const [detailExpediente, setDetailExpediente] = useState<ExpedienteExtended | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  // Queries y mutations
  const { data, isLoading, isFetching } = useExpedientesQuery(filters);
  const {
    createMutation,
    updateMutation,
    deleteMutation,
    cerrarMutation,
    reabrirMutation,
  } = useExpedienteMutations();

  const expedientes = useMemo(() => data?.items || [], [data]);

  // Handlers
  const handleOpenCreateForm = () => {
    setFormMode('create');
    setSelectedExpediente(null);
    setShowForm(true);
  };

  const handleOpenEditForm = (expediente: Expediente) => {
    setFormMode('edit');
    setSelectedExpediente(expediente);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedExpediente(null);
  };

  const handleSubmitForm = async (payload: ExpedienteRequest) => {
    try {
      if (formMode === 'create') {
        await createMutation.mutateAsync(payload);
      } else if (selectedExpediente) {
        await updateMutation.mutateAsync({
          id: selectedExpediente.id,
          payload,
        });
      }
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteExpediente = (expediente: Expediente) => {
    deleteMutation.mutate(expediente.id);
  };

  const handleOpenDetail = (expediente: Expediente) => {
    // Aquí enriquecemos el expediente con datos relacionados (mock)
    const extended: ExpedienteExtended = {
      ...expediente,
      documentosCount: 0,
      historialCount: 1,
    };
    setDetailExpediente(extended);
    setShowDetail(true);
  };

  const handleCerrarExpediente = async (fechaCierre: string) => {
    if (!detailExpediente) return;
    try {
      await cerrarMutation.mutateAsync({
        id: detailExpediente.id,
        fechaCierre,
      });
      setDetailExpediente(null);
    } catch (error) {
      throw error;
    }
  };

  const handleReabrirExpediente = async () => {
    if (!detailExpediente) return;
    try {
      await reabrirMutation.mutateAsync(detailExpediente.id);
      setDetailExpediente(null);
    } catch (error) {
      throw error;
    }
  };

  // Tabla
  const columns: TableColumnsType<Expediente> = [
    {
      title: 'Código',
      dataIndex: 'codigoExpediente',
      key: 'codigoExpediente',
      width: 140,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
      width: 250,
    },
    {
      title: 'Estado',
      dataIndex: 'estadoActual',
      key: 'estadoActual',
      width: 120,
      render: (estado) => <EstadoBadge estado={estado} size="small" />,
    },
    {
      title: 'Fecha apertura',
      dataIndex: 'fechaApertura',
      key: 'fechaApertura',
      width: 130,
      render: (date) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleOpenDetail(record)}
            title="Ver detalle"
          />
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleOpenEditForm(record)}
            title="Editar"
          />
          <Popconfirm
            title="Eliminar expediente"
            description="¿Deseas eliminar este expediente permanentemente?"
            onConfirm={() => handleDeleteExpediente(record)}
            okText="Eliminar"
            cancelText="Cancelar"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              danger
              title="Eliminar"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <PageHeader
        title="Expedientes Archivísticos"
        description="Gestión integral de expedientes documentales del sistema"
      />

      <div style={{ marginBottom: 24 }}>
        <FiltrosAvanzados
          onFilter={setFilters}
          loading={isLoading}
          dependencias={[
            { id: '1', nombre: 'Secretaría General' },
            { id: '2', nombre: 'Archivo Central' },
            { id: '3', nombre: 'Jurídica' },
            { id: '4', nombre: 'Planeación' },
            { id: '5', nombre: 'Talento Humano' },
          ]}
          subseries={[
            { id: '1', codigo: 'SG-01-01', nombre: 'Correspondencia Interna' },
            { id: '2', codigo: 'AC-01-01', nombre: 'Resoluciones' },
            { id: '3', codigo: 'JUR-01-01', nombre: 'Contratos' },
          ]}
        />
      </div>

      <Spin spinning={isLoading} tip="Cargando expedientes...">
        {expedientes.length > 0 ? (
          <Table
            columns={columns}
            dataSource={expedientes}
            rowKey="id"
            pagination={{
              current: pagination.page,
              pageSize: pagination.pageSize,
              total: data?.meta.total,
              onChange: (page, pageSize) => setPagination({ page, pageSize }),
            }}
            loading={isFetching}
            style={{ marginBottom: 24 }}
          />
        ) : (
          <Empty
            description="No hay expedientes registrados"
            style={{ marginTop: 50, marginBottom: 50 }}
          />
        )}
      </Spin>

      <FloatButton
        icon={<PlusOutlined />}
        type="primary"
        style={{ right: 24, bottom: 24 }}
        onClick={handleOpenCreateForm}
        description="Nuevo expediente"
      />

      {/* Formulario de crear/editar */}
      <ExpedienteForm
        open={showForm}
        mode={formMode}
        expediente={selectedExpediente}
        dependencias={[
          { id: '1', nombre: 'Secretaría General' },
          { id: '2', nombre: 'Archivo Central' },
          { id: '3', nombre: 'Jurídica' },
          { id: '4', nombre: 'Planeación' },
          { id: '5', nombre: 'Talento Humano' },
        ]}
        subseries={[
          { id: '1', codigo: 'SG-01-01', nombre: 'Correspondencia Interna' },
          { id: '2', codigo: 'AC-01-01', nombre: 'Resoluciones' },
          { id: '3', codigo: 'JUR-01-01', nombre: 'Contratos' },
        ]}
        onSubmit={handleSubmitForm}
        onClose={handleCloseForm}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Drawer de detalle */}
      <ExpedienteDetail
        open={showDetail}
        onClose={() => setShowDetail(false)}
        expediente={detailExpediente}
        onCerrar={handleCerrarExpediente}
        onReabrir={handleReabrirExpediente}
        loading={cerrarMutation.isPending || reabrirMutation.isPending}
      />
    </div>
  );
}
