export interface salidas_inventario {
  id_salida: number;
  fecha_salida: Date;
  id_contacto: number;
  id_cotizacion: number;
  total: number;
  motivo: string;
  observaciones: string;
}
