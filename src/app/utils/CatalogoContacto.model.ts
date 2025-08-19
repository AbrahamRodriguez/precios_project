export interface CatalogoContactos {
  intIdTipoContacto: Entero;
  tipo: 'prospecto' | 'cliente' ;
  nombre: string;
  productos: string;
  colonia: string;
  cp: string;
  ciudad: string;
  estado: string;
  pais: string;
  rfc:string;
}


type Moneda = number;
type Decimal = number;
type Flotante = number;
type Entero = number;