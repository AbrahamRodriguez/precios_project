import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule , FormBuilder, FormGroup } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


import { NotasComponent } from './cotizacion/notas/notas.component';
import { ProductosComponent } from './cotizacion/productos/productos.component';
import { ContactosComponent } from './cotizacion/contactos/contactos.component';
import { MovimientosComponent } from './cotizacion/movimientos/movimientos.component';
import { EjecutivosComponent } from './cotizacion/ejecutivos/ejecutivos.component';
import { ChangemovimientosComponent } from './cotizacion/movimientos/changemovimientos/changemovimientos.component';
import { ChangenotaComponent } from './cotizacion/notas/changenota/changenota.component';
import { LocalizacionesComponent } from './cotizacion/localizaciones/localizaciones.component';

@NgModule({
  declarations: [
    AppComponent,
    NotasComponent,
    ProductosComponent,
    ContactosComponent,
    MovimientosComponent,
    EjecutivosComponent,
    ChangemovimientosComponent,
    ChangenotaComponent,
    LocalizacionesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatExpansionModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatSidenavModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
