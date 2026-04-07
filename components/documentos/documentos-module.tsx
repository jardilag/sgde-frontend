'use client';

import { useEffect, useMemo, useState } from 'react';
import { App, Button, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EyeOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/shared/page-header';
import { ResourceTable } from '@/components/shared/resource-table';
import { useTableControls } from '@/hooks/use-table-controls';
import { useDependenciasQuery } from '@/hooks/use-dependencias';
import { useExpedientesQuery } from '@/hooks/use-expediente';
import {
  useDocumentoByRadicadoQuery,
  useDocumentoMutations,
  useDocumentosQuery,
} from '@/hooks/use-documentos';
import type { Documento, DocumentoFilters, DocumentoRequest } from '@/types/documento';
import { formatDate, formatFileSize } from '@/utils/formatters';
import { DocumentoConsultaBar } from '@/components/documentos/documento-consulta-bar';
import { DocumentoDetailPanel } from '@/components/documentos/documento-detail-panel';
import { DocumentoFiltersCard } from '@/components/documentos/documento-filters';
import { DocumentoForm } from '@/components/documentos/documento-form';

type DocumentoAdvancedFilters = Omit<DocumentoFilters, 'q' | 'page' | 'pageSize'>;

const initialAdvancedFilters: DocumentoAdvancedFilters = {};

function mergeFilters(table: ReturnType<typeof useTableControls<Documento>>, advanced: DocumentoAdvancedFilters): DocumentoFilters {
  return {
    q: table.query,
    page: table.page,
    pageSize: table.pageSize,
    ...advanced,
  };
}

export function DocumentosModule() {
  const { notification } = App.useApp();
  const table = useTableControls<Documento>();
  const [advancedFilters, setAdvancedFilters] = useState<DocumentoAdvancedFilters>(initialAdvancedFilters);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedDocumento, setSelectedDocumento] = useState<Documento | null>(null);
  const [consultRadicado, setConsultRadicado] = useState('');

  const documentosQuery = useDocumentosQuery(mergeFilters(table, advancedFilters));
  const documentoConsultaQuery = useDocumentoByRadicadoQuery(consultRadicado.trim());
  const dependenciasQuery = useDependenciasQuery({ q: '', page: 1, pageSize: 100 });
  const expedientesQuery = useExpedientesQuery();
  const { createMutation, updateMutation } = useDocumentoMutations();

  const dependenciasOptions = useMemo(
    () => dependenciasQuery.data?.items.map((item) => ({ label: `${item.nombre} (${item.codigo})`, value: item.id })) ?? [],
    [dependenciasQuery.data?.items],
  );

  const expedientesOptions = useMemo(
    () =>
      expedientesQuery.data?.items.map((item) => ({ label: `${item.codigoExpediente} - ${item.nombre}`, value: item.id })) ?? [],
    [expedientesQuery.data?.items],
  );

  useEffect(() => {
    if (documentoConsultaQuery.data) {
      setSelectedDocumento(documentoConsultaQuery.data);
      setDetailOpen(true);
    }
  }, [documentoConsultaQuery.data]);

  const openCreateDrawer = () => {
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const openDetail = (documento: Documento) => {
    setSelectedDocumento(documento);
    setDetailOpen(true);
  };

  const handleCreateDocumento = async (payload: DocumentoRequest, onProgress: (progress: number) => void) => {
    try {
      const documento = await createMutation.mutateAsync({ payload, onProgress });
      notification.success({
        title: 'Documento radicado',
        description: `El backend generó el radicado ${documento.numeroRadicado ?? documento.radicado}.`,
      });
      setSelectedDocumento(documento);
      setDetailOpen(true);
    } catch (error) {
      notification.error({
        title: 'Error al radicar',
        description: error instanceof Error ? error.message : 'No fue posible completar la radicación.',
      });
      throw error;
    }
  };

  const handleQuickConsult = () => {
    const value = consultRadicado.trim();
    if (!value) {
      notification.warning({ title: 'Ingresa un número de radicado para consultar.' });
      return;
    }

    if (documentoConsultaQuery.data === null) {
      notification.warning({
        title: 'Radicado no encontrado',
        description: `No se encontró un documento con el número ${value}.`,
      });
    }
  };

  const columns: ColumnsType<Documento> = [
    {
      title: 'Radicado',
      dataIndex: 'numeroRadicado',
      width: 160,
      render: (_value, record) => record.numeroRadicado ?? record.radicado,
    },
    { title: 'Título', dataIndex: 'titulo', width: 250 },
    {
      title: 'Tipo',
      dataIndex: 'tipoRadicado',
      width: 120,
      render: (value: string | undefined) => <Tag color="blue">{value ?? 'Sin tipo'}</Tag>,
    },
    { title: 'Documento', dataIndex: 'tipoDocumento', width: 170 },
    {
      title: 'Dependencia',
      dataIndex: 'dependenciaNombre',
      width: 200,
      render: (_value, record) => record.dependenciaNombre ?? record.dependencia,
    },
    {
      title: 'Expediente',
      dataIndex: 'expedienteCodigo',
      width: 180,
      render: (_value, record) => record.expedienteCodigo ?? record.expedienteId ?? 'No asociado',
    },
    {
      title: 'Fecha',
      dataIndex: 'fechaDocumento',
      width: 140,
      render: (_value, record) => formatDate(record.fechaDocumento ?? record.fechaRadicacion),
    },
    {
      title: 'Archivo',
      dataIndex: 'archivoNombre',
      width: 180,
      render: (_value, record) => record.archivoNombre ?? record.metadata?.nombreArchivo ?? 'Sin archivo',
    },
    {
      title: 'Tamaño',
      dataIndex: 'tamanioBytes',
      width: 120,
      render: (_value, record) => formatFileSize(record.tamanioBytes ?? record.metadata?.tamanioBytes),
    },
    {
      title: 'Acciones',
      key: 'actions',
      fixed: 'right',
      width: 140,
      render: (_value, record) => (
        <Button icon={<EyeOutlined />} onClick={() => openDetail(record)}>
          Ver detalle
        </Button>
      ),
    },
  ];

  return (
    <div className="sgde-page-grid">
      <PageHeader
        eyebrow="Módulo de radicación documental"
        title="Radicación Documental"
        description="Registra documentos de entrada, salida o internos, adjunta archivos y consulta por número de radicado."
        actionLabel="Nueva radicación"
        onAction={openCreateDrawer}
        extra={<Tag color="blue">Multipart listo para Spring Boot</Tag>}
      />

      {(documentosQuery.isError || dependenciasQuery.isError || expedientesQuery.isError) ? (
        <div role="alert" className="sgde-surface" style={{ padding: 16, borderRadius: 12 }}>
          <strong>No fue posible cargar la información</strong>
          <div className="sgde-muted" style={{ marginTop: 8 }}>
            {(documentosQuery.error as Error)?.message ??
              (dependenciasQuery.error as Error)?.message ??
              (expedientesQuery.error as Error)?.message ??
              'Revisa la conexión con la API.'}
          </div>
        </div>
      ) : null}

      <DocumentoConsultaBar
        value={consultRadicado}
        onChange={setConsultRadicado}
        onSearch={handleQuickConsult}
        loading={documentoConsultaQuery.isFetching}
      />

      {consultRadicado.trim() && !documentoConsultaQuery.isFetching && documentoConsultaQuery.data === null ? (
        <div className="sgde-surface" style={{ padding: 16, borderRadius: 12 }}>
          <strong>Radicado no encontrado</strong>
          <div className="sgde-muted" style={{ marginTop: 8 }}>
            No existe un documento con el número {consultRadicado.trim()}.
          </div>
        </div>
      ) : null}

      <DocumentoFiltersCard
        dependencias={dependenciasOptions}
        onApply={(filters) => {
          setAdvancedFilters(filters);
          table.setPage(1);
        }}
        onClear={() => {
          setAdvancedFilters(initialAdvancedFilters);
          table.setPage(1);
        }}
      />

      <ResourceTable<Documento>
        eyebrow="Bandeja documental"
        title="Documentos radicados"
        description="Consulta server-side con búsqueda general, filtros avanzados y acceso al detalle del documento."
        searchValue={table.query}
        searchPlaceholder="Buscar por radicado, título o dependencia"
        onSearchChange={table.updateQuery}
        onCreate={openCreateDrawer}
        createLabel="Nueva radicación"
        loading={documentosQuery.isLoading || documentosQuery.isFetching}
        dataSource={documentosQuery.data?.items ?? []}
        columns={columns}
        rowKey="id"
        pagination={{
          current: documentosQuery.data?.meta.page,
          pageSize: documentosQuery.data?.meta.pageSize,
          total: documentosQuery.data?.meta.total,
          showSizeChanger: true,
          showTotal: (total) => `${total} documentos`,
        }}
        onTableChange={table.handleTableChange}
      />

      <DocumentoForm
        open={drawerOpen}
        loading={createMutation.isPending || updateMutation.isPending}
        onClose={closeDrawer}
        onSubmit={handleCreateDocumento}
        dependencias={dependenciasOptions}
        expedientes={expedientesOptions}
      />

      <DocumentoDetailPanel documento={selectedDocumento} open={detailOpen} onClose={() => setDetailOpen(false)} />
    </div>
  );
}