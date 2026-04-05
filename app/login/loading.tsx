import { Card, Skeleton } from 'antd';

export default function Loading() {
  return (
    <div style={{ padding: 24, minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <Card className="sgde-surface" style={{ width: 'min(100%, 560px)' }}>
        <Skeleton active paragraph={{ rows: 8 }} />
      </Card>
    </div>
  );
}