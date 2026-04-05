import { Card, Skeleton } from 'antd';

export default function Loading() {
  return (
    <div style={{ padding: 24 }}>
      <Card className="sgde-surface">
        <Skeleton active paragraph={{ rows: 8 }} />
      </Card>
    </div>
  );
}