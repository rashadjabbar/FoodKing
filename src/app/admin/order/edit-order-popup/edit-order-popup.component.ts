import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
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
  
  orderForm = this.formBuilder.group({
    id: [this.data, Validators.required],
    no: ['' , Validators.required],
    serviceFee: [0, Validators.required],
    amount: [0, Validators.required],
    orderItems: ['' , Validators.required],
  })

  productItemForm = this.formBuilder.group({
    id: [this.data],
    productId: [0],
    name: ['' , Validators.required],
    count: [0, Validators.required],
    price: [0, Validators.required],
    amount: [0, Validators.required],
  })

  displayedColumns: string[] = [
    'Position',
    'Name',
    'Price',
    'Count',
    'Amount',
    'operation'
  ];

  lineSubmitted = false;
  formSubmitted: boolean = false

  productItems: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  activeRow: any = -1;
  selectedId: any = 0;
  deletedIds : number[] = [];

  get OF(): { [key: string]: AbstractControl } {
    return this.orderForm.controls;
  }

  get IF(): { [key: string]: AbstractControl } {
    return this.orderForm.controls;
  }
  
  ngOnInit() {
    this.getOrderById(this.OF['id'].value)
  }

  isActive = (index: number) => { return this.activeRow === index };

  highlight(index: number, id: number): void {
    if (!this.isActive(index)) {
      this.activeRow = index;
      this.selectedId = id;

      this.getLine(this.activeRow);
    }
    else {
      this.activeRow = -1;
      this.selectedId = 0;

      this.productItemForm.reset()
      this.IF['id'].setValue(0);
      //this.IF['name'].setValue(' ');
    }
  }

  getOrderById(id: number){
    this.basketService.getOrderById(id).subscribe(res => {
      console.log(res.data)
    this.orderForm.patchValue(res.data)
    this.productItems.data = res.data.orderItems;
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

  submitLine() {
    this.lineSubmitted = true;

   // this.IF['name'].setValue(this.IF['name'].value.trim())

    if (this.productItemForm.invalid) {
      return;
    }

    this.saveLine();
  }


  saveLine() {
    debugger
    if (this.activeRow < 0) { // add line
      this.productItems.data.push(this.productItemForm.value);
    }
    else { //edit line
      this.productItems.data[this.activeRow] = this.productItemForm.value;
    }
    
    this.productItems.data = [...this.productItems.data]
    this.activeRow = -1;
    this.productItemForm.reset()
    this.IF['id'].setValue(0);
    //this.IF['name'].setValue(' ');
    this.lineSubmitted = false;
  }

  getLine(index: number) {
    this.productItemForm.patchValue(this.productItems.data[index]);
}

  deleteLine(index: number, id: number) {
      this.deletedIds?.push(id);
      this.productItems.data.splice(index, 1);
      this.productItems.data = [...this.productItems.data]
  }

}
