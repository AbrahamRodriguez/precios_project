export interface NotaVenta {
  id: number;
  cliente?: string;
  productos: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia' | 'pendiente';
  fechaVenta: Date;
  folio: string;
  estadoPago: 'pagada' | 'pendiente' | 'cancelada';
}
