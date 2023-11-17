import { Component, Inject, OnInit } from '@angular/core';
import { OrderComponent } from '../order.component';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComboBox } from 'src/models/category';
import { BasketService } from 'src/services/public/basket.service';
import { GlobalService } from 'src/services/global.service';

@Component({
  selector: 'app-save-order',
  templateUrl: './save-order.component.html',
  styleUrls: ['./save-order.component.scss']
})
export class SaveOrderComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<OrderComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private basketService: BasketService,
    private globalService: GlobalService
  ) { }

  allStatus?: ComboBox[]

  statusForm = this.formBuilder.group({
    id: [0, Validators.required],
    statusId: ['' , Validators.required],
    orderIds: [this.data],
  })

  ngOnInit() {
    this.getStatus()
  }

  getStatus(){
    this.globalService.getAllStatus().subscribe(res => {
      console.log(res)
      this.allStatus = res.data
    })
  }

  statusSubmit() {
    console.log(this.statusForm.value)

    if (this.statusForm.invalid) {
      return;
    }


    // this.basketService.SaveOrder().subscribe(res => {
    //   this.dialogRef.close()
    // })
  }

}
