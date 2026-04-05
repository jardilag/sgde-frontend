'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BookOutlined, CheckCircleOutlined, FileProtectOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Col, Form, Input, Row, Space, Typography, notification } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { login } from '@/services/auth.service';
import { useAuthStore } from '@/hooks/use-auth-store';
import { APP_ROUTES, AUTH_DEMO_CREDENTIALS } from '@/utils/constants';
import type { LoginRequest } from '@/types/auth';

export function LoginModule() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((state) => state.setSession);
  const [form] = Form.useForm<LoginRequest>();

  const targetRoute = searchParams.get('from') ?? APP_ROUTES.dashboard;

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setSession(data.usuario);
      notification.success({
        message: 'Inicio de sesión exitoso',
        description: 'Se habilitó el acceso a la consola administrativa.',
      });
      router.push(targetRoute);
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'No se pudo iniciar sesión.';
      notification.error({ message: 'Error de autenticación', description: message });
    },
  });

  useEffect(() => {
    form.setFieldsValue({
      correo: AUTH_DEMO_CREDENTIALS.email,
      contrasena: AUTH_DEMO_CREDENTIALS.password,
    });
  }, [form]);

  const onFinish = (values: LoginRequest) => {
    loginMutation.mutate(values);
  };

  return (
    <Row gutter={[24, 24]} align="middle" justify="center" style={{ minHeight: '100vh', padding: 24 }}>
      <Col xs={24} lg={10} xxl={9}>
        <div className="sgde-page-grid">
          <div className="sgde-page-hero">
            <span className="sgde-chip">SGDE para entidades públicas colombianas</span>
            <Typography.Title level={1} style={{ marginBottom: 0, maxWidth: 620 }}>
              Gestión documental con trazabilidad, control y una interfaz administrativa seria.
            </Typography.Title>
            <Typography.Paragraph className="sgde-muted" style={{ fontSize: 16, maxWidth: 620 }}>
              Accede a la demo funcional del sistema, administra documentos, radicados y usuarios, y valida el flujo completo con datos simulados preparados para conectarse con Spring Boot.
            </Typography.Paragraph>
          </div>

          <Row gutter={[16, 16]}>
            {[
              {
                icon: <BookOutlined />,
                title: 'Documentos',
                text: 'Registro, búsqueda y acciones sobre documentos institucionales.',
              },
              {
                icon: <FileProtectOutlined />,
                title: 'Radicados',
                text: 'Control de comunicaciones oficiales y seguimiento por estado.',
              },
              {
                icon: <CheckCircleOutlined />,
                title: 'Usuarios',
                text: 'Gestión de accesos y permisos para la operación interna.',
              },
            ].map((item) => (
              <Col key={item.title} xs={24} md={8}>
                <Card className="sgde-surface" styles={{ body: { display: 'grid', gap: 8 } }}>
                  <Space align="center">
                    <span
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 12,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(15, 76, 129, 0.1)',
                        color: 'var(--sgde-primary)',
                      }}
                    >
                      {item.icon}
                    </span>
                    <Typography.Text strong>{item.title}</Typography.Text>
                  </Space>
                  <Typography.Text className="sgde-muted">{item.text}</Typography.Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Col>

      <Col xs={24} sm={20} md={16} lg={8} xxl={6}>
        <Card className="sgde-surface" styles={{ body: { display: 'grid', gap: 20 } }}>
          <div>
            <Typography.Title level={3} style={{ marginBottom: 8 }}>
              Ingreso al sistema
            </Typography.Title>
            <Typography.Text className="sgde-muted">
              Use las credenciales demo prellenadas para acceder.
            </Typography.Text>
          </div>

          <Alert
            type="info"
            showIcon
            message="Credenciales demo"
            description={`Correo: ${AUTH_DEMO_CREDENTIALS.email} · Contraseña: ${AUTH_DEMO_CREDENTIALS.password}`}
          />

          <Form form={form} layout="vertical" requiredMark={false} onFinish={onFinish}>
            <Form.Item
              label="Correo electrónico"
              name="correo"
              rules={[
                { required: true, message: 'El correo electrónico es obligatorio.' },
                { type: 'email', message: 'Ingrese un correo electrónico válido.' },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="admin@sgde.gov.co" autoComplete="username" />
            </Form.Item>

            <Form.Item
              label="Contraseña"
              name="contrasena"
              rules={[{ required: true, message: 'La contraseña es obligatoria.' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="SGDE2026!" autoComplete="current-password" />
            </Form.Item>

            <Button type="primary" htmlType="submit" block loading={loginMutation.isPending} size="large">
              Ingresar
            </Button>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}