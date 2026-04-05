'use client';

import { useState } from 'react';
import type { TablePaginationConfig, TableProps } from 'antd';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';

export function useTableControls<TRecord>(initialPageSize = DEFAULT_PAGE_SIZE) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const updateQuery = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const handleTableChange: TableProps<TRecord>['onChange'] = (
    pagination: TablePaginationConfig,
  ) => {
    setPage(pagination.current ?? 1);
    setPageSize(pagination.pageSize ?? initialPageSize);
  };

  return {
    query,
    page,
    pageSize,
    updateQuery,
    setPage,
    setPageSize,
    handleTableChange,
  };
}