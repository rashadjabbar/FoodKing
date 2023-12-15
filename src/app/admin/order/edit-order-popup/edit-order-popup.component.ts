import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { OrderItem, SaveOrder } from 'src/models/save-order';
import { ComboboxModel } from 'src/models/select-model';
import { GlobalService } from 'src/services/global.service';
import { ProductService } from 'src/services/product.service';
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
    private productService: ProductService,
    private globalService: GlobalService
  ) { }

  orderForm = this.formBuilder.group({
    id: [this.data, Validators.required],
    no: ['', Validators.required],
    serviceFee: [0, Validators.required],
    amount: [0, Validators.required],
    orderItems: ['', Validators.required],
    deletedItems: [''],
  })

  productItemForm = this.formBuilder.group({
    id: [0],
    productId: [0],
    productName: ['', Validators.required],
    count: [null, Validators.required],
    price: [null],
    amount: [null, Validators.required],
  })

  products!: any[]  //[{key:1, value:'abc'}]

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

  productItems: MatTableDataSource<OrderItem> = new MatTableDataSource<OrderItem>([]);
  activeRow: any = -1;
  selectedId: any = 0;
  deletedIds: number[] = [];


  get OF(): { [key: string]: AbstractControl } {
    return this.orderForm.controls;
  }

  get IF(): { [key: string]: AbstractControl } {
    return this.productItemForm.controls;
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

  getOrderById(id: number) {
    this.basketService.getOrderById(id).subscribe(res => {
      this.orderForm.patchValue(res.data)
      this.productItems.data = res.data.orderItems as OrderItem[];
    })
  }

  getProducts(event: any) {
    // if(event.target.value){
    this.globalService.getProductsAutoComplate(event.target.value).subscribe((res: any) => {
      this.products = res.data
    })
    // }
  }

  getSelectedProduct(product: ComboboxModel) {
    this.IF['productId'].patchValue(product.key)
    this.IF['productName'].patchValue(product.value)

    this.productService.getProductById(product.key).subscribe(res => {
      this.IF['price'].setValue(res?.data[0]?.price);
    })
  }

  save() {
    this.formSubmitted = true;

    if (!this.orderForm.valid) {
      return;
    }

    this.OF['deletedItems'].patchValue(this.deletedIds);
    this.OF['orderItems'].patchValue(this.productItems.data)

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

  totalAmount: number = 0


  submitLine() {
    this.lineSubmitted = true;
    this.IF['amount'].patchValue(this.IF['price'].value * this.IF['count'].value);

    if (this.productItemForm.invalid) {
      return;
    }

    this.totalAmount = 0
    this.saveLine();
    for(let i = 0; i < this.productItems.data.length; i++){

      console.log(this.productItems.data?.[i].amount)

       this.totalAmount += Number(this.productItems.data?.[i].amount!)
       // this.OF['amount'].value += this.sell[i]['quant']*this.sell[i]['price'];
       
      }
      this.OF['amount'].patchValue(this.totalAmount)
    console.log(this.totalAmount)

  }


  saveLine() {
    if (this.activeRow < 0) { // add line
      this.productItems.data.push(this.productItemForm.value as OrderItem);
    }
    else { //edit line
      this.productItems.data[this.activeRow] = this.productItemForm.value as OrderItem;
      this.productItems.data[this.activeRow].amount = this.IF['price'].value * this.IF['count'].value;
      //this.productItems.data[this.activeRow].name =
    }

    this.productItems.data = [...this.productItems.data]
    this.activeRow = -1;
    this.productItemForm.reset()
    this.IF['id'].setValue(0);
    //this.IF['name'].setValue(' ');
    this.lineSubmitted = false;
  }

  getLine(index: number) {
    this.productItemForm.patchValue(this.productItems.data[index] as any);
    this.products = []
  }

  deleteLine(index: number, id: number) {
    this.deletedIds?.push(id);
    this.productItems.data.splice(index, 1);
    this.productItems.data = [...this.productItems.data]
  }

}
