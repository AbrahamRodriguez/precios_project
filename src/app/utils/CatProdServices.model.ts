export interface cat_prod_services {
  int_id_prod_service: Entero;
  vch_nombre_prod_service: string;
  vch_descripcion_prod_service: string;
  int_id_tipo_unidad_medida: Entero;
  int_id_categoria: Entero;
  int_id_color: Entero;
  cantidad: Entero;
  fl_peso: Flotante;
  fl_contenido: Flotante;
  fl_maximo: Flotante;
  fl_minimo: Flotante;
  int_id_status: Entero;
  mo_precio: Moneda;
  int_id_clave_sat: Entero;
}


type Moneda = number;
type Decimal = number;
type Flotante = number;
type Entero = number;