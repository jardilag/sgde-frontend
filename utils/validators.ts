import { AUTH_DEMO_CREDENTIALS } from '@/utils/constants';

type ValidationResult = {
  valid: boolean;
  errors: Record<string, string>;
};

const nonEmpty = (value: unknown) => typeof value === 'string' && value.trim().length > 0;

const isEmail = (value: unknown) =>
  typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const isIsoDateString = (value: unknown) =>
  typeof value === 'string' && !Number.isNaN(Date.parse(value));

export function validateLoginPayload(payload: { correo?: unknown; contrasena?: unknown }): ValidationResult {
  const errors: Record<string, string> = {};

  if (!nonEmpty(payload.correo)) {
    errors.correo = 'El correo electrónico es obligatorio.';
  } else if (!isEmail(payload.correo)) {
    errors.correo = 'Ingrese un correo electrónico válido.';
  }

  if (!nonEmpty(payload.contrasena)) {
    errors.contrasena = 'La contraseña es obligatoria.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateDemoCredentials(correo: string, contrasena: string) {
  return correo === AUTH_DEMO_CREDENTIALS.email && contrasena === AUTH_DEMO_CREDENTIALS.password;
}

const isFileLike = (value: unknown) =>
  typeof File !== 'undefined' && value instanceof File;

export function validateDocumentoPayload(payload: Record<string, unknown>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!nonEmpty(payload.tipoDocumento)) errors.tipoDocumento = 'El tipo de documento es obligatorio.';
  if (!nonEmpty(payload.tipoRadicado)) errors.tipoRadicado = 'El tipo de radicado es obligatorio.';
  if (!nonEmpty(payload.titulo)) errors.titulo = 'El título es obligatorio.';
  if (!isIsoDateString(payload.fechaDocumento)) errors.fechaDocumento = 'La fecha del documento es obligatoria.';
  if (!nonEmpty(payload.dependenciaId)) errors.dependenciaId = 'La dependencia es obligatoria.';
  if (payload.expedienteId !== undefined && payload.expedienteId !== null && payload.expedienteId !== '' && !nonEmpty(payload.expedienteId))
    errors.expedienteId = 'El expediente seleccionado no es válido.';
  if (!isFileLike(payload.archivo)) errors.archivo = 'Debe adjuntar un archivo válido.';

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export const validateDocumentoRadicadoPayload = validateDocumentoPayload;

export function validatePrestamoPayload(payload: Record<string, unknown>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!nonEmpty(payload.expedienteId)) errors.expedienteId = 'El expediente es obligatorio.';
  if (!nonEmpty(payload.dependenciaSolicitanteId)) errors.dependenciaSolicitanteId = 'La dependencia solicitante es obligatoria.';
  if (!isIsoDateString(payload.fechaPrestamo)) errors.fechaPrestamo = 'La fecha de préstamo es obligatoria.';
  if (!isIsoDateString(payload.fechaDevolucionEsperada)) errors.fechaDevolucionEsperada = 'La fecha de devolución esperada es obligatoria.';

  if (
    isIsoDateString(payload.fechaPrestamo) &&
    isIsoDateString(payload.fechaDevolucionEsperada) &&
    String(payload.fechaDevolucionEsperada) < String(payload.fechaPrestamo)
  ) {
    errors.fechaDevolucionEsperada = 'La devolución esperada no puede ser anterior a la fecha de préstamo.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validatePrestamoDevolucionPayload(payload: Record<string, unknown>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!isIsoDateString(payload.fechaDevolucionReal)) {
    errors.fechaDevolucionReal = 'La fecha de devolución real es obligatoria.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateTransferenciaPayload(payload: Record<string, unknown>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!nonEmpty(payload.tipoTransferencia)) {
    errors.tipoTransferencia = 'El tipo de transferencia es obligatorio.';
  } else if (payload.tipoTransferencia !== 'Primaria' && payload.tipoTransferencia !== 'Secundaria') {
    errors.tipoTransferencia = 'El tipo de transferencia no es válido.';
  }

  if (!isIsoDateString(payload.fechaTransferencia)) {
    errors.fechaTransferencia = 'La fecha de transferencia es obligatoria.';
  }

  if (!Array.isArray(payload.expedienteIds) || payload.expedienteIds.length === 0) {
    errors.expedienteIds = 'Selecciona al menos un expediente.';
  } else {
    const hasInvalidId = payload.expedienteIds.some((id) => !nonEmpty(id));
    if (hasInvalidId) {
      errors.expedienteIds = 'La lista de expedientes contiene valores no válidos.';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateRadicadoPayload(payload: Record<string, unknown>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!nonEmpty(payload.numeroRadicado)) errors.numeroRadicado = 'El número de radicado es obligatorio.';
  if (!nonEmpty(payload.asunto)) errors.asunto = 'El asunto es obligatorio.';
  if (!nonEmpty(payload.remitente)) errors.remitente = 'El remitente es obligatorio.';
  if (!nonEmpty(payload.dependenciaDestino)) errors.dependenciaDestino = 'La dependencia de destino es obligatoria.';
  if (!nonEmpty(payload.estado)) errors.estado = 'El estado es obligatorio.';
  if (!isIsoDateString(payload.fechaRadicacion)) errors.fechaRadicacion = 'La fecha de radicación es obligatoria.';

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateUsuarioPayload(payload: Record<string, unknown>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!nonEmpty(payload.nombre)) errors.nombre = 'El nombre es obligatorio.';
  if (!nonEmpty(payload.email)) errors.email = 'El correo electrónico es obligatorio.';
  else if (!isEmail(payload.email)) errors.email = 'Ingrese un correo electrónico válido.';
  if (!nonEmpty(payload.rol)) errors.rol = 'El rol es obligatorio.';
  if (!nonEmpty(payload.dependencia)) errors.dependencia = 'La dependencia es obligatoria.';
  if (typeof payload.activo !== 'boolean') errors.activo = 'El estado activo es obligatorio.';

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateDependenciaPayload(payload: Record<string, unknown>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!nonEmpty(payload.nombre)) errors.nombre = 'El nombre es obligatorio.';
  if (!nonEmpty(payload.codigo)) errors.codigo = 'El código es obligatorio.';
  if (!nonEmpty(payload.descripcion)) errors.descripcion = 'La descripción es obligatoria.';
  if (!nonEmpty(payload.estado)) errors.estado = 'El estado es obligatorio.';

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateSeriePayload(payload: Record<string, unknown>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!nonEmpty(payload.codigo)) errors.codigo = 'El código es obligatorio.';
  if (!nonEmpty(payload.nombre)) errors.nombre = 'El nombre es obligatorio.';
  if (!nonEmpty(payload.descripcion)) errors.descripcion = 'La descripción es obligatoria.';
  if (!nonEmpty(payload.estado)) errors.estado = 'El estado es obligatorio.';

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateSubseriePayload(payload: Record<string, unknown>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!nonEmpty(payload.serieId)) errors.serieId = 'La serie es obligatoria.';
  if (!nonEmpty(payload.codigo)) errors.codigo = 'El código es obligatorio.';
  if (!nonEmpty(payload.nombre)) errors.nombre = 'El nombre es obligatorio.';
  if (typeof payload.tiempoRetencionGestion !== 'number' || payload.tiempoRetencionGestion < 0)
    errors.tiempoRetencionGestion = 'El tiempo de retención en gestión es obligatorio.';

  if (typeof payload.tiempoRetencionCentral !== 'number' || payload.tiempoRetencionCentral < 0)
    errors.tiempoRetencionCentral = 'El tiempo de retención en central es obligatorio.';
  if (!nonEmpty(payload.disposicionFinal)) errors.disposicionFinal = 'La disposición final es obligatoria.';
  if (!nonEmpty(payload.estado)) errors.estado = 'El estado es obligatorio.';

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateExpedientePayload(payload: Record<string, unknown>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!nonEmpty(payload.codigoExpediente)) errors.codigoExpediente = 'El código del expediente es obligatorio.';
  if (!nonEmpty(payload.nombre)) errors.nombre = 'El nombre es obligatorio.';
  if (!isIsoDateString(payload.fechaApertura)) errors.fechaApertura = 'La fecha de apertura es obligatoria.';
  if (payload.fechaCierre && !isIsoDateString(payload.fechaCierre)) errors.fechaCierre = 'La fecha de cierre debe ser una fecha válida.';
  if (!nonEmpty(payload.estadoActual)) errors.estadoActual = 'El estado es obligatorio.';
  if (!nonEmpty(payload.dependenciaId)) errors.dependenciaId = 'La dependencia es obligatoria.';
  if (!nonEmpty(payload.subserieId)) errors.subserieId = 'La subserie es obligatoria.';

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}