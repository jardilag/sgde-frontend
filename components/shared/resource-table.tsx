'use client';

import type { Key } from 'react';
import { Button, Card, Input, Space, Table, Typography } from 'antd';
import type { TablePaginationConfig, TableProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';

type ResourceTableProps<T> = Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  searchValue: string;
  searchPlaceholder: string;
  onSearchChange: (value: string) => void;
  onCreate: () => void;
  createLabel: string;
  loading: boolean;
  dataSource: T[];
  columns: ColumnsType<T>;
  rowKey: keyof T | ((record: T) => Key);
  pagination: TablePaginationConfig;
  onTableChange: TableProps<T>['onChange'];
  rowClassName?: TableProps<T>['rowClassName'];
  scrollX?: number | string;
  tableSize?: 'small' | 'middle' | 'large';
}>;

export function ResourceTable<T>({
  eyebrow,
  title,
  description,
  searchValue,
  searchPlaceholder,
  onSearchChange,
  onCreate,
  createLabel,
  loading,
  dataSource,
  columns,
  rowKey,
  pagination,
  onTableChange,
  rowClassName,
  scrollX = 960,
  tableSize = 'middle',
}: ResourceTableProps<T>) {
  const paginationConfig = { ...pagination };
  delete paginationConfig.position;

  return (
    <Card className="sgde-card-elevated" style={{ maxWidth: '100%', overflow: 'hidden' }} styles={{ body: { display: 'grid', gap: 18, minWidth: 0 } }}>
      <Space orientation="vertical" size={8} style={{ width: '100%' }}>
        <span className="sgde-chip">{eyebrow}</span>
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ minWidth: 0, flex: '1 1 280px' }}>
            <Typography.Title level={4} style={{ marginBottom: 4 }}>
              {title}
            </Typography.Title>
            <Typography.Text className="sgde-muted">{description}</Typography.Text>
          </div>
          <Button type="primary" onClick={onCreate} style={{ flex: '0 0 auto' }}>
            {createLabel}
          </Button>
        </div>
        <Input.Search
          allowClear
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          style={{ maxWidth: 420 }}
        />
      </Space>
      <div style={{ maxWidth: '100%', minWidth: 0, overflowX: 'auto' }}>
        <Table<T>
          rowKey={rowKey}
          loading={loading}
          dataSource={dataSource}
          columns={columns}
          rowClassName={rowClassName}
          pagination={{
            ...paginationConfig,
            responsive: true,
            showLessItems: true,
            placement: ['bottomCenter'],
            pageSizeOptions: pagination.pageSizeOptions ?? ['5', '10', '20', '50'],
          }}
          onChange={onTableChange}
          size={tableSize}
          scroll={{ x: scrollX }}
        />
      </div>
    </Card>
  );
}
