import { Injectable } from '@angular/core';
import { createClient , SupabaseClient } from '@supabase/supabase-js';
import { initSupabase } from './initSupabase';
import { cat_prod_services } from './CatProdServices.model';
import { DetCotizaciones } from './DetCotizaciones.model';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, shareReplay, map } from 'rxjs/operators';
import { CatalogoContactos } from './CatalogoContacto.model';
import { SalidaConCliente } from './SalidaConCliente.model';
import { salidas_inventario } from './salidas_inventario.model';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  supabase : SupabaseClient ;

  
  constructor() {
    this.supabase = createClient(initSupabase.supabaseUrl, initSupabase.supabaseKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
  }


  // 🔹 Editar salida de inventario
  async updateSalidaInventario(idMovimiento: number, data: Partial<salidas_inventario>) {
    const { data: updated, error } = await this.supabase
      .from('salidas_inventario')
      .update(data)
      .eq('id_salida', idMovimiento);

    if (error) throw error;
    return updated;
  }

  // 🔹 Editar detalle de cotización
  async updateDetalleCotizacion(idDetalle: number, data: Partial<DetCotizaciones>) {
    const { data: updated, error } = await this.supabase
      .from('DetCotizaciones')
      .update(data)
      .eq('id_salida_inventario', idDetalle);

    if (error) throw error;
    return updated;
  }

  // 🔹 Editar producto
  async updateProducto(idProducto: number, data: Partial<cat_prod_services>) {
    const { data: updated, error } = await this.supabase
      .from('cat_prod_services')
      .update(data)
      .eq('int_id_prod_service', idProducto);

    if (error) throw error;
    return updated;
  }

  // 🔹 Ejemplo de actualización en cadena
  async editarMovimientoCompleto(
    idMovimiento: number,
    salidaData: Partial<salidas_inventario>,
    detalleData?: Partial<DetCotizaciones>,
    productoData?: Partial<cat_prod_services>
  ) {
    // Actualizar salida
    await this.updateSalidaInventario(idMovimiento, salidaData);

    // Actualizar detalle si se envió
    if (detalleData) {
      await this.updateDetalleCotizacion(idMovimiento, detalleData);
    }

    // Actualizar producto si se envió
    if (productoData) {
      await this.updateProducto(salidaData.id_salida!, productoData);
    }

    return { message: 'Actualización completada' };
  }
async devolverInventario(idProducto: number, cantidad: number): Promise<boolean> {
  // 1. Obtener el producto actual
  const { data: producto, error: errorSelect } = await this.supabase
    .from('cat_prod_services')
    .select('cantidad')
    .eq('int_id_prod_service', idProducto)
    .single();

  if (errorSelect) {
    console.error('Error al consultar existencias:', errorSelect);
    return false;
  }

  // 2. Actualizar sumando la cantidad
  const { error: errorUpdate } = await this.supabase
    .from('cat_prod_services')
    .update({
      cantidad: producto.cantidad + cantidad
    })
    .eq('int_id_prod_service', idProducto);

  if (errorUpdate) {
    console.error('Error al devolver inventario:', errorUpdate);
    return false;
  }

  return true;
}

async reducirInventario(idProducto: number, cantidad: number): Promise<boolean> {
  // 1. Obtener el producto actual
  const { data: producto, error: errorSelect } = await this.supabase
    .from('cat_prod_services')
    .select('cantidad')
    .eq('int_id_prod_service', idProducto)
    .single();

  if (errorSelect) {
    console.error('Error al consultar existencias:', errorSelect);
    return false;
  }

  // 2. Verificar stock suficiente
  if (producto.cantidad < cantidad) {
    console.warn(`Stock insuficiente para producto ${idProducto}`);
    return false;
  }

  // 3. Actualizar restando la cantidad
  const { error: errorUpdate } = await this.supabase
    .from('cat_prod_services')
    .update({
      cantidad: producto.cantidad - cantidad
    })
    .eq('int_id_prod_service', idProducto);

  if (errorUpdate) {
    console.error('Error al reducir inventario:', errorUpdate);
    return false;
  }

  return true;
}


  get client(): SupabaseClient {
    return this.supabase;
  }

  

 async insertarMovimiento(data: {
  id_contacto: number;
  motivo: string;
  fecha_salida: string;
  total:number;
}): Promise<{ id_salida: number } | null> {
  const { data: inserted, error } = await this.supabase
    .from('salidas_inventario')
    .insert([data])
    .select('id_salida')
    .single();

  if (error) {
    console.error('Error insertando movimiento:', error.message);
    return null;
  }

  return inserted;
}
async buscarListaCompras(id_nota : number): Promise<DetCotizaciones[] | null>{
    const { data, error } = await this.supabase
    .from('DetCotizaciones')
    // .select(`
    //   int_id_prod_service,
    //   fl_cantidad,
    //   precio_unitario,
    //   cat_prod_services (
    //     vch_nombre_prod_service
    //   )
    // `)
    .select(`
      *
    `)
    .eq('id_salida_inventario', id_nota);

      if (error) {
        console.error('Error al obtener DetCotizaciones:', error);
        return null;
      }

  // Aquí TypeScript sabrá que `data` es tipo `any`, así que casteamos:
  return data as DetCotizaciones[];
}
async descontarInventario(id_producto: number, cantidadDescontar: number): Promise<void> {
  const { error } = await this.supabase.rpc('descontar_inventario', {
    p_id_producto: id_producto,
    p_cantidad: cantidadDescontar
  });

  if (error) {
    console.error(`Error al descontar inventario del producto ${id_producto}:`, error.message);
    throw error;
  }
}
async descontarInventarioORM(id_producto: number, cantidadDescontar: number): Promise<void> {
  // 1. Obtener la cantidad actual
  const { data, error: getError } = await this.supabase
    .from('cat_prod_services')
    .select('cantidad')
    .eq('int_id_prod_service', id_producto)
    .single();

  if (getError || !data) {
    console.error('Error al obtener producto:', getError?.message);
    throw getError;
  }

  const nuevaCantidad = data.cantidad - cantidadDescontar;

  // 2. Actualizar la nueva cantidad
  const { error: updateError } = await this.supabase
    .from('cat_prod_services')
    .update({ cantidad: nuevaCantidad })
    .eq('int_id_prod_service', id_producto);

  if (updateError) {
    console.error('Error al actualizar cantidad:', updateError.message);
    throw updateError;
  }
}
async getDetallesSalidaInventario(idSalidaInventario: number): Promise<DetCotizaciones[]> {
  const { data, error } = await this.supabase
    .from('DetCotizaciones')
    .select('*')
    .eq('id_salida_inventario', idSalidaInventario);

  if (error) {
    console.error('Error al obtener detalles:', error);
    throw error;
  }

  return data as DetCotizaciones[];
}

async modificarDetalle(detalle: DetCotizaciones): Promise<void> {
  const { error } = await this.supabase
    .from('DetCotizaciones')
    .update({
      int_id_cotizaciones: detalle.int_id_cotizaciones,
      int_id_prod_service: detalle.int_id_prod_service,
      id_salida_inventario: detalle.id_salida_inventario,
      fl_cantidad: detalle.fl_cantidad,
      precio_unitario: detalle.precio_unitario,
      int_descuento: detalle.int_descuento,
      mo_subtotal: detalle.mo_subtotal
    })
    .eq('id', detalle.id);

  if (error) {
    console.error('Error al modificar detalle:', error);
    throw error;
  }
}

async eliminarNotaSalida(idDetalle: number): Promise<void> {
  const { error } = await this.supabase
    .from('salidas_inventario')
    .delete()
    .eq('id_salida', idDetalle);

  if (error) throw error;
}

async eliminarDetalle(idDetalle: number): Promise<void> {
  const { error } = await this.supabase
    .from('DetCotizaciones')
    .delete()
    .eq('id', idDetalle);

  if (error) throw error;
}




async insertarDetalleMovimientoUnico(detalle : DetCotizaciones): Promise<{ data?: any; error?: any }> {
  const { data, error } = await this.supabase
    .from('DetCotizaciones')
    .insert(detalle);

  return { data, error };
}


async insertarDetallesMovimiento(detalles: {
  id_salida_inventario: number;
  int_id_prod_service: number;
  fl_cantidad: number;
  precio_unitario: number;
}[]): Promise<{ data?: any; error?: any }> {
  const { data, error } = await this.supabase
    .from('DetCotizaciones')
    .insert(detalles);

  return { data, error };
}

async getSalidasConClientes() {
  const { data, error } = await this.supabase
    .from('salidas_inventario') // tabla principal
    .select(`
      id_salida,
      fecha_salida,
      total,
      catalogo_tipos_contacto (
        int_id_tipo_contacto,
        rfc,
        nombre
      )
    `)

  if (error) {
    console.error('Error al obtener salidas con clientes:', error);
    return [];
  }

  // Mapear la respuesta a una estructura plana
  const resultado = data.map((row: any) => ({
    id: row.id_salida,
    dt_fecha: row.fecha_salida,
    total: row.total,
    rfc: row.catalogo_tipos_contacto?.rfc || '',
    nombre: row.catalogo_tipos_contacto?.nombre || '',
  }));



  return resultado;
}
async functionAgruparProductos(): Promise<cat_prod_services[]> {
  const { data, error } = await this.supabase
  .from('cat_prod_services') // usa una tabla real que tengas
  .select('*');

      
    if (error) {
      console.error('Error al cargar productos:', error.message);
      return [];
    }

    return data as cat_prod_services[];
} 

  async buscarClientes(valor: string): Promise<any[]> {
  const { data, error } = await this.client
    .from('catalogo_tipos_contacto')
    // .select('int_id_tipo_contacto, nombre, rfc')
    .select('*')
    .or(`nombre.ilike.%${valor}%,rfc.ilike.%${valor}%`);

  if (error) {
    console.error('Error al buscar clientes:', error.message);
    return [];
  }

  return data ?? [];
 }

}
