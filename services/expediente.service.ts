/**
 * Servicios para API de Expedientes
 */

import { http } from '@/services/http';
import type { ApiListResponse } from '@/types/common';
import type {
  DocumentoExpediente,
  Expediente,
  ExpedienteExtended,
  ExpedienteFilters,
  ExpedienteRequest,
  HistorialExpediente,
} from '@/types/expediente';

export const expedienteService = {
  // Expedientes
  async fetchExpedientes(filters?: ExpedienteFilters): Promise<ApiListResponse<Expediente>> {
    const { data } = await http.get<ApiListResponse<Expediente>>('/expedientes', {
      params: {
        q: [filters?.codigoExpediente, filters?.nombre].filter(Boolean).join(' '),
        dependenciaId: filters?.dependenciaId,
        subserieId: filters?.subserieId,
        estadoActual: filters?.estadoActual,
        fechaDesde: filters?.fechaDesde,
        fechaHasta: filters?.fechaHasta,
      },
    });

    return data;
  },

  async fetchExpedienteById(id: string): Promise<ExpedienteExtended> {
    const { data } = await http.get<{ item: ExpedienteExtended }>(`/expedientes/${id}`);
    return data.item;
  },

  async createExpediente(payload: ExpedienteRequest): Promise<Expediente> {
    const { data } = await http.post<{ message: string; item: Expediente }>('/expedientes', payload);
    return data.item;
  },

  async updateExpediente(id: string, payload: Partial<ExpedienteRequest>): Promise<Expediente> {
    const { data } = await http.put<{ message: string; item: Expediente }>(`/expedientes/${id}`, payload);
    return data.item;
  },

  async deleteExpediente(id: string): Promise<void> {
    await http.delete(`/expedientes/${id}`);
  },

  async cerrarExpediente(id: string, fechaCierre: string): Promise<Expediente> {
    const { data } = await http.put<{ message: string; item: Expediente }>(`/expedientes/${id}/cerrar`, {
      fechaCierre,
    });
    return data.item;
  },

  async reabrirExpediente(id: string): Promise<Expediente> {
    const { data } = await http.put<{ message: string; item: Expediente }>(`/expedientes/${id}/reabrir`, {});
    return data.item;
  },

  // Historial
  async fetchHistorial(expedienteId: string): Promise<HistorialExpediente[]> {
    const { data } = await http.get<HistorialExpediente[]>(`/expedientes/${expedienteId}/historial`);
    return data;
  },

  // Documentos
  async fetchDocumentos(expedienteId: string): Promise<DocumentoExpediente[]> {
    const { data } = await http.get<DocumentoExpediente[]>(`/expedientes/${expedienteId}/documentos`);
    return data;
  },

  async agregarDocumento(
    expedienteId: string,
    documento: Omit<DocumentoExpediente, 'id' | 'expedienteId' | 'fechaCarga'>
  ): Promise<DocumentoExpediente> {
    const { data } = await http.post<DocumentoExpediente>(`/expedientes/${expedienteId}/documentos`, documento);
    return data;
  },

  async eliminarDocumento(expedienteId: string, documentoId: string): Promise<void> {
    await http.delete(`/expedientes/${expedienteId}/documentos/${documentoId}`);
  },
};
