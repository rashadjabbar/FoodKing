import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SaveOrder } from 'src/models/save-order';
import { GlobalService } from 'src/services/global.service';
import { BasketService } from 'src/services/public/basket.service';
import { showErrorAlert, showInfoAlert } from 'src/utils/alert';

@Component({
  selector: 'app-edit-order-popup',
  templateUrl: './edit-order-popup.component.html',
  styleUrls: ['./edit-order-popup.component.scss']
})
export class EditOrderPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<EditOrderPopupComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private basketService: BasketService,
    private globalService: GlobalService
  ) { }
  
  formSubmitted: boolean = false

  orderForm = this.formBuilder.group({
    //id: [0, Validators.required],
    statusId: ['' , Validators.required],
    id: [this.data],
  })

  get OF(): { [key: string]: AbstractControl } {
    return this.orderForm.controls;
  }

  
  ngOnInit() {
    this.getOrderById(this.OF['id'].value)
  }

  getOrderById(id: number){
    this.basketService.getOrderById(id).subscribe(res => {
      console.log(res.data)
    this.orderForm.patchValue(res.data)
    })
  }


  save() {
    this.formSubmitted = true;

    if (!this.orderForm.valid) {
      return;
    }

    this.basketService.SaveOrder(this.orderForm.value as SaveOrder).subscribe(res => {
      console.log(res)

      if(!res?.status){
        showErrorAlert('', res?.message, false, false, '','', 1500);
      }
      else{
        showInfoAlert('', res?.message, false, false, '','', 2000);
        this.dialogRef.close()
      }
    })
  }
}
