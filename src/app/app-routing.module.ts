import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotasComponent } from './cotizacion/notas/notas.component';
import { ProductosComponent } from './cotizacion/productos/productos.component';
import { ContactosComponent } from './cotizacion/contactos/contactos.component';
import { MovimientosComponent } from './cotizacion/movimientos/movimientos.component';
import { EjecutivosComponent } from './cotizacion/ejecutivos/ejecutivos.component';
import { LocalizacionesComponent } from './cotizacion/localizaciones/localizaciones.component';
const routes: Routes = [
  {path:"notas", component: NotasComponent},
  {path:"productos", component: ProductosComponent},
  {path:"contactos", component: ContactosComponent},
  {path:"movimientos", component: MovimientosComponent},
  {path:"ejecutivos", component: EjecutivosComponent},
  {path:"localizar", component: LocalizacionesComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
