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
  return (
    <Card className="sgde-card-elevated" styles={{ body: { display: 'grid', gap: 18 } }}>
      <Space orientation="vertical" size={8} style={{ width: '100%' }}>
        <span className="sgde-chip">{eyebrow}</span>
        <Space align="start" style={{ width: '100%', justifyContent: 'space-between' }} wrap>
          <div>
            <Typography.Title level={4} style={{ marginBottom: 4 }}>
              {title}
            </Typography.Title>
            <Typography.Text className="sgde-muted">{description}</Typography.Text>
          </div>
          <Button type="primary" onClick={onCreate}>
            {createLabel}
          </Button>
        </Space>
        <Input.Search
          allowClear
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          style={{ maxWidth: 420 }}
        />
      </Space>
      <Table<T>
        rowKey={rowKey}
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        rowClassName={rowClassName}
        pagination={{
          ...pagination,
          responsive: true,
          showLessItems: true,
          position: ['bottomCenter'],
          size: 'default',
          pageSizeOptions: pagination.pageSizeOptions ?? ['5', '10', '20', '50'],
        }}
        onChange={onTableChange}
        size={tableSize}
        scroll={{ x: scrollX }}
      />
    </Card>
  );
}