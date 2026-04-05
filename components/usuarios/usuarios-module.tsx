'use client';

import { useEffect, useState } from 'react';
import { Alert, Button, Drawer, Form, Input, Popconfirm, Select, Space, Switch, notification } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/shared/page-header';
import { ResourceTable } from '@/components/shared/resource-table';
import { StatusTag } from '@/components/shared/status-tag';
import { useTableControls } from '@/hooks/use-table-controls';
import { useUsuarioMutations, useUsuariosQuery } from '@/hooks/use-usuarios';
import type { Usuario, UsuarioRequest } from '@/types/usuario';

const roles = [
  { label: 'Administrador', value: 'Administrador' },
  { label: 'Gestor documental', value: 'Gestor documental' },
  { label: 'Consulta', value: 'Consulta' },
];

const initialValues: UsuarioRequest = {
  nombre: '',
  email: '',
  rol: 'Consulta',
  dependencia: '',
  activo: true,
};

export function UsuariosModule() {
  const table = useTableControls<Usuario>();
  const usuariosQuery = useUsuariosQuery({ q: table.query, page: table.page, pageSize: table.pageSize });
  const { createMutation, updateMutation, deleteMutation } = useUsuarioMutations();
  const [form] = Form.useForm<UsuarioRequest>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Usuario | null>(null);

  useEffect(() => {
    if (drawerOpen) {
      form.setFieldsValue(editingItem ?? initialValues);
    }
  }, [drawerOpen, editingItem, form]);

  const openCreateDrawer = () => {
    setEditingItem(null);
    setDrawerOpen(true);
  };

  const openEditDrawer = (item: Usuario) => {
    setEditingItem(item);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setEditingItem(null);
    setDrawerOpen(false);
    form.resetFields();
  };

  const handleSubmit = async (values: UsuarioRequest) => {
    try {
      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem.id, payload: values });
        notification.success({ message: 'Usuario actualizado', description: 'La información quedó guardada correctamente.' });
      } else {
        await createMutation.mutateAsync(values);
        notification.success({ message: 'Usuario creado', description: 'El usuario quedó disponible en la plataforma.' });
      }

      closeDrawer();
    } catch (error) {
      notification.error({
        message: editingItem ? 'Error al actualizar' : 'Error al crear',
        description: error instanceof Error ? error.message : 'No fue posible completar la operación.',
      });
    }
  };

  const handleDelete = async (item: Usuario) => {
    try {
      await deleteMutation.mutateAsync(item.id);
      notification.success({ message: 'Usuario eliminado', description: 'El registro se retiró del listado.' });
    } catch (error) {
      notification.error({
        message: 'Error al eliminar',
        description: error instanceof Error ? error.message : 'No fue posible eliminar el usuario.',
      });
    }
  };

  const columns: ColumnsType<Usuario> = [
    { title: 'Nombre', dataIndex: 'nombre', width: 220 },
    { title: 'Correo', dataIndex: 'email', width: 240 },
    { title: 'Rol', dataIndex: 'rol', width: 180 },
    { title: 'Dependencia', dataIndex: 'dependencia', width: 200 },
    { title: 'Estado', dataIndex: 'activo', render: (value: boolean) => <StatusTag value={value ? 'Activo' : 'Inactivo'} />, width: 140 },
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
            title="Eliminar usuario"
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
        eyebrow="Administración de accesos"
        title="Usuarios"
        description="Control de perfiles, dependencia asociada y estado de habilitación en el sistema."
        actionLabel="Nuevo usuario"
        onAction={openCreateDrawer}
      />

      {usuariosQuery.isError ? (
        <Alert type="error" showIcon message="No fue posible cargar los usuarios" description={(usuariosQuery.error as Error).message} />
      ) : null}

      <ResourceTable<Usuario>
        eyebrow="Directorio operativo"
        title="Listado de usuarios"
        description="Administración de accesos con búsqueda y paginación."
        searchValue={table.query}
        searchPlaceholder="Buscar por nombre, correo, rol o dependencia"
        onSearchChange={table.updateQuery}
        onCreate={openCreateDrawer}
        createLabel="Nuevo usuario"
        loading={usuariosQuery.isLoading || usuariosQuery.isFetching}
        dataSource={usuariosQuery.data?.items ?? []}
        columns={columns}
        rowKey="id"
        pagination={{
          current: usuariosQuery.data?.meta.page,
          pageSize: usuariosQuery.data?.meta.pageSize,
          total: usuariosQuery.data?.meta.total,
          showSizeChanger: true,
          showTotal: (total) => `${total} usuarios`,
        }}
        onTableChange={table.handleTableChange}
      />

      <Drawer open={drawerOpen} onClose={closeDrawer} title={editingItem ? 'Editar usuario' : 'Nuevo usuario'} width={640} destroyOnClose>
        <Form<UsuarioRequest> form={form} layout="vertical" requiredMark={false} onFinish={handleSubmit} initialValues={initialValues}>
          <Form.Item label="Nombre completo" name="nombre" rules={[{ required: true, message: 'El nombre es obligatorio.' }]}>
            <Input placeholder="Nombre del usuario" />
          </Form.Item>
          <Form.Item label="Correo electrónico" name="email" rules={[{ required: true, message: 'El correo electrónico es obligatorio.' }, { type: 'email', message: 'Ingrese un correo electrónico válido.' }]}>
            <Input placeholder="usuario@sgde.gov.co" />
          </Form.Item>
          <Form.Item label="Rol" name="rol" rules={[{ required: true, message: 'El rol es obligatorio.' }]}>
            <Select options={roles} />
          </Form.Item>
          <Form.Item label="Dependencia" name="dependencia" rules={[{ required: true, message: 'La dependencia es obligatoria.' }]}>
            <Input placeholder="Dependencia asignada" />
          </Form.Item>
          <Form.Item label="Activo" name="activo" valuePropName="checked" rules={[{ required: true, message: 'El estado es obligatorio.' }]}>
            <Switch checkedChildren="Sí" unCheckedChildren="No" />
          </Form.Item>

          <Space>
            <Button onClick={closeDrawer}>Cancelar</Button>
            <Button type="primary" htmlType="submit" loading={createMutation.isPending || updateMutation.isPending}>
              {editingItem ? 'Guardar cambios' : 'Crear usuario'}
            </Button>
          </Space>
        </Form>
      </Drawer>
    </div>
  );
}