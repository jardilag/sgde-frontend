'use client';

import { useEffect, useState } from 'react';
import { Alert, Button, Drawer, Form, Input, Popconfirm, Select, Space, notification } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/shared/page-header';
import { ResourceTable } from '@/components/shared/resource-table';
import { StatusTag } from '@/components/shared/status-tag';
import { useTableControls } from '@/hooks/use-table-controls';
import { useRadicadoMutations, useRadicadosQuery } from '@/hooks/use-radicados';
import type { Radicado, RadicadoRequest } from '@/types/radicado';
import { formatDate } from '@/utils/formatters';

const radicadoEstados = [
  { label: 'Abierto', value: 'Abierto' },
  { label: 'Pendiente', value: 'Pendiente' },
  { label: 'Cerrado', value: 'Cerrado' },
];

const initialValues: RadicadoRequest = {
  numeroRadicado: '',
  asunto: '',
  remitente: '',
  dependenciaDestino: '',
  estado: 'Abierto',
  fechaRadicacion: '',
  canalIngreso: '',
};

export function RadicadosModule() {
  const table = useTableControls<Radicado>();
  const radicadosQuery = useRadicadosQuery({ q: table.query, page: table.page, pageSize: table.pageSize });
  const { createMutation, updateMutation, deleteMutation } = useRadicadoMutations();
  const [form] = Form.useForm<RadicadoRequest>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Radicado | null>(null);

  useEffect(() => {
    if (drawerOpen) {
      form.setFieldsValue(editingItem ?? initialValues);
    }
  }, [drawerOpen, editingItem, form]);

  const openCreateDrawer = () => {
    setEditingItem(null);
    setDrawerOpen(true);
  };

  const openEditDrawer = (item: Radicado) => {
    setEditingItem(item);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setEditingItem(null);
    setDrawerOpen(false);
    form.resetFields();
  };

  const handleSubmit = async (values: RadicadoRequest) => {
    try {
      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem.id, payload: values });
        notification.success({ message: 'Radicado actualizado', description: 'La información fue guardada correctamente.' });
      } else {
        await createMutation.mutateAsync(values);
        notification.success({ message: 'Radicado creado', description: 'El radicado quedó disponible en la bandeja.' });
      }

      closeDrawer();
    } catch (error) {
      notification.error({
        message: editingItem ? 'Error al actualizar' : 'Error al crear',
        description: error instanceof Error ? error.message : 'No fue posible completar la operación.',
      });
    }
  };

  const handleDelete = async (item: Radicado) => {
    try {
      await deleteMutation.mutateAsync(item.id);
      notification.success({ message: 'Radicado eliminado', description: 'El registro se retiró del listado.' });
    } catch (error) {
      notification.error({
        message: 'Error al eliminar',
        description: error instanceof Error ? error.message : 'No fue posible eliminar el radicado.',
      });
    }
  };

  const columns: ColumnsType<Radicado> = [
    { title: 'Número', dataIndex: 'numeroRadicado', width: 160 },
    { title: 'Asunto', dataIndex: 'asunto', width: 240 },
    { title: 'Remitente', dataIndex: 'remitente', width: 200 },
    { title: 'Dependencia destino', dataIndex: 'dependenciaDestino', width: 200 },
    { title: 'Estado', dataIndex: 'estado', render: (value: string) => <StatusTag value={value} />, width: 140 },
    { title: 'Canal', dataIndex: 'canalIngreso', width: 160 },
    { title: 'Fecha', dataIndex: 'fechaRadicacion', render: (value: string) => formatDate(value), width: 140 },
    {
      title: 'Acciones',
      key: 'actions',
      fixed: 'right',
      width: 160,
      render: (_value, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openEditDrawer(record)}>
            Editar
          </Button>
          <Popconfirm
            title="Eliminar radicado"
            description="Esta acción no se puede deshacer."
            okText="Eliminar"
            cancelText="Cancelar"
            onConfirm={() => handleDelete(record)}
          >
            <Button danger icon={<DeleteOutlined />} loading={deleteMutation.isPending}>
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
        eyebrow="Módulo de radicación"
        title="Radicados"
        description="Administración de comunicaciones oficiales con control de estados y trazabilidad de ingreso."
        actionLabel="Nuevo radicado"
        onAction={openCreateDrawer}
      />

      {radicadosQuery.isError ? (
        <Alert type="error" showIcon message="No fue posible cargar los radicados" description={(radicadosQuery.error as Error).message} />
      ) : null}

      <ResourceTable<Radicado>
        eyebrow="Bandeja de radicación"
        title="Listado de radicados"
        description="Registro administrativo con filtros, paginación y acciones visibles."
        searchValue={table.query}
        searchPlaceholder="Buscar por número, asunto, remitente o dependencia"
        onSearchChange={table.updateQuery}
        onCreate={openCreateDrawer}
        createLabel="Nuevo radicado"
        loading={radicadosQuery.isLoading || radicadosQuery.isFetching}
        dataSource={radicadosQuery.data?.items ?? []}
        columns={columns}
        rowKey="id"
        pagination={{
          current: radicadosQuery.data?.meta.page,
          pageSize: radicadosQuery.data?.meta.pageSize,
          total: radicadosQuery.data?.meta.total,
          showSizeChanger: true,
          showTotal: (total) => `${total} radicados`,
        }}
        onTableChange={table.handleTableChange}
      />

      <Drawer open={drawerOpen} onClose={closeDrawer} title={editingItem ? 'Editar radicado' : 'Nuevo radicado'} width={720} destroyOnClose>
        <Form<RadicadoRequest> form={form} layout="vertical" requiredMark={false} onFinish={handleSubmit} initialValues={initialValues}>
          <Form.Item label="Número de radicado" name="numeroRadicado" rules={[{ required: true, message: 'El número de radicado es obligatorio.' }]}>
            <Input placeholder="RAD-2026-0006" />
          </Form.Item>
          <Form.Item label="Asunto" name="asunto" rules={[{ required: true, message: 'El asunto es obligatorio.' }]}>
            <Input placeholder="Asunto del radicado" />
          </Form.Item>
          <Form.Item label="Remitente" name="remitente" rules={[{ required: true, message: 'El remitente es obligatorio.' }]}>
            <Input placeholder="Entidad o ciudadano remitente" />
          </Form.Item>
          <Form.Item label="Dependencia de destino" name="dependenciaDestino" rules={[{ required: true, message: 'La dependencia de destino es obligatoria.' }]}>
            <Input placeholder="Dependencia receptora" />
          </Form.Item>
          <Form.Item label="Estado" name="estado" rules={[{ required: true, message: 'El estado es obligatorio.' }]}>
            <Select options={radicadoEstados} />
          </Form.Item>
          <Form.Item label="Fecha de radicación" name="fechaRadicacion" rules={[{ required: true, message: 'La fecha es obligatoria.' }]}>
            <Input type="date" />
          </Form.Item>
          <Form.Item label="Canal de ingreso" name="canalIngreso" rules={[{ required: true, message: 'El canal de ingreso es obligatorio.' }]}>
            <Input placeholder="Ventanilla única, correo, portal web..." />
          </Form.Item>

          <Space>
            <Button onClick={closeDrawer}>Cancelar</Button>
            <Button type="primary" htmlType="submit" loading={createMutation.isPending || updateMutation.isPending}>
              {editingItem ? 'Guardar cambios' : 'Crear radicado'}
            </Button>
          </Space>
        </Form>
      </Drawer>
    </div>
  );
}