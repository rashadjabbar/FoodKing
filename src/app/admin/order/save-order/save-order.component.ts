import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComboBox } from 'src/models/category';
import { BasketService } from 'src/services/public/basket.service';
import { GlobalService } from 'src/services/global.service';
import { ChangeOrdersStatusModel } from 'src/models/ChangeOrdersStatusModel';
import { showErrorAlert, showInfoAlert } from 'src/utils/alert';

@Component({
  selector: 'app-save-order',
  templateUrl: './save-order.component.html',
  styleUrls: ['./save-order.component.scss']
})
export class SaveOrderComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SaveOrderComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private basketService: BasketService,
    private globalService: GlobalService
  ) { }

  allStatus?: ComboBox[]

  statusForm = this.formBuilder.group({
    //id: [0, Validators.required],
    statusId: ['' , Validators.required],
    ids: [this.data],
  })

  ngOnInit() {
    this.getStatus()
  }

  getStatus(){
    this.globalService.getAllStatus().subscribe(res => {
      this.allStatus = res.data
    })
  }

  statusSubmit() {
    if (this.statusForm.invalid) {
      return;
    }

    this.basketService.ChangeOrdersStatus(this.statusForm.value as ChangeOrdersStatusModel).subscribe(res => {
      if(!res?.status){
        showErrorAlert('', res?.message, false, false, '','', 1500);
      }
      else{
        showInfoAlert('', res?.message, false, false, '','', 2000);
        this.dialogRef.close()
      }
      
      this.statusForm.reset()
    })
  }

}
