import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table'; 
import { MatDialog } from '@angular/material/dialog';
import { ChangenotaComponent } from './changenota/changenota.component';
import { Cotizacion } from '../modelos/cotizacion.model';
import { ApiService } from 'src/app/utils/api.service';
import { SalidaConCliente } from 'src/app/utils/SalidaConCliente.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-notas',
  templateUrl: './notas.component.html',
  styleUrls: ['./notas.component.css']
})
export class NotasComponent implements OnInit {
 clientes : any [] = [];
 displayedColumns: string[] = [

  'rfc',
  'nombre',
  'dt_fecha',
  'id',
  // 'int_id_movimiento',
  'total',
  'acciones'
];

columnAlias: { [key: string]: string } = {
  id: 'ID Movimiento',
  // int_id_movimiento: 'ID Movimiento',
  dt_fecha: 'Fecha de Operación',
  total: 'Total',
  rfc: 'RFC del Cliente',
  nombre: 'Nombre del Cliente',
  acciones : 'Editar'
};

dataSource = new MatTableDataSource<SalidaConCliente>();

filtroForm: FormGroup;

constructor(
   private fb: FormBuilder,
   public dialog: MatDialog,          
   public api : ApiService,) {
    this.filtroForm = this.fb.group({
      rfc: [''],
      nombre: ['']
    });
}

 async ngOnInit() {
    this.clientes = await this.api.getSalidasConClientes();
    this.dataSource = new MatTableDataSource(this.clientes);
    // console.log(Object.entries(this.clientes));
 }

 buscarCliente() {
  const { rfc, nombre } = this.filtroForm.value;

  this.dataSource.filterPredicate = (data: SalidaConCliente, filter: string) => {
    const { rfcFilter, nombreFilter } = JSON.parse(filter);
    return (!rfcFilter || data.rfc?.toLowerCase().includes(rfcFilter.toLowerCase())) &&
           (!nombreFilter || data.nombre?.toLowerCase().includes(nombreFilter.toLowerCase()));
  };

  this.dataSource.filter = JSON.stringify({
    rfcFilter: rfc,
    nombreFilter: nombre
  });
}

agregarNotaVenta() {
  const dialogRef = this.dialog.open(ChangenotaComponent, {
     width: '150vh',
       //height: '76vh',
     disableClose: false,
     data: {
      modo : 'agregar',
     }
    }); 
}
//  displayedColumns: string[] = [
//   'id', 'cliente', 'productos', 'cantidad', 'precioUnitario', 'estado', 'acciones'
// ];

// columnAlias: { [key: string]: string } = {
//   id: 'ID',
//   cliente: 'Nombre del cliente',
//   productos: 'Producto',
//   cantidad: 'Cantidad',
//   precioUnitario: 'Precio Unitario',
//   estado: 'Estado',
//   acciones: 'Acciones'
// };

  // dataSource = new MatTableDataSource<Cotizacion>([
  //    {
  //     id: 1,
  //     cliente: 'Juan Pérez',
  //     productos: 'Impresora',
  //     fecha: '20/10/2010',
  //     rfc:'ROQA951221KI',
  //     cantidad: 2,
  //     precioUnitario: 1500,
  //     descuento: 10,
  //     condicionesPago: 'Contado',
  //     validezOferta: '7 días',
  //     estado: 'pendiente',
  //   },
  // ]);
  modalidadRoute = 0;

  editarCotizacion(id: number, indice:number) {
 
   const elemento = this.dataSource.data.find((el, i) =>  el.id === id);
    
    const dialogRef = this.dialog.open(ChangenotaComponent, {
     width: '150vh',
       //height: '76vh',
     disableClose: false,
     data: {
      modo : 'editar',
      nota: elemento
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

