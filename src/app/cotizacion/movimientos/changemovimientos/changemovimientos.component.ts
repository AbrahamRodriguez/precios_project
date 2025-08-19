
import { Component, OnInit , Inject , Optional , Directive, HostListener} from '@angular/core';
import { FormBuilder, FormControl , FormGroup, Validators ,ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-changemovimientos',
  templateUrl: './changemovimientos.component.html',
  styleUrls: ['./changemovimientos.component.css']
})
export class ChangemovimientosComponent implements OnInit {
      
    cotizacionForm!: FormGroup;

   constructor(
      private fb: FormBuilder,
      @Optional() private dialogRef: MatDialogRef<ChangemovimientosComponent>,
      public snackBar: MatSnackBar,
      public dialog: MatDialog,
      @Inject(MAT_DIALOG_DATA) public data: any   
      
      ) 
      {

        
      }
    guardar(): void {
        if (this.cotizacionForm.valid) {
          const datos = this.cotizacionForm.getRawValue(); // incluye campos disabled
          console.log('Cotización guardada:', datos);
        }
      }

       close(): void {
    this.dialogRef?.close();
  }

  accionEditar(): void {
    if (this.cotizacionForm.valid) {
      const formValue = this.cotizacionForm.getRawValue(); // si hay campos deshabilitados
      this.dialogRef?.close(formValue); // podrías devolver datos al componente padre
    } else {
      this.snackBar.open('Formulario inválido', 'Cerrar', { duration: 3000 });
    }
  }

    ngOnInit(): void {
      console.log(this.data);
        this.cotizacionForm = this.fb.group({
          id: [{ value: this.data?.id || 0, disabled: true }],
          cliente: [this.data?.cliente || '', Validators.required],
          descripcion: [this.data?.descripcion || '', Validators.required],
          fecha: [this.data?.fecha || '', Validators.required],
          total: [this.data?.total || 0, [Validators.required, Validators.min(0)]],
          estado: [this.data?.estado || '', Validators.required]
        });
    }


}
