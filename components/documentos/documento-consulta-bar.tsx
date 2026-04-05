'use client';

import { Button, Card, Input, Space, Typography } from 'antd';

interface DocumentoConsultaBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  loading: boolean;
}

export function DocumentoConsultaBar({ value, onChange, onSearch, loading }: DocumentoConsultaBarProps) {
  return (
    <Card className="sgde-surface" styles={{ body: { display: 'grid', gap: 12 } }}>
      <Space orientation="vertical" size={8} style={{ width: '100%' }}>
        <span className="sgde-chip">Consulta puntual</span>
        <div>
          <Typography.Title level={4} style={{ marginBottom: 4 }}>
            Consultar por número de radicado
          </Typography.Title>
          <Typography.Text className="sgde-muted">
            Busca un documento específico por su número generado desde backend.
          </Typography.Text>
        </div>
      </Space>

      <Space.Compact style={{ width: '100%' }}>
        <Input
          allowClear
          placeholder="Ej. SGDE-2026-0001"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onPressEnter={onSearch}
        />
        <Button type="primary" loading={loading} onClick={onSearch}>
          Consultar
        </Button>
      </Space.Compact>
    </Card>
  );
}
