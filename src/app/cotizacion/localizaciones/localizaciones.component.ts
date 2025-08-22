
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table'; 
import { MatDialog } from '@angular/material/dialog';
import { ChangellamadaComponent } from '../localizaciones/changellamada/changellamada.component';
import { Cotizacion } from '../modelos/cotizacion.model';
import { ApiService } from 'src/app/utils/api.service';
import { SalidaConCliente } from 'src/app/utils/SalidaConCliente.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { VistaLlamadas } from 'src/app/utils/VistaLlamadas.model';
@Component({
  selector: 'app-localizaciones',
  templateUrl: './localizaciones.component.html',
  styleUrls: ['./localizaciones.component.css']
})
export class LocalizacionesComponent implements OnInit {
clientes : any [] = [];
 displayedColumns: string[] = [

  'id_llamada',
  'nombre_cliente',
  'dt_fecha_localizacion',
  'telefono_llamada',
  'total_salida',
  'acciones'
];

columnAlias: { [key: string]: string } = {
  id_llamada: 'ID Movimiento',
  // int_id_movimiento: 'ID Movimiento',
  dt_fecha_localizacion: 'Fecha de la Llamada',
  total_salida: 'Total',
  telefono_llamada: 'Número de Contacto',
  nombre_cliente: 'Nombre del Cliente',
  acciones : 'Editar'
};

dataSource = new MatTableDataSource<VistaLlamadas>();

filtroForm: FormGroup;

constructor(
   private fb: FormBuilder,
   public dialog: MatDialog,          
   public api : ApiService,) {
    this.filtroForm = this.fb.group({
      nombre: [''],
      fechaFin: [''],
      fechaInicio: [''],
      status: ['']
    });
}

async ngOnInit() {
    this.clientes = await this.api.getLlamadasCliente();
    this.dataSource = new MatTableDataSource(this.clientes);
    // console.log(Object.entries(this.clientes));
 }

async buscarCliente() {
  const { nombre, status , fechaFin , fechaInicio} = this.filtroForm.value;
  const bandera : any = status ? status == 1 : "";
   

  this.dataSource.filterPredicate = (data: VistaLlamadas, filter: string) => {
    const { fechaFilter, estatusFilter } = JSON.parse(filter);
    return (!fechaFilter || data.dt_fecha_localizacion?.toLowerCase().includes(fechaFilter.toLowerCase())) &&
           (!estatusFilter || data.estatus == estatusFilter.toLowerCase());
  };

  this.dataSource.filter = JSON.stringify({
    fechaFilter: fechaFin,
    estatusFilter: status
  });

  const fechaInicioStr = fechaInicio ? fechaInicio.toISOString() : null;
  const fechaFinStr = fechaFin ? fechaFin.toISOString() : null;


  this.clientes = await this.api.getLlamadasFiltro({
    nombre_cliente :  nombre ,
    estatus :  status ,
    fecha_fin :  fechaFinStr,
    fecha_inicio :  fechaInicioStr,
  });
  this.dataSource = new MatTableDataSource(this.clientes);

}

agregarNotaVenta() {
  const dialogRef = this.dialog.open(ChangellamadaComponent, {
     width: '150vh',
       //height: '76vh',
     disableClose: false,
     data: {
      modo : 'agregar',
     }
    }); 
}
  modalidadRoute = 0;

  editarCotizacion(id: number, indice:number) {
 
   const elemento = this.dataSource.data.find((el, i) =>  el.id_llamada === id);
    
    const dialogRef = this.dialog.open(ChangellamadaComponent, {
     width: '150vh',
       //height: '76vh',
     disableClose: false,
     data: {
      modo : 'editar',
      llamada: elemento
     }
    }); 
  }

eliminarFila(index: number): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "Esta acción no se puede deshacer",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    background: '#0c0707ff', // color de fondo
    color: '#f4f4f4'          // color del texto
  }).then((result) => {
    if (result.isConfirmed) {
      this.operacionEliminacion(index);
      Swal.fire({title: 'Eliminado', text: 'El producto ha sido eliminado.', icon: 'success' , background: '#0c0707ff', color: '#f4f4f4'  });
    }
  });
}

async operacionEliminacion(index: number){

  const registrosSalida = await this.api.getDetallesSalidaInventario(index);
  for (const del of registrosSalida ) {
    await this.api.devolverInventario(del.int_id_prod_service, del.fl_cantidad);
    await this.api.eliminarDetalle(del.id);
  }
  const borrarNota = this.api.eliminarNotaSalida(index);

}


  eliminarRegistro(cotizacion: any) {
    if (confirm('¿Deseas eliminar esta cotización?')) {
      console.log('Eliminar:', cotizacion);
    }
  }

  generarReporte(cotizacion: any) {
    console.log('Generar reporte para:', cotizacion);
  }

 
  generarPDF(id: number){

  }

  mostrarBotonEditar(index: number, columna: string): boolean {
     // Lógica que usabas antes: i > 1 && columna.length - 2 > i
     // Aquí puede cambiarse a algo más legible, por ejemplo:

    
    return columna !== 'Matricula' && columna !== 'Nombre' && columna !== 'Acciones';
   }

   seccionDialog(matricula: string, index: number) {
    console.log('Editar:', matricula, 'Columna:', index);
    // Lógica para abrir diálogo aquí
   }

}

