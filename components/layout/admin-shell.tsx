'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  AuditOutlined,
  BankOutlined,
  DashboardOutlined,
  FileProtectOutlined,
  FileTextOutlined,
  InboxOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ScheduleOutlined,
  SwapOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, Space, Spin, Tag, Tooltip, Typography, notification } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { logout } from '@/services/auth.service';
import { useAuthStore } from '@/hooks/use-auth-store';
import type { AuthUser } from '@/types/auth';
import { APP_ROUTES } from '@/utils/constants';

const { Header, Sider, Content } = Layout;

interface AdminShellProps {
  initialUser: AuthUser;
  children: React.ReactNode;
}

function getSelectedKey(pathname: string) {
  if (pathname.startsWith(APP_ROUTES.documentos)) return APP_ROUTES.documentos;
  if (pathname.startsWith(APP_ROUTES.radicados)) return APP_ROUTES.radicados;
  if (pathname.startsWith(APP_ROUTES.prestamos)) return APP_ROUTES.prestamos;
  if (pathname.startsWith(APP_ROUTES.transferencias)) return APP_ROUTES.transferencias;
  if (pathname.startsWith(APP_ROUTES.auditoria)) return APP_ROUTES.auditoria;
  if (pathname.startsWith(APP_ROUTES.trd)) return APP_ROUTES.trd;
  if (pathname.startsWith(APP_ROUTES.expedientes)) return APP_ROUTES.expedientes;
  if (pathname.startsWith(APP_ROUTES.dependencias)) return APP_ROUTES.dependencias;
  if (pathname.startsWith(APP_ROUTES.usuarios)) return APP_ROUTES.usuarios;
  return APP_ROUTES.dashboard;
}

const menuItems = [
  {
    key: APP_ROUTES.dashboard,
    icon: <DashboardOutlined />,
    label: <Link href={APP_ROUTES.dashboard}>Tablero</Link>,
  },
  {
    key: APP_ROUTES.documentos,
    icon: <FileTextOutlined />,
    label: <Link href={APP_ROUTES.documentos}>Documentos</Link>,
  },
  {
    key: APP_ROUTES.radicados,
    icon: <InboxOutlined />,
    label: <Link href={APP_ROUTES.radicados}>Radicados</Link>,
  },
  {
    key: APP_ROUTES.prestamos,
    icon: <ScheduleOutlined />,
    label: <Link href={APP_ROUTES.prestamos}>Préstamos</Link>,
  },
  {
    key: APP_ROUTES.transferencias,
    icon: <SwapOutlined />,
    label: <Link href={APP_ROUTES.transferencias}>Transferencias</Link>,
  },
  {
    key: APP_ROUTES.auditoria,
    icon: <AuditOutlined />,
    label: <Link href={APP_ROUTES.auditoria}>Auditoría</Link>,
  },
  {
    key: APP_ROUTES.trd,
    icon: <FileProtectOutlined />,
    label: <Link href={APP_ROUTES.trd}>TRD</Link>,
  },
  {
    key: APP_ROUTES.expedientes,
    icon: <FileProtectOutlined />,
    label: <Link href={APP_ROUTES.expedientes}>Expedientes</Link>,
  },
  {
    key: APP_ROUTES.dependencias,
    icon: <BankOutlined />,
    label: <Link href={APP_ROUTES.dependencias}>Dependencias</Link>,
  },
  {
    key: APP_ROUTES.usuarios,
    icon: <TeamOutlined />,
    label: <Link href={APP_ROUTES.usuarios}>Usuarios</Link>,
  },
];

export function AdminShell({ initialUser, children }: Readonly<AdminShellProps>) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const { user, setSession, clearSession } = useAuthStore();

  useEffect(() => {
    setSession(initialUser);
  }, [initialUser, setSession]);

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearSession();
      notification.success({ message: 'Sesión cerrada', description: 'La sesión se cerró correctamente.' });
      router.push(APP_ROUTES.login);
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'No fue posible cerrar la sesión.';
      notification.error({ message: 'Error al cerrar sesión', description: message });
    },
  });

  const selectedKey = getSelectedKey(pathname);

  return (
    <Layout className="sgde-app-shell" style={{ minHeight: '100vh', background: 'transparent' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth={76}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={276}
        style={{
          margin: 16,
          borderRadius: 24,
          overflow: 'hidden',
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(248, 251, 254, 0.9))',
          boxShadow: '0 28px 60px rgba(16, 32, 51, 0.12)',
          border: '1px solid rgba(16, 32, 51, 0.08)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div style={{ padding: 24, display: 'grid', gap: 10 }}>
          <Space align="center">
            <span
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #0f4c81 0%, #0a7f7c 100%)',
                color: '#fff',
                fontWeight: 700,
              }}
            >
              S
            </span>
            {collapsed ? null : (
              <div>
                <Typography.Text strong style={{ display: 'block' }}>
                  SGDE
                </Typography.Text>
                <Typography.Text type="secondary">Gestión documental</Typography.Text>
              </div>
            )}
          </Space>
          {collapsed ? null : <Tag color="blue">Demo administrativa</Tag>}
        </div>
        <Menu
          selectedKeys={[selectedKey]}
          items={menuItems}
          mode="inline"
          style={{ borderInlineEnd: 0, background: 'transparent', paddingInline: 10 }}
        />
      </Sider>

      <Layout style={{ background: 'transparent' }}>
        <Header
          style={{
            margin: '16px 16px 0 0',
            padding: '0 24px',
            height: 84,
            borderRadius: 24,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(248, 251, 254, 0.92))',
            boxShadow: '0 28px 60px rgba(16, 32, 51, 0.08)',
            border: '1px solid rgba(16, 32, 51, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            backdropFilter: 'blur(20px)',
          }}
        >
          <Space align="center">
            <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed((value) => !value)} />
            <div>
              <Typography.Text strong>SGDE</Typography.Text>
              <Typography.Text className="sgde-muted" style={{ display: 'block' }}>
                Sistema de Gestión Documental Electrónica
              </Typography.Text>
            </div>
          </Space>

          <Space align="center" size={12} wrap>
            <div style={{ textAlign: 'right' }}>
              <Typography.Text strong>{user?.nombre ?? initialUser.nombre}</Typography.Text>
              <Typography.Text className="sgde-muted" style={{ display: 'block' }}>
                {user?.dependencia ?? initialUser.dependencia}
              </Typography.Text>
            </div>
            <Tooltip title="Cerrar sesión" placement="bottom">
              <Button
                type="text"
                icon={logoutMutation.isPending ? <Spin size="small" /> : <LogoutOutlined />}
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                aria-label="Cerrar sesión"
                style={{ width: 40, height: 40, borderRadius: 12 }}
              />
            </Tooltip>
          </Space>
        </Header>

        <Content style={{ padding: 16, marginTop: 0 }}>
          <div style={{ padding: 24, minHeight: 'calc(100vh - 116px)', display: 'grid', gap: 24 }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}