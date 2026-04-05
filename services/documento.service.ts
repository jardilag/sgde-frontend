import { http } from '@/services/http';
import type { ApiListResponse } from '@/types/common';
import type { Documento, DocumentoApiResponse, DocumentoFilters, DocumentoRequest } from '@/types/documento';

function appendIfPresent(formData: FormData, key: string, value: string | undefined) {
  if (value !== undefined && value !== '') {
    formData.append(key, value);
  }
}

export function buildDocumentoFormData(payload: DocumentoRequest) {
  const formData = new FormData();

  formData.append('tipoDocumento', payload.tipoDocumento);
  formData.append('tipoRadicado', payload.tipoRadicado);
  formData.append('titulo', payload.titulo);
  formData.append('fechaDocumento', payload.fechaDocumento);
  formData.append('dependenciaId', payload.dependenciaId);
  appendIfPresent(formData, 'expedienteId', payload.expedienteId);
  appendIfPresent(formData, 'observacion', payload.observacion);
  formData.append('archivo', payload.archivo);

  return formData;
}

export async function fetchDocumentos(filters: DocumentoFilters) {
  const { data } = await http.get<ApiListResponse<Documento>>('/documentos', {
    params: filters,
  });

  return data;
}

export async function fetchDocumentoByRadicado(numeroRadicado: string) {
  const result = await fetchDocumentos({ q: numeroRadicado, numeroRadicado, page: 1, pageSize: 1 });
  return result.items[0] ?? null;
}

export async function radicarDocumento(
  payload: DocumentoRequest,
  onProgress?: (progress: number) => void,
) {
  const formData = buildDocumentoFormData(payload);
  const { data } = await http.post<DocumentoApiResponse>('/documentos', formData, {
    onUploadProgress: (event) => {
      if (!onProgress) return;
      if (!event.total) {
        onProgress(35);
        return;
      }

      onProgress(Math.min(99, Math.round((event.loaded / event.total) * 100)));
    },
  });

  onProgress?.(100);
  return data.item;
}

export async function actualizarDocumento(
  id: string,
  payload: DocumentoRequest,
  onProgress?: (progress: number) => void,
) {
  const formData = buildDocumentoFormData(payload);
  const { data } = await http.put<DocumentoApiResponse>(`/documentos/${id}`, formData, {
    onUploadProgress: (event) => {
      if (!onProgress) return;
      if (!event.total) {
        onProgress(35);
        return;
      }

      onProgress(Math.min(99, Math.round((event.loaded / event.total) * 100)));
    },
  });

  onProgress?.(100);
  return data.item;
}

export async function eliminarDocumento(id: string) {
  const { data } = await http.delete<{ message: string }>(`/documentos/${id}`);
  return data;
}
