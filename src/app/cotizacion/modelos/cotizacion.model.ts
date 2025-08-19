export interface Cotizacion {
  id: number;
  cliente: string;
  productos: string;
  cantidad: number;
  fecha:string;
  rfc:string;
  precioUnitario: number;
  descuento?: number;
  condicionesPago?: string;
  validezOferta: string; // ej: "7 días", "Hasta el 20/07"
  estado: 'pendiente' | 'aceptada' | 'rechazada';
}
