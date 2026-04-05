'use client';

import { useState } from 'react';
import { Alert, Button, Card, Drawer, Form, Input, InputNumber, Popconfirm, Select, Space, Table, Tabs, Typography, notification } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/shared/page-header';
import { StatusTag } from '@/components/shared/status-tag';
import { useTableControls } from '@/hooks/use-table-controls';
import { useSeriesQuery, useSeriesMutations, useSubseriesQuery, useSubserieMutations } from '@/hooks/use-trd';
import type { Serie, SerieRequest, Subserie, SubserieRequest } from '@/types/trd';

const estadoOptions = [
  { label: 'Activa', value: 'Activa' },
  { label: 'Inactiva', value: 'Inactiva' },
];

const disposicionOptions = [
  { label: 'Eliminación', value: 'Eliminación' },
  { label: 'Conservación permanente', value: 'Conservación permanente' },
];

const subserieInitialValues: SubserieRequest = {
  serieId: '',
  codigo: '',
  nombre: '',
  tiempoRetencionGestion: 1,
  tiempoRetencionCentral: 1,
  disposicionFinal: 'Eliminación',
  estado: 'Activa',
};

export function TrdModule() {
  const serieTable = useTableControls<Serie>();
  const seriesQuery = useSeriesQuery({ q: serieTable.query, page: serieTable.page, pageSize: serieTable.pageSize });
  const { createMutation: createSerieMutation, updateMutation: updateSerieMutation, deleteMutation: deleteSerieMutation } = useSeriesMutations();

  const [selectedSerie, setSelectedSerie] = useState<Serie | null>(null);
  const subserieTable = useTableControls<Subserie>();
  const subseriesQuery = useSubseriesQuery(selectedSerie?.id ?? '', {
    q: subserieTable.query,
    page: subserieTable.page,
    pageSize: subserieTable.pageSize,
  });
  const { createMutation: createSubserieMutation, updateMutation: updateSubserieMutation, deleteMutation: deleteSubserieMutation } = useSubserieMutations(
    selectedSerie?.id ?? '',
  );

  const [serieForm] = Form.useForm<SerieRequest>();
  const [subserieForm] = Form.useForm<SubserieRequest>();

  const [serieDrawerOpen, setSerieDrawerOpen] = useState(false);
  const [editingSerie, setEditingSerie] = useState<Serie | null>(null);

  const [subserieDrawerOpen, setSubserieDrawerOpen] = useState(false);
  const [editingSubserie, setEditingSubserie] = useState<Subserie | null>(null);

  // ==================== SERIES HANDLERS ====================

  const openCreateSerieDrawer = () => {
    setEditingSerie(null);
    serieForm.resetFields();
    setSerieDrawerOpen(true);
  };

  const openEditSerieDrawer = (serie: Serie) => {
    setEditingSerie(serie);
    serieForm.setFieldsValue(serie);
    setSerieDrawerOpen(true);
  };

  const closeSerieDrawer = () => {
    setEditingSerie(null);
    setSerieDrawerOpen(false);
    serieForm.resetFields();
  };

  const handleCreateOrUpdateSerie = async (values: SerieRequest) => {
    try {
      if (editingSerie) {
        await updateSerieMutation.mutateAsync({ id: editingSerie.id, payload: values });
        notification.success({ message: 'Serie actualizada', description: 'Los cambios se guardaron correctamente.' });
      } else {
        await createSerieMutation.mutateAsync(values);
        notification.success({ message: 'Serie creada', description: 'La serie se agregó al TRD.' });
      }
      closeSerieDrawer();
    } catch (error) {
      notification.error({
        message: editingSerie ? 'Error al actualizar' : 'Error al crear',
        description: error instanceof Error ? error.message : 'No fue posible completar la operación.',
      });
    }
  };

  const handleDeleteSerie = async (serie: Serie) => {
    try {
      await deleteSerieMutation.mutateAsync(serie.id);
      notification.success({ message: 'Serie eliminada', description: 'El registro se retiró del TRD.' });
      if (selectedSerie?.id === serie.id) {
        setSelectedSerie(null);
      }
    } catch (error) {
      notification.error({
        message: 'Error al eliminar',
        description: error instanceof Error ? error.message : 'No fue posible eliminar la serie.',
      });
    }
  };

  // ==================== SUBSERIES HANDLERS ====================

  const openCreateSubserieDrawer = () => {
    if (!selectedSerie) {
      notification.warning({ message: 'Selecciona una serie', description: 'Debes seleccionar una serie primero.' });
      return;
    }
    setEditingSubserie(null);
    subserieForm.resetFields();
    subserieForm.setFieldsValue({ ...subserieInitialValues, serieId: selectedSerie.id });
    setSubserieDrawerOpen(true);
  };

  const openEditSubserieDrawer = (subserie: Subserie) => {
    setEditingSubserie(subserie);
    subserieForm.setFieldsValue(subserie);
    setSubserieDrawerOpen(true);
  };

  const closeSubserieDrawer = () => {
    setEditingSubserie(null);
    setSubserieDrawerOpen(false);
    subserieForm.resetFields();
  };

  const handleCreateOrUpdateSubserie = async (values: SubserieRequest) => {
    try {
      if (editingSubserie) {
        await updateSubserieMutation.mutateAsync({ id: editingSubserie.id, payload: values });
        notification.success({ message: 'Subserie actualizada', description: 'Los cambios se guardaron correctamente.' });
      } else {
        await createSubserieMutation.mutateAsync(values);
        notification.success({ message: 'Subserie creada', description: 'La subserie se agregó a la serie.' });
      }
      closeSubserieDrawer();
    } catch (error) {
      notification.error({
        message: editingSubserie ? 'Error al actualizar' : 'Error al crear',
        description: error instanceof Error ? error.message : 'No fue posible completar la operación.',
      });
    }
  };

  const handleDeleteSubserie = async (subserie: Subserie) => {
    try {
      await deleteSubserieMutation.mutateAsync(subserie.id);
      notification.success({ message: 'Subserie eliminada', description: 'El registro se retiró de la serie.' });
    } catch (error) {
      notification.error({
        message: 'Error al eliminar',
        description: error instanceof Error ? error.message : 'No fue posible eliminar la subserie.',
      });
    }
  };

  // ==================== SERIES TABLE ====================

  const seriesColumns: ColumnsType<Serie> = [
    { title: 'Código', dataIndex: 'codigo', width: 120, sorter: (a, b) => a.codigo.localeCompare(b.codigo) },
    { title: 'Nombre', dataIndex: 'nombre', width: 250 },
    { title: 'Descripción', dataIndex: 'descripcion', width: 300, ellipsis: true },
    {
      title: 'Estado',
      dataIndex: 'estado',
      width: 130,
      render: (value: string) => <StatusTag value={value === 'Activa' ? 'Activa' : 'Inactiva'} />,
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 160,
      render: (_value, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openEditSerieDrawer(record)}>
            Editar
          </Button>
          <Popconfirm
            title="Eliminar serie"
            description="Esta acción no se puede deshacer."
            okText="Eliminar"
            cancelText="Cancelar"
            onConfirm={() => handleDeleteSerie(record)}
          >
            <Button danger icon={<DeleteOutlined />} loading={deleteSerieMutation.isPending}>
              Eliminar
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // ==================== SUBSERIES TABLE ====================

  const subseriesColumns: ColumnsType<Subserie> = [
    { title: 'Código', dataIndex: 'codigo', width: 150 },
    { title: 'Nombre', dataIndex: 'nombre', width: 250 },
    { title: 'Retención (Gestión)', dataIndex: 'tiempoRetencionGestion', width: 140, render: (v: number) => `${v} años` },
    { title: 'Retención (Central)', dataIndex: 'tiempoRetencionCentral', width: 140, render: (v: number) => `${v} años` },
    {
      title: 'Disposición',
      dataIndex: 'disposicionFinal',
      width: 150,
      render: (value: string) => (
        <span style={{ padding: '4px 8px', borderRadius: '4px', background: value === 'Conservación permanente' ? '#e6f7ff' : '#fff2f0', fontSize: '12px' }}>
          {value}
        </span>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      width: 130,
      render: (value: string) => <StatusTag value={value === 'Activa' ? 'Activa' : 'Inactiva'} />,
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 160,
      render: (_value, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openEditSubserieDrawer(record)}>
            Editar
          </Button>
          <Popconfirm
            title="Eliminar subserie"
            description="Esta acción no se puede deshacer."
            okText="Eliminar"
            cancelText="Cancelar"
            onConfirm={() => handleDeleteSubserie(record)}
          >
            <Button danger icon={<DeleteOutlined />} loading={deleteSubserieMutation.isPending}>
              Eliminar
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="sgde-page-grid">
      <PageHeader
        eyebrow="Gestión documental"
        title="Tabla de Retención Documental (TRD)"
        description="Administración de series y subseries documentales, tiempos de retención y disposición final."
        actionLabel="Nueva serie"
        onAction={openCreateSerieDrawer}
      />

      {seriesQuery.isError ? (
        <Alert type="error" showIcon message="No fue posible cargar las series" description={(seriesQuery.error as Error).message} />
      ) : null}

      <Tabs
        items={[
          {
            key: 'series',
            label: 'Series',
            children: (
              <Card className="sgde-surface">
                <Space direction="vertical" style={{ width: '100%' }} size={16}>
                  <Input.Search
                    placeholder="Buscar por código, nombre o descripción"
                    value={serieTable.query}
                    onChange={(e) => serieTable.updateQuery(e.target.value)}
                    allowClear
                  />

                  <Table<Serie>
                    columns={seriesColumns}
                    dataSource={seriesQuery.data?.items ?? []}
                    rowKey="id"
                    loading={seriesQuery.isLoading || seriesQuery.isFetching}
                    pagination={{
                      current: seriesQuery.data?.meta.page,
                      pageSize: seriesQuery.data?.meta.pageSize,
                      total: seriesQuery.data?.meta.total,
                    }}
                    onChange={serieTable.handleTableChange}
                    onRow={(record) => ({
                      onClick: () => setSelectedSerie(record),
                      style: { cursor: 'pointer', background: selectedSerie?.id === record.id ? '#f0f5ff' : '' },
                    })}
                  />
                </Space>
              </Card>
            ),
          },
          {
            key: 'subseries',
            label: 'Subseries',
            disabled: !selectedSerie,
            children: selectedSerie ? (
              <Card className="sgde-surface">
                <Space direction="vertical" style={{ width: '100%' }} size={16}>
                  <div>
                    <Typography.Text strong>Serie seleccionada:</Typography.Text>
                    <span style={{ marginLeft: '8px' }}>{selectedSerie.codigo} - {selectedSerie.nombre}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Input.Search
                      placeholder="Buscar por código o nombre"
                      value={subserieTable.query}
                      onChange={(e) => subserieTable.updateQuery(e.target.value)}
                      allowClear
                      style={{ flex: 1 }}
                    />
                    <Button type="primary" icon={<PlusOutlined />} onClick={openCreateSubserieDrawer}>
                      Nueva subserie
                    </Button>
                  </div>

                  <Table<Subserie>
                    columns={subseriesColumns}
                    dataSource={subseriesQuery.data?.items ?? []}
                    rowKey="id"
                    loading={subseriesQuery.isLoading || subseriesQuery.isFetching}
                    pagination={{
                      current: subseriesQuery.data?.meta.page,
                      pageSize: subseriesQuery.data?.meta.pageSize,
                      total: subseriesQuery.data?.meta.total,
                    }}
                    onChange={subserieTable.handleTableChange}
                  />
                </Space>
              </Card>
            ) : (
              <Card className="sgde-surface">
                <Typography.Text type="secondary">Selecciona una serie para ver sus subseries.</Typography.Text>
              </Card>
            ),
          },
        ]}
      />

      {/* ==================== SERIE DRAWER ==================== */}

      <Drawer
        title={editingSerie ? 'Editar serie' : 'Nueva serie'}
        placement="right"
        onClose={closeSerieDrawer}
        open={serieDrawerOpen}
        width={450}
      >
        <Form<SerieRequest>
          form={serieForm}
          layout="vertical"
          onFinish={handleCreateOrUpdateSerie}
          autoComplete="off"
        >
          <Form.Item label="Código" name="codigo" rules={[{ required: true, message: 'El código es obligatorio' }]}>
            <Input placeholder="Ej: SG-01" />
          </Form.Item>

          <Form.Item label="Nombre" name="nombre" rules={[{ required: true, message: 'El nombre es obligatorio' }]}>
            <Input placeholder="Ej: Administración General" />
          </Form.Item>

          <Form.Item
            label="Descripción"
            name="descripcion"
            rules={[{ required: true, message: 'La descripción es obligatoria' }]}
          >
            <Input.TextArea rows={4} placeholder="Descripción de la serie" />
          </Form.Item>

          <Form.Item label="Estado" name="estado" rules={[{ required: true, message: 'El estado es obligatorio' }]}>
            <Select options={estadoOptions} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={createSerieMutation.isPending || updateSerieMutation.isPending}>
                {editingSerie ? 'Actualizar' : 'Crear'}
              </Button>
              <Button onClick={closeSerieDrawer}>Cancelar</Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>

      {/* ==================== SUBSERIE DRAWER ==================== */}

      <Drawer
        title={editingSubserie ? 'Editar subserie' : 'Nueva subserie'}
        placement="right"
        onClose={closeSubserieDrawer}
        open={subserieDrawerOpen}
        width={450}
      >
        <Form<SubserieRequest>
          form={subserieForm}
          layout="vertical"
          onFinish={handleCreateOrUpdateSubserie}
          autoComplete="off"
        >
          <Form.Item label="Código" name="codigo" rules={[{ required: true, message: 'El código es obligatorio' }]}>
            <Input placeholder="Ej: SG-01-01" />
          </Form.Item>

          <Form.Item label="Nombre" name="nombre" rules={[{ required: true, message: 'El nombre es obligatorio' }]}>
            <Input placeholder="Ej: Correspondencia Interna" />
          </Form.Item>

          <Form.Item
            label="Tiempo de Retención en Gestión (años)"
            name="tiempoRetencionGestion"
            rules={[{ required: true, message: 'El tiempo es obligatorio' }]}
          >
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item
            label="Tiempo de Retención en Central (años)"
            name="tiempoRetencionCentral"
            rules={[{ required: true, message: 'El tiempo es obligatorio' }]}
          >
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item
            label="Disposición Final"
            name="disposicionFinal"
            rules={[{ required: true, message: 'La disposición final es obligatoria' }]}
          >
            <Select options={disposicionOptions} />
          </Form.Item>

          <Form.Item label="Estado" name="estado" rules={[{ required: true, message: 'El estado es obligatorio' }]}>
            <Select options={estadoOptions} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={createSubserieMutation.isPending || updateSubserieMutation.isPending}>
                {editingSubserie ? 'Actualizar' : 'Crear'}
              </Button>
              <Button onClick={closeSubserieDrawer}>Cancelar</Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
