import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ChangemovimientosComponent } from './changemovimientos/changemovimientos.component';
import { Cotizacion } from '../modelos/cotizacion.model';
import { Component, OnInit , Inject , Optional , Directive, HostListener} from '@angular/core';
import { FormBuilder, FormControl , FormGroup, Validators ,ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ApiService } from 'src/app/utils/api.service';
@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.css']
})

export class MovimientosComponent implements OnInit {
filtroForm!: FormGroup;
dataSourceOriginal!: Cotizacion[];
 constructor(public dialog: MatDialog , public fb :FormBuilder , public api : ApiService){



 } 
//  ngOnInit() {
 

// }


async ngOnInit() {

  
  this.filtroForm = this.fb.group({
    cliente: [''],
    codigo: [''],
    rfc: [''],
    fechaInicio: [null],
    fechaFin: [null]
  });
  const { data, error } = await this.api.client
    .from('cat_prod_services')
    .select('*');

  console.log(data, error);
}

 

 displayedColumns: string[] = [
  'id', 'cliente', 'productos', 'cantidad', 'precioUnitario', 'estado', 'acciones'
];

columnAlias: { [key: string]: string } = {
  id: 'ID',
  cliente: 'Nombre del cliente',
  productos: 'Producto',
  cantidad: 'Cantidad',
  precioUnitario: 'Precio Unitario',
  estado: 'Estado',
  acciones: 'Acciones'
};

  dataSource = new MatTableDataSource<Cotizacion>([
    {
      id: 1,
      cliente: 'Juan Pérez',
      productos: 'Impresora',
      fecha: '20/10/2010',
      rfc:'ROQA951221KI',
      cantidad: 2,
      precioUnitario: 1500,
      descuento: 10,
      condicionesPago: 'Contado',
      validezOferta: '7 días',
      estado: 'pendiente',
    },
  ]);
  modalidadRoute = 0;
buscar() {
  const filtros = this.filtroForm.value;
  console.log('Filtros aplicados:', filtros);

  // Aquí puedes hacer tu consulta al backend o filtrar el `dataSource`
  this.dataSource.data = this.filtrarCotizaciones(filtros);
}

filtrarCotizaciones(filtros: any): Cotizacion[] {
  // Simulando un filtro local (puedes usar API)
    return this.dataSourceOriginal.filter(cotizacion => {
      const coincideCliente = filtros.cliente ? cotizacion.cliente.toLowerCase().includes(filtros.cliente.toLowerCase()) : true;
      // const coincideCodigo = filtros.codigo ? cotizacion.id?.toLowerCase().includes(filtros.codigo.toLowerCase()) : true;
      const coincideRfc = filtros.rfc ? cotizacion.rfc?.toLowerCase().includes(filtros.rfc.toLowerCase()) : true;

      const fechaCotizacion = new Date(cotizacion.fecha);
      const desde = filtros.fechaInicio ? new Date(filtros.fechaInicio) : null;
      const hasta = filtros.fechaFin ? new Date(filtros.fechaFin) : null;

      const coincideFecha = (!desde || fechaCotizacion >= desde) &&
                            (!hasta || fechaCotizacion <= hasta);

      // return coincideCliente && coincideCodigo && coincideRfc && coincideFecha;
      return coincideCliente && coincideRfc && coincideFecha;
    });
  }
  editarCotizacion(id: number, indice:number) {
 
   const elemento = this.dataSource.data.find((el, i) =>  el.id === id);
   console.log(elemento);
    
    const dialogRef = this.dialog.open(ChangemovimientosComponent, {
     width: '100vh',
       //height: '76vh',
     disableClose: true,
     data: elemento
    }); 
  }

  eliminarCotizacion(cotizacion: any) {
    if (confirm('¿Deseas eliminar esta cotización?')) {
      console.log('Eliminar:', cotizacion);
    }
  }

  generarReporte(cotizacion: any) {
    console.log('Generar reporte para:', cotizacion);
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

