export interface CatalogoContactos {
  intIdCotizacion: Entero;
  dtFecha: Date;
  dtFechaCompromiso: Date;
  dtFechaVigencia: Date;
  intIdVendedor: Entero;
  intIdContacto: Entero;
  vchNotas: string;
  vchNotasInternas: string;
  TerminosYCondiciones: string;
  LugarDeEntrega: string;
  Moneda:Moneda;
  FormaPago:string;
  IVA:Decimal;
  AplicaIVA:boolean;
  Subtotal:Decimal;
  Impuestos:Decimal;
  Total:Decimal;
}



type Moneda = number;
type Decimal = number;
type Flotante = number;
type Entero = number;