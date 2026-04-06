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
    <div className="login-container" style={{ minHeight: '100vh', overflow: 'hidden' }}>
      <Row gutter={[24, 24]} align="middle" justify="center" style={{ minHeight: '100vh', padding: 24 }}>
        <Col xs={24} lg={10} xxl={9}>
          <div className="login-hero">
            <div style={{ marginBottom: 28 }}>
              <div className="status-badge">
                <span className="status-dot"></span>
                <span>Sistema Operativo v2.0</span>
              </div>
            </div>

            <Typography.Title
              level={1}
              className="hero-title"
              style={{
                marginBottom: 12,
                maxWidth: 620,
                fontSize: 44,
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
              }}
            >
              Gestión documental con trazabilidad completa
            </Typography.Title>

            <Typography.Paragraph
              className="hero-subtitle"
              style={{
                fontSize: 16,
                maxWidth: 620,
                lineHeight: 1.6,
                marginBottom: 32,
              }}
            >
              Plataforma integral para la administración pública con control de acceso, reportería avanzada y auditoría completa de operaciones.
            </Typography.Paragraph>

            <Row gutter={[16, 16]}>
              {[
                {
                  icon: <BookOutlined />,
                  title: 'Documentos',
                  text: 'Registro, búsqueda y clasificación automática de documentos institucionales.',
                },
                {
                  icon: <FileProtectOutlined />,
                  title: 'Radicados',
                  text: 'Control centralizado y monitoreo en tiempo real de comunicaciones oficiales.',
                },
                {
                  icon: <CheckCircleOutlined />,
                  title: 'Usuarios',
                  text: 'Gestión flexible de accesos, roles, permisos y auditoría completa.',
                },
              ].map((item, idx) => (
                <Col key={item.title} xs={24} md={8} style={{ animation: `slideInUp 0.6s ease-out ${0.1 + idx * 0.1}s both` }}>
                  <Card
                    className="feature-card"
                    style={{
                      border: '1px solid rgba(15, 76, 129, 0.1)',
                      borderRadius: 14,
                      background: 'rgba(255, 255, 255, 0.5)',
                      backdropFilter: 'blur(16px)',
                      boxShadow: '0 8px 24px rgba(15, 76, 129, 0.08)',
                    }}
                    styles={{ body: { display: 'grid', gap: 12, padding: 20 } }}
                  >
                    <div
                      className="feature-icon"
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, rgba(15, 76, 129, 0.12), rgba(10, 127, 124, 0.08))',
                        color: 'var(--sgde-primary)',
                        fontSize: 24,
                      }}
                    >
                      {item.icon}
                    </div>
                    <Typography.Text strong style={{ fontSize: 13, display: 'block' }}>
                      {item.title}
                    </Typography.Text>
                    <Typography.Text className="sgde-muted" style={{ fontSize: 12, lineHeight: 1.5 }}>
                      {item.text}
                    </Typography.Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </Col>

        <Col xs={24} sm={20} md={16} lg={8} xxl={6}>
          <div className="login-form-wrapper" style={{ animation: 'slideInRight 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
            <Card
              className="login-card"
              style={{
                border: '1px solid rgba(15, 76, 129, 0.12)',
                borderRadius: 18,
                background: 'rgba(255, 255, 255, 0.95)',
                boxShadow: '0 32px 80px rgba(15, 76, 129, 0.15)',
                backdropFilter: 'blur(20px)',
              }}
              styles={{
                body: {
                  padding: 32,
                  display: 'grid',
                  gap: 20,
                },
              }}
            >
              <div>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: 'linear-gradient(135deg, rgba(15, 76, 129, 0.15), rgba(10, 127, 124, 0.1))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                    border: '1px solid rgba(15, 76, 129, 0.15)',
                  }}
                >
                  <LockOutlined style={{ fontSize: 28, color: 'var(--sgde-primary)' }} />
                </div>
                <Typography.Title
                  level={3}
                  className="login-title"
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    marginBottom: 6,
                  }}
                >
                  Ingreso al sistema
                </Typography.Title>
                <Typography.Text className="sgde-muted" style={{ fontSize: 12 }}>
                  Use las credenciales demo prellenadas
                </Typography.Text>
              </div>

              <Alert
                type="success"
                showIcon
                className="alert-credentials"
                message={
                  <Typography.Text strong style={{ fontSize: 11, color: 'var(--sgde-accent)' }}>
                    Credenciales de Demostración
                  </Typography.Text>
                }
                description={
                  <div style={{ fontSize: 10, marginTop: 6, display: 'grid', gap: 3 }}>
                    <div>
                      <Typography.Text code style={{ fontSize: 10 }}>
                        {AUTH_DEMO_CREDENTIALS.email}
                      </Typography.Text>
                    </div>
                    <div>
                      <Typography.Text code style={{ fontSize: 10 }}>
                        {AUTH_DEMO_CREDENTIALS.password}
                      </Typography.Text>
                    </div>
                  </div>
                }
              />

              <Form form={form} layout="vertical" requiredMark={false} onFinish={onFinish}>
                <Form.Item
                  label={<Typography.Text strong style={{ fontSize: 12 }}>Correo electrónico</Typography.Text>}
                  name="correo"
                  rules={[
                    { required: true, message: 'El correo es obligatorio.' },
                    { type: 'email', message: 'Correo no válido.' },
                  ]}
                  style={{ marginBottom: 16 }}
                >
                  <Input
                    className="form-input"
                    prefix={<UserOutlined style={{ color: 'var(--sgde-muted)' }} />}
                    placeholder="admin@sgde.gov.co"
                    autoComplete="username"
                    style={{ height: 40 }}
                  />
                </Form.Item>

                <Form.Item
                  label={<Typography.Text strong style={{ fontSize: 12 }}>Contraseña</Typography.Text>}
                  name="contrasena"
                  rules={[{ required: true, message: 'La contraseña es obligatoria.' }]}
                  style={{ marginBottom: 24 }}
                >
                  <Input.Password
                    className="form-input"
                    prefix={<LockOutlined style={{ color: 'var(--sgde-muted)' }} />}
                    placeholder="••••••••••"
                    autoComplete="current-password"
                    style={{ height: 40 }}
                  />
                </Form.Item>

                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loginMutation.isPending}
                  className="login-button"
                  style={{ height: 44 }}
                >
                  {loginMutation.isPending ? 'Autenticando...' : 'Ingresar'}
                </Button>
              </Form>

              <div style={{ paddingTop: 16, borderTop: '1px solid rgba(15, 76, 129, 0.08)', textAlign: 'center' }}>
                <Typography.Text className="sgde-muted" style={{ fontSize: 10, letterSpacing: '0.02em' }}>
                  SGDE v2.0 · Demostración · 2026
                </Typography.Text>
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}