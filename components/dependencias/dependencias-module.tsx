'use client';

import { useEffect, useState } from 'react';
import { Alert, Button, Drawer, Form, Input, Popconfirm, Select, Space, notification } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/shared/page-header';
import { ResourceTable } from '@/components/shared/resource-table';
import { StatusTag } from '@/components/shared/status-tag';
import { useTableControls } from '@/hooks/use-table-controls';
import { useDependenciaMutations, useDependenciasQuery } from '@/hooks/use-dependencias';
import type { Dependencia, DependenciaRequest } from '@/types/dependencia';

const estadoOptions = [
  { label: 'Activa', value: 'Activa' },
  { label: 'Inactiva', value: 'Inactiva' },
];

const initialValues: DependenciaRequest = {
  nombre: '',
  codigo: '',
  descripcion: '',
  estado: 'Activa',
};

export function DependenciasModule() {
  const table = useTableControls<Dependencia>();
  const dependenciasQuery = useDependenciasQuery({ q: table.query, page: table.page, pageSize: table.pageSize });
  const { createMutation, updateMutation, deleteMutation } = useDependenciaMutations();
  const [form] = Form.useForm<DependenciaRequest>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Dependencia | null>(null);

  useEffect(() => {
    if (drawerOpen) {
      form.setFieldsValue(editingItem ?? initialValues);
    }
  }, [drawerOpen, editingItem, form]);

  const openCreateDrawer = () => {
    setEditingItem(null);
    setDrawerOpen(true);
  };

  const openEditDrawer = (item: Dependencia) => {
    setEditingItem(item);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setEditingItem(null);
    setDrawerOpen(false);
    form.resetFields();
  };

  const handleSubmit = async (values: DependenciaRequest) => {
    try {
      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem.id, payload: values });
        notification.success({
          message: 'Dependencia actualizada',
          description: 'La información quedó guardada correctamente.',
        });
      } else {
        await createMutation.mutateAsync(values);
        notification.success({
          message: 'Dependencia creada',
          description: 'La dependencia quedó disponible en el sistema.',
        });
      }

      closeDrawer();
    } catch (error) {
      notification.error({
        message: editingItem ? 'Error al actualizar' : 'Error al crear',
        description: error instanceof Error ? error.message : 'No fue posible completar la operación.',
      });
    }
  };

  const handleDelete = async (item: Dependencia) => {
    try {
      await deleteMutation.mutateAsync(item.id);
      notification.success({
        message: 'Dependencia eliminada',
        description: 'El registro se retiró del listado.',
      });
    } catch (error) {
      notification.error({
        message: 'Error al eliminar',
        description: error instanceof Error ? error.message : 'No fue posible eliminar la dependencia.',
      });
    }
  };

  const columns: ColumnsType<Dependencia> = [
    { title: 'Nombre', dataIndex: 'nombre', width: 220 },
    { title: 'Código', dataIndex: 'codigo', width: 150 },
    { title: 'Descripción', dataIndex: 'descripcion', width: 300, ellipsis: true },
    {
      title: 'Estado',
      dataIndex: 'estado',
      render: (value: string) => (
        <StatusTag value={value === 'Activa' ? 'Activa' : 'Inactiva'} />
      ),
      width: 140,
    },
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
            title="Eliminar dependencia"
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
        eyebrow="Estructura organizacional"
        title="Dependencias"
        description="Administración de dependencias institucionales, códigos y estado operativo."
        actionLabel="Nueva dependencia"
        onAction={openCreateDrawer}
      />

      {dependenciasQuery.isError ? (
        <Alert
          type="error"
          showIcon
          message="No fue posible cargar las dependencias"
          description={(dependenciasQuery.error as Error).message}
        />
      ) : null}

      <ResourceTable<Dependencia>
        eyebrow="Registro operativo"
        title="Listado de dependencias"
        description="Administración con búsqueda, paginación y acciones por registro."
        searchValue={table.query}
        searchPlaceholder="Buscar por nombre, código o descripción"
        onSearchChange={table.updateQuery}
        onCreate={openCreateDrawer}
        createLabel="Nueva dependencia"
        loading={dependenciasQuery.isLoading || dependenciasQuery.isFetching}
        dataSource={dependenciasQuery.data?.items ?? []}
        columns={columns}
        rowKey="id"
        pagination={{
          current: dependenciasQuery.data?.meta.page,
          pageSize: dependenciasQuery.data?.meta.pageSize,
          total: dependenciasQuery.data?.meta.total,
        }}
        onTableChange={table.handleTableChange}
      />

      <Drawer
        title={editingItem ? 'Editar dependencia' : 'New Dependencia'}
        placement="right"
        onClose={closeDrawer}
        open={drawerOpen}
        width={450}
      >
        <Form<DependenciaRequest>
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Nombre"
            name="nombre"
            rules={[{ required: true, message: 'El nombre es obligatorio' }]}
          >
            <Input placeholder="Ej: Dirección de Gobernanza" />
          </Form.Item>

          <Form.Item
            label="Código"
            name="codigo"
            rules={[{ required: true, message: 'El código es obligatorio' }]}
          >
            <Input placeholder="Ej: DIR-GOB-001" />
          </Form.Item>

          <Form.Item
            label="Descripción"
            name="descripcion"
            rules={[{ required: true, message: 'La descripción es obligatoria' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Descripción de funciones y responsabilidades"
            />
          </Form.Item>

          <Form.Item
            label="Estado"
            name="estado"
            rules={[{ required: true, message: 'El estado es obligatorio' }]}
          >
            <Select options={estadoOptions} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={createMutation.isPending || updateMutation.isPending}>
                {editingItem ? 'Actualizar' : 'Crear'}
              </Button>
              <Button onClick={closeDrawer}>Cancelar</Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
