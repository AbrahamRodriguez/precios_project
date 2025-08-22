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
import { from } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { salidas_inventario } from 'src/app/utils/salidas_inventario.model';
@Component({
  selector: 'app-changellamada',
  templateUrl: './changellamada.component.html',
  styleUrls: ['./changellamada.component.css']
})
export class ChangellamadaComponent implements OnInit {
  constructor(
          private fb: FormBuilder,
          @Optional() private dialogRef: MatDialogRef<ChangellamadaComponent>,
          public snackBar: MatSnackBar,
          public dialog: MatDialog, 
          public api : ApiService,
          @Inject(MAT_DIALOG_DATA) public data: any  
       
  ){

  }
   async ngOnInit() {

    this.abonoForm = this.fb.group({
      cliente: ['', Validators.required],
      nota: ['', Validators.required],
      monto: [0, [Validators.required, Validators.min(1)]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      fecha_contacto: ['', Validators.required]
    });



    // Evento de búsqueda de cliente

   
    this.abonoForm.get('cliente')?.valueChanges.subscribe((term: string) => {
      this.filtrarClientes(term);
    });


    if (this.data?.modo === 'editar' && this.data?.llamada) {
      this.tipo = "Modificar Nota de Venta";
      
      this.abonoForm = this.fb.group({
        cliente: [this.data?.llamada.nombre_cliente , Validators.required],
        nota: [this.data?.llamada.id_salida, Validators.required],
        monto: [this.data?.llamada.monto_llamada, [Validators.required, Validators.min(1)]],
        telefono: [this.data?.llamada.telefono_llamada, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        fecha_contacto: [this.data?.llamada.dt_fecha_localizacion.toISOString(), Validators.required]
      });
      await this.api.buscarClientes(this.data?.llamada.nombre_cliente).then(lstClientes => {
        this.clientesFiltrados = lstClientes
      });
      this.seleccionarCliente(this.clientesFiltrados[0]);

      await this.api.getSalidaInventarioContacto(this.data?.llamada.id_contacto).then(lstNotas => {
        this.notas = lstNotas;
      });
      this.seleccionarNota(this.data?.llamada.id_salida);
    }
  }
  async filtrarClientes(term: string): Promise<void> {
    // const valor = term?.trim() ?? '';
    const valor = typeof term === 'string' ? term.trim() : '';
  
    if (valor.length >= 2) {
      this.clientesFiltrados = await this.api.buscarClientes(valor);
    } else {
      this.clientesFiltrados = [];
    }
  }
  displayCliente(cliente: any): string {
  return cliente ? `${cliente.nombre} - ${cliente.rfc}` : '';
  }

  async onClienteInput(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement;
  const term = input?.value?.trim() ?? '';
  // console.log(term)
    if (term.length >= 2) {
      this.clientesFiltrados = await this.api.buscarClientes(term);
    } else {
      this.clientesFiltrados = [];
    }
  }
 
  // async onClienteInput(valor: string): Promise<void> {
  //   if (valor.length >= 2) {
  //     this.clientesFiltrados = await this.api.buscarClientes(valor);
  //   } else {
  //     this.clientesFiltrados = [];
  //   }
  // }

  seleccionarCliente(cliente: any): void {
  if (!cliente) return;

  // console.log('Cliente seleccionado:', cliente);
  this.clienteSeleccionado = cliente;

  // Mostrar en el input
  this.clienteControl.setValue(`${cliente.nombre} - ${cliente.rfc}`, { emitEvent: false });

  // Parchear en el formulario
  this.abonoForm.patchValue({ cliente: cliente.nombre });

  // Traer las notas relacionadas
  this.api.getSalidaInventarioContacto(cliente.int_id_tipo_contacto).then(lstNotas => {
    this.notas = lstNotas;
  });

  // console.log(Object.entries(this.notas))
}

 close(): void {
    this.dialogRef?.close();
  }
  // async seleccionarCliente(cliente: any | null) {
  //   // console.log("Cliente Numero _ " , clienteId)
  //   //  if (clienteId == null) return;

  //   // // 🔎 Buscar cliente en el arreglo global
  //   // const cliente = this.clientesFiltrados.find(c => c.int_id_tipo_contacto === clienteId);
  //   // if (!cliente) return;
  //   if (!cliente) return;

  //   console.log('Cliente seleccionado:', cliente);
  //   this.clienteSeleccionado = cliente;

  //   // Mostrar en el input
  //   this.clienteControl.setValue(`${cliente.nombre} - ${cliente.rfc}`, { emitEvent: false });

  //   console.log('Cliente seleccionado:', cliente);
  //   this.clienteSeleccionado = cliente;

  //   // // Opcional: para reflejar nombre completo en el input
  //   // this.clienteControl.setValue(`${cliente.nombre} - ${cliente.rfc}`, { emitEvent: false });

  //   // Parchear en el formulario
  //     this.abonoForm.patchValue({ cliente: cliente.nombre });

  //     // Traer las notas relacionadas
  //     this.api.getSalidaInventarioContacto(cliente.int_id_tipo_contacto).then(lstNotas => {
  //       this.notas = lstNotas;
  //     });
  //   // this.abonoForm.patchValue({ cliente: cliente.nombre });
  //   // const lstNotas = await this.api.getSalidaInventarioContacto(cliente.int_id_tipo_contacto);
  //   // this.notas = lstNotas;
  // }

  seleccionarNota(notaId: number | null) {
  if (notaId == null) return;

  // 🔎 Buscar nota en el arreglo global
  const nota = this.notas.find(n => n.id_salida === notaId);
  if (!nota) return;

  console.log('Nota seleccionada:', nota);
  this.notaSeleccionada = nota;
  this.saldoPendiente = nota.total;

    const montoCtrl = this.abonoForm.get('monto');
    if (montoCtrl) {
      montoCtrl.setValidators([
        Validators.required,
        Validators.min(1),
        // abonoNoMayorQueSaldo(this.saldoPendiente)
      ]);
      montoCtrl.updateValueAndValidity();
    }
    this.abonoForm.patchValue({ nota: nota.id_salida });
  }


  async guardarAbono() {
    if (this.abonoForm.invalid) {
      this.abonoForm.markAllAsTouched();
      return;
    }

    const abono = {
      int_id_nota: this.abonoForm.value.nota,
      pago_realizado: this.abonoForm.value.monto,
      numero_localizacion: this.abonoForm.value.telefono,
      dt_fecha_localizacion: this.abonoForm.value.fecha_contacto,
      estatus: false
    };


    if (this.data?.modo === 'editar' && this.data?.llamada) {
      await this.api.modificarAbono(abono , this.data?.llamada.id);
    }else{
      await this.api.registrarAbono(abono);
    }
    this.abonoForm.reset();
  }

  notasCliente: any[] = [];
  notaSeleccionada: any = null;
  abono: number = 0;
  telefono: string = '';

  abonoForm!: FormGroup;
  notas: salidas_inventario[] = [];
  saldoPendiente = 0;

  
  form!: FormGroup;
  productos : cat_prod_services [] = [];
  clientes : any [] = [];
  dtSource = new MatTableDataSource<AbstractControl>();
  clienteControl = new FormControl('');
  partidasMovimiento: any[] = [];
  clientesFiltrados: any[] = [];
  // clienteSeleccionado: CatalogoContactos = new CatalogoContactos({
  //     intIdTipoContacto:  '',
  //     tipo:  '',
  //     nombre:  '',
  //     productos:  '',
  //     colonia:  '',
  //     cp:  '',
  //     ciudad:  '',
  //     estado:  '',
  //     pais:  '',
  //     rfc: '',
  // });

  clienteSeleccionado: any = null;
  tipo: 'Modificar Nota de Venta' | 'Agregar Nota de Venta' = "Agregar Nota de Venta";
 
  selectedProduct: any = null;
}
