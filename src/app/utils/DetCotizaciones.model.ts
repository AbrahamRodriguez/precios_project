export interface DetCotizaciones {
  id: Entero;
  int_id_cotizaciones: Entero | null;
  int_id_prod_service: Entero;
  id_salida_inventario: Entero;
  fl_cantidad: Flotante;
  precio_unitario: Decimal;
  int_descuento: Entero | null;
  mo_subtotal: Moneda;
}

type Moneda = number;
type Decimal = number;
type Flotante = number;
type Entero = number;