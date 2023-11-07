import { Component, Inject, OnInit } from '@angular/core';
import { PaymentComponent } from '../payment.component';
import { PaymentService } from 'src/services/payment.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddPayment } from 'src/models/payment';

@Component({
  selector: 'app-new-payment',
  templateUrl: './new-payment.component.html',
  styleUrls: ['./new-payment.component.scss']
})
export class NewPaymentComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PaymentComponent>,
    private formBuilder: FormBuilder,
    private paymentService: PaymentService,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) { }

  addPaymentData!: AddPayment[];

  paymentForm = this.formBuilder.group({
    id: [0, Validators.required],
    amount: ['', Validators.required],
  })

  ngOnInit() {
    this.getPaymentById()
  }

  getPaymentById(){
    if (this.data.id !== 0) {
    this.paymentService.getPaymentByid(this.data.id).subscribe({
      next: res => {
        console.log(res.data)
        this.paymentForm.patchValue(res.data[0])
      }
    })
  }
}

productFunc() {
  if (this.paymentForm.invalid) {
    return;
  }

  this.paymentService.savePayment(this.paymentForm.value).subscribe(res => {
    this.dialogRef.close()
  })
}

}
