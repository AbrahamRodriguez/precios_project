export interface RegistroLocalizacion {
  id: number;
  dt_fecha_localizacion: Date;
  int_id_contacto : number;
  int_id_nota : number;
  pago_realizado : number;
  numero_localizacion : string;
  estatus: boolean;
}