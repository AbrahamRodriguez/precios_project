import { Component, OnInit , Inject , Optional , Directive, HostListener} from '@angular/core';
import { FormBuilder, FormControl , FormGroup, Validators ,ControlValueAccessor, NG_VALUE_ACCESSOR, FormArray, AbstractControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/utils/api.service';
import { cat_prod_services } from 'src/app/utils/CatProdServices.model';
import { MatTableDataSource } from '@angular/material/table'; 
import { CatalogoContactos } from 'src/app/utils/CatalogoContacto.model';
import { DetCotizaciones } from 'src/app/utils/DetCotizaciones.model';

@Component({
  selector: 'app-changenota',
  templateUrl: './changenota.component.html',
  styleUrls: ['./changenota.component.css']
})

export class ChangenotaComponent implements OnInit {
  form!: FormGroup;
  productos : cat_prod_services [] = [];
  clientes : any [] = [];
  dtSource = new MatTableDataSource<AbstractControl>();
  clienteControl = new FormControl('');
  partidasMovimiento: any[] = [];
  clientesFiltrados: any[] = [];
  clienteSeleccionado: any = null;
  tipo: 'Modificar Nota de Venta' | 'Agregar Nota de Venta' = "Agregar Nota de Venta";
  // = [
  //   { id: 1, nombre: 'Producto A', precio: 100 },
  //   { id: 2, nombre: 'Producto B', precio: 150 },
  //   { id: 3, nombre: 'Producto C', precio: 200 }
  // ];
  selectedProduct: any = null;

  // constructor(private fb: FormBuilder) {}

 constructor(private fb: FormBuilder,
          @Optional() private dialogRef: MatDialogRef<ChangenotaComponent>,
          public snackBar: MatSnackBar,
          public dialog: MatDialog, 
          public api : ApiService,
          @Inject(MAT_DIALOG_DATA) public data: any  
        ){  }

  async ngOnInit() {

    this.form = this.fb.group({
        cliente: ['', Validators.required],
        rfc: ['', Validators.required],
        productoSeleccionado: [''],
        cantidadSeleccionada: [1, [Validators.required, Validators.min(1)]],
        items: this.fb.array([])
      });


    await this.api.functionAgruparProductos().then(producto =>{
         this.productos = producto;
    });

    // console.log(Object.entries(this.data.nota))

    if (this.data?.modo === 'editar' && this.data?.nota) {
      this.tipo = "Modificar Nota de Venta";
      this.precargarNota(this.data.nota);
    }
    //  this.clientes = await this.api.getSalidasConClientes();
    this.dtSource.data = this.items.controls; 
  }


  async precargarNota(nota: any):  Promise<void> {
  
  const clientepBusqueda = await this.api.buscarClientes(nota.rfc);
  this.seleccionarCliente(clientepBusqueda[0]);

  const detalles = await this.api.getDetallesSalidaInventario(nota.id);
  this.partidasMovimiento = detalles ;
    // 3 Enriquecer con nombre de producto
  this.items.clear(); // opcional, limpia el FormArray

  detalles.forEach(det => {
    const producto = this.productos.find(
      p => p.int_id_prod_service === det.int_id_prod_service
    );

    this.items.push(this.fb.group({
      productoId: [producto!.int_id_prod_service, Validators.required],
      IdMovimiento: [det.id , []],
      IdDescuento: [det.int_descuento , []],
      IdCotizacion: [det.int_id_cotizaciones , []],
      productoNombre: [producto!.vch_nombre_prod_service],
      precio: [producto!.mo_precio],
      cantidad: [det.fl_cantidad, [Validators.required, Validators.min(1)]]
    }));
  });

    

  this.dtSource.data = [...this.items.controls];
 
 }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }
  async onClienteInput(valor: string): Promise<void> {
    if (valor.length >= 2) {
      this.clientesFiltrados = await this.api.buscarClientes(valor);
    } else {
      this.clientesFiltrados = [];
    }
  }
  seleccionarCliente(cliente: any): void {
    this.clienteSeleccionado = cliente;

    this.form.patchValue({
      cliente: cliente.nombre,
      rfc: cliente.rfc
    });

    // Opcional: para reflejar nombre completo en el input
    this.clienteControl.setValue(`${cliente.nombre} - ${cliente.rfc}`, { emitEvent: false });
  }

  async cargarProductos(): Promise<void> {
  const { data, error } = await this.api.client
    .from('cat_prod_services')
    .select('*');
  console.log(data);

  if (error) {
    console.error('Error al cargar productos:', error.message);
    return;
  }

  this.productos = (data ?? []) as cat_prod_services[];
  console.log(data);

 }




  seleccionarProducto(productoId: number): void {
    const producto = this.productos.find(p => p.int_id_prod_service == productoId);
    this.selectedProduct = producto;
  }


 agregarFilaDesdeNota(productoId: number, nombre: string, precio: number, cantidad: number): void {
  this.items.push(
    this.fb.group({
      productoId: [productoId, Validators.required],
      //IdMovimiento: [0, []],
      // IdDescuento: [0, []],
      // Id: [0, []],
      productoNombre: [nombre],
      precio: [precio],
      cantidad: [cantidad, [Validators.required, Validators.min(1)]]
    })
  );

  this.dtSource.data = [...this.items.controls];
  }


  agregarFila(): void {
  const productoId = this.form.value.productoSeleccionado;
  const cantidad = this.form.value.cantidadSeleccionada;

  const producto = this.productos.find(p => p.int_id_prod_service == productoId);
  if (!producto || cantidad <= 0) return;
  // this.dtSource.data.push(producto);

  if (!producto) return;

  // 1️⃣ Buscar si ya existe en la tabla
  const existenteIndex = this.items.controls.findIndex(
    ctrl => ctrl.value.productoId === producto.int_id_prod_service
  );

  if (existenteIndex >= 0) {
    // 2️⃣ Si existe, actualizar cantidad
    const existente = this.items.at(existenteIndex);
    const nuevaCantidad = Number(existente.value.cantidad) + cantidad;
    existente.patchValue({ cantidad: nuevaCantidad });
  } else{
    // console.log("producto seleccionado : ", producto );
    this.items.push(
      this.fb.group({
        productoId: [producto.int_id_prod_service, Validators.required],
        // IdMovimiento: [0, []],
        productoNombre: [producto.vch_nombre_prod_service],
        precio: [producto.mo_precio],
        cantidad: [cantidad, [Validators.required, Validators.min(1)]]
      })
    );
  }
   

    this.dtSource.data = [...this.items.controls];
    // this.items.push(this.dtSource);

    // Limpiar selección
    this.form.patchValue({
      productoSeleccionado: '',
      cantidadSeleccionada: 1
    });
    this.selectedProduct = null;
  }

  eliminarFila(index: number): void {
    this.items.removeAt(index);
  }

  // submit(): void {
  //   if (this.form.valid) {
  //     console.log('Formulario completo:', this.form.value);
  //   }
  // }


async submit(): Promise<void> {
  if (!this.form.valid || !this.clienteSeleccionado) {
    this.snackBar.open('Formulario incompleto', 'Cerrar', { duration: 3000 });
    return;
  }
  console.log(Object.entries(this.clienteSeleccionado));
  try {
    const totalNota = this.items.controls.reduce((acc, ctrl) => {
      return acc + (ctrl.value.precio * ctrl.value.cantidad);
    }, 0);

    if (this.data?.modo === 'editar' && this.data?.nota) {
        const movimientoResult = await this.api.updateSalidaInventario(this.data.nota.id ,{
          id_contacto: this.clienteSeleccionado.int_id_tipo_contacto,
          motivo: 'SALIDA',
          fecha_salida: new Date(),
          total: totalNota,
        });


  // 1️⃣ Filtrar originales solo de la nota actual
  const originales: DetCotizaciones[] = this.partidasMovimiento
    .filter(o => Number(o.id_salida_inventario) === Number(this.data.nota.id));

  // 2️⃣ Construir arreglo de modificados desde el form
  const modificados: DetCotizaciones[] = this.items.controls.map(ctrl => ({
    id_salida_inventario: this.data.nota.id,
    int_id_cotizaciones: ctrl.value.IdCotizacion,
    int_descuento: ctrl.value.IdDescuento,
    id: ctrl.value.IdMovimiento, // importante si es el ID del detalle
    mo_subtotal: ctrl.value.cantidad * ctrl.value.precio,
    int_id_prod_service: Number(ctrl.value.productoId),
    fl_cantidad: Number(ctrl.value.cantidad),
    precio_unitario: Number(ctrl.value.precio)
  }));

  // 3️⃣ Mapear usando el mismo campo clave y mismo tipo
  const mapOriginal = new Map(originales.map(o => [Number(o.int_id_prod_service), o]));
  const mapModificado = new Map(modificados.map(m => [Number(m.int_id_prod_service), m]));

  // 4️⃣ Detectar nuevos
  const aInsertar = modificados.filter(m => !mapOriginal.has(m.int_id_prod_service));

  // 5️⃣ Detectar eliminados
  const aEliminar = originales.filter(o => !mapModificado.has(o.int_id_prod_service));

  // 6️⃣ Detectar cambios en cantidad o precio
  const aActualizar = modificados.filter(m => {
    const orig = mapOriginal.get(m.int_id_prod_service);
    return orig && (
      orig.fl_cantidad !== m.fl_cantidad ||
      orig.precio_unitario !== m.precio_unitario
    );
  });

  // 🔹 Eliminar solo lo que realmente se quitó
  for (const del of aEliminar) {
    await this.api.devolverInventario(del.int_id_prod_service, del.fl_cantidad);
    await this.api.eliminarDetalle(del.id);
  }

  // 🔹 Actualizar cambios
  for (const act of aActualizar) {
    const orig = mapOriginal.get(act.int_id_prod_service);
    if (!orig) continue;

    const diferencia = act.fl_cantidad - orig.fl_cantidad;
    if (diferencia > 0) {
      await this.api.reducirInventario(act.int_id_prod_service, diferencia);
    } else if (diferencia < 0) {
      await this.api.devolverInventario(act.int_id_prod_service, Math.abs(diferencia));
    }

    await this.api.modificarDetalle(act);
  }

  // 🔹 Insertar nuevos
  for (const ins of aInsertar) {
    await this.api.reducirInventario(ins.int_id_prod_service, ins.fl_cantidad);
    await this.api.insertarDetalleMovimientoUnico(ins);
  }
}
else{

        // 1 Insertar en movimientos
        const movimientoResult = await this.api.insertarMovimiento({
          id_contacto: this.clienteSeleccionado.int_id_tipo_contacto,
          motivo: 'SALIDA',
          fecha_salida: new Date().toISOString(),
          total: totalNota,
        });

        if (!movimientoResult || !movimientoResult.id_salida) {
          throw new Error('Error insertando movimiento');
        }

        const idMovimiento = movimientoResult.id_salida;
        // console.log("Hey, este es el id del movimiento" , idMovimiento);

        // 2 Insertar productos seleccionados en det_movimientos
        const detalles = this.items.controls.map(ctrl => ({
          id_salida_inventario: idMovimiento,
          // id: ctrl.value.IdMovimiento,
          int_id_prod_service: ctrl.value.productoId,
          fl_cantidad: ctrl.value.cantidad,
          precio_unitario: ctrl.value.precio
        }));

        const detallesResult = await this.api.insertarDetallesMovimiento(detalles);

        if (detallesResult.error) throw detallesResult.error;
        // 4 Actualizar existencias
        for (const d of detalles) {
          await this.api.descontarInventario(d.int_id_prod_service, d.fl_cantidad);
        }

    }

    this.snackBar.open('Nota de venta registrada correctamente', 'Cerrar', { duration: 3000 });
    this.dialogRef?.close();
  } catch (error) {
    console.error('Error al guardar salida:', error);
    this.snackBar.open('Error al guardar salida', 'Cerrar', { duration: 3000 });
  }
}


  guardar(): void {
        if (this.form.valid) {
          const datos = this.form.getRawValue(); // incluye campos disabled
          console.log('Cotización guardada:', datos);
        }
      }

  close(): void {
    this.dialogRef?.close();
  }

  accionEditar(): void {
    if (this.form.valid) {
      const formValue = this.form.getRawValue(); // si hay campos deshabilitados
      // console.log('Cotización guardada:', formValue);
      this.submit();

      // this.dialogRef?.close(formValue); // podrías devolver datos al componente padre
    } else {
      this.snackBar.open('Formulario inválido', 'Cerrar', { duration: 3000 });
    }
  }

}

