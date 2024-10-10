export interface PlanningDetail {
  alimentador: string;
  fechaCorte: string;
  horaDesde: string;
  horaHasta: string;
  comentario: string;
  fechaRegistro: string;
  fechaHoraCorte: string;
}

export interface Notification {
  idUnidadNegocios: number;
  cuentaContrato: string;
  alimentador: string;
  cuen: string;
  direccion: string;
  fechaRegistro: string;
  detallePlanificacion: PlanningDetail[];
}

export interface ApiResponse {
  resp: string;
  mensaje: string | null;
  mensajeError: string | null;
  extra: string | null;
  notificaciones: Notification[];
}

export interface ResponseAdapter {
  details: {
    idUnidadNegocios: number;
    cuentaContrato: string;
    alimentador: string;
    cuen: string;
    direccion: string;
    fechaRegistro: string;
  };
  notificaciones: {
    fechaCorte: string;
    cuentaContrato: string;
    direccion: string;
    fechaRegistro: string;
    idUnidadNegocios: number;
    detalles: PlanningDetail[];
  }[];
}
