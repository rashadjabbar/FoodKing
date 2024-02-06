import { Component, Inject, OnInit } from '@angular/core';
import { ClientOrderComponent } from '../client-order.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalService } from 'src/services/global.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasketService } from 'src/services/public/basket.service';
import { ComboboxModel } from 'src/models/select-model';
import { ProductService } from 'src/services/product.service';
import { showConfirmAlert, showErrorAlert, showInfoAlert } from 'src/utils/alert';
import { SaveOrder } from 'src/models/save-order';

@Component({
  selector: 'app-edit-client-order',
  templateUrl: './edit-client-order.component.html',
  styleUrls: ['./edit-client-order.component.scss']
})
export class EditClientOrderComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ClientOrderComponent>,
    private globalService: GlobalService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private basketService: BasketService,
    private productService: ProductService,

  ) { }

  products!: ComboboxModel[]
  orders: any[] = []

  price?: number;
  amount?: number;
  activeRow: any = -1;
  selectedId: any = 0;
  deletedIds: number[] = [];


  orderForm = this.fb.group({
    id: [this.data, Validators.required],
    no: ['', Validators.required],
    serviceFee: [0, Validators.required],
    amount: [0, Validators.required],
    orderItems: ['', Validators.required],
    note: [''],
    deletedItems: [''],
  })

  productItemForm = this.fb.group({
    id: [0],
    productId: [null, Validators.required],
    productName: ['', Validators.required],
    count: [1, [Validators.required, Validators.pattern(/^-?[0-9][^\.]*$/), Validators.min(1), Validators.max(20)]],
    price: [null],
    amount: [null],
  })

  ngOnInit() {
    this.getOrderById(this.data)
  }

  get OF(): { [key: string]: AbstractControl } {
    return this.orderForm.controls;
  }

  get cf(): { [key: string]: AbstractControl } {
    return this.productItemForm.controls;
  }

  getOrderById(id: number) {
    this.basketService.getOrderById(id).subscribe(res => {
      this.orders = res.data.orderItems
      this.orderForm.patchValue(res.data)
      let sum: number = res.data.orderItems.map(a => a.amount).reduce(function (a, b) {
        return a + b;
      });

      this.basketService.getServiceFeeByAmount({ amount: sum }).subscribe(res => {
        this.OF['serviceFee'].patchValue(res.data)
      })
    })
  }

  getProducts(event: any) {
    this.cf['productId'].patchValue(null)
    this.globalService.getProductsAutoComplate(event.target.value).subscribe((res: any) => {


      this.products = res.data

    })
  }

  getSelectedProduct(product: ComboboxModel) {
    this.cf['productId'].patchValue(product.key)
    this.cf['productName'].patchValue(product.value)

    this.productService.getProductById(product.key).subscribe(res => {
      this.price = res?.data[0]?.price
    })
  }

  getItemRow(row: any, index: number) {
    this.productItemForm.patchValue(row)
    this.price = row.price
    this.activeRow = index
  }

  submitLine() {
    if (this.productItemForm.valid) {
      this.cf['amount'].patchValue(this.price! * this.cf['count'].value);
      this.cf['price'].patchValue(this.price!);

      this.saveLine()
    }
  }

  saveLine() {
    if (this.activeRow == -1) { // add line
      this.orders.push(this.productItemForm.value);
    }
    else { //edit line
      this.orders[this.activeRow] = this.productItemForm.value;
      this.orders[this.activeRow].amount = this.price! * this.cf['count'].value;
    }

    this.calculateAmountAndServiceFee();

    this.orders = [...this.orders]
    this.activeRow = -1;
    this.products = []
    this.price = null!
    this.productItemForm.reset()
    this.cf['id'].setValue(0);
  }


  calculateAmountAndServiceFee() {
    let sum: number = this.orders.map(a => a.amount).reduce(function (a, b) {
      return a + b;
    });

    this.OF['amount'].patchValue(sum)

    let amount = {
      amount: sum
    }

    this.basketService.getServiceFeeByAmount(amount).subscribe(res => {
      this.OF['serviceFee'].patchValue(res.data)
    })
  }

  deleteLine(index: number, id: number) {
    if (id !== 0) {
      this.deletedIds?.push(id);
    }
    showConfirmAlert('', "Seçilmiş sətri silmək istədiyinizdən əminsinizmi?", undefined, undefined).then(res => {
      if (res.isConfirmed) {
        this.calculateAmountAndServiceFee();

        this.orders.splice(index, 1);
        this.orders = [...this.orders]
      }
    })

  }

  saveClientOrder() {
    this.OF['deletedItems'].patchValue(this.deletedIds);
    this.OF['orderItems'].patchValue(this.orders)

    // let sum: number = this.orders.map(a => a.amount).reduce(function (a, b) {
    //   return a + b;
    // });

    // this.OF['amount'].patchValue(sum)

    // let amount = {
    //   amount: sum
    // }

    // this.basketService.getServiceFeeByAmount(amount).subscribe(res => {
    //   this.OF['serviceFee'].patchValue(res.data)
    // })

    this.basketService.SaveOrder(this.orderForm.value as SaveOrder).subscribe(res => {
      if (!res?.status) {
        showErrorAlert('', res?.message, false, false, '', '', 1500);
      }
      else {
        showInfoAlert('', res?.message, false, false, '', '', 2000);
        this.dialogRef.close()
      }
    })
  }

}
