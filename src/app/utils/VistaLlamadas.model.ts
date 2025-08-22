export interface VistaLlamadas {
  id_contacto: number;             // ID del cliente/contacto
  id_salida: number;               // ID de la salida de inventario
  id_llamada: number;              // ID de la llamada / localización
  nombre_cliente: string;          // Nombre del cliente
  total_salida: number;            // Total de la salida de inventario
  monto_llamada: number;           // Monto pagado en la llamada
  estatus: boolean;                // Estado de la llamada (true = saldado, false = deudor)
  dt_fecha_localizacion: string;   // Fecha y hora de la llamada/localización (ISO string)
  fecha_formateada: string;
  telefono_llamada: string;        // Número de teléfono o folio de la llamada
}
