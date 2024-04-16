import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ClientOrder, OrderItem } from 'src/models/client-order';
import { BasketService } from 'src/services/public/basket.service';
import Swal from 'sweetalert2';
import { EditClientOrderComponent } from './edit-client-order/edit-client-order.component';
import { ChangeOrdersStatusModel } from 'src/models/ChangeOrdersStatusModel';
import { showConfirmAlert, showErrorAlert, showInfoAlert } from 'src/utils/alert';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { FormControl, FormGroup } from '@angular/forms';
const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
@Component({
  selector: 'app-client-order',
  templateUrl: './client-order.component.html',
  styleUrls: ['./client-order.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ClientOrderComponent implements OnInit {
  beginDate: any = new Date();
  endDate: any = new Date()
  statusModel?: { statusId: string; ids: number[]; };
  constructor(
    private datePipe: DatePipe,
    private basketService: BasketService,
    private router: Router,
    private dialog: MatDialog,


  ) {
  }

  orderData: ClientOrder[] = []
  orderItem: OrderItem[] = []

  totalAmount!: number;

  allTotalAmount!: number

  requestData: any = {
    nextPageNumber: 1,
    visibleItemCount: 5,
  }

  range = new FormGroup({
    start: new FormControl<string>(this.datePipe.transform(this.beginDate.setMonth(this.beginDate.getMonth() - 1), 'yyyy-MM-dd')!), //this.beginDate.setMonth(this.beginDate.getMonth() - 1
    end: new FormControl<string>(this.datePipe.transform(this.endDate, 'yyyy-MM-dd')!),
  });

  panelOpenState = true;
  ngOnInit() {
    this.getOrdersClient()
    const width = window.innerWidth || document.documentElement.clientWidth ||
      document.body.clientWidth;
  }

  getOrdersClient() {
    this.basketService.getOrdersClient(this.requestData,  this.range.controls.start.value!,  this.range.controls.end.value!).subscribe({
      next: res => {
        this.orderData = res.data.orders
        this.orderItem = res.data.orders.items
        this.allTotalAmount = res.data.totalAmount
      },
      error: res => {
        if (res.status == 401) {
          Swal.fire({
            icon: 'error',
            title: 'İcazəsiz giriş...',
            text: 'Login sehifesinden daxil olun!',
          })
          this.router.navigate(['/user-login']);
        }
      }
    })

  }

  openDialog(id: number) {
    const dialogRef = this.dialog.open(EditClientOrderComponent, {
      data: id,
      height: 'max-content',
      width: '55%',
      hasBackdrop: true,
      disableClose: true,
    })

    dialogRef.afterClosed().subscribe(result => {
      this.getOrdersClient();
    });
  }

  cancelOrder(id: number) {
    this.statusModel = { statusId: '6', ids: [id] }

    showConfirmAlert('', "Sifarişi ləğv etmək istədiyinizdən əminsinizmi?", undefined, undefined).then(res => {
      if (res.isConfirmed) {
        this.basketService.ChangeOrdersStatus(this.statusModel as Partial<ChangeOrdersStatusModel>).subscribe(res => {
          if (!res?.status) {
            showErrorAlert('', res?.message, false, false, '', '', 1500);
          }
          else {
            showInfoAlert('', res?.message, false, false, '', '', 2000);
          }
          this.getOrdersClient()
        })
      } else if (res.isDenied) {
      }
    })

  }

  selectToday() {
    this.range.controls.end.patchValue(this.datePipe.transform(this.endDate, 'yyyy-MM-dd')!)
    this.range.controls.start.patchValue(this.datePipe.transform(this.endDate, 'yyyy-MM-dd')!)
    this.getOrdersClient()

  }

  search() {
    this.range.controls.end.patchValue(this.datePipe.transform(this.range.controls.end.value, 'yyyy-MM-dd')!)
    this.range.controls.start.patchValue(this.datePipe.transform(this.range.controls.start.value, 'yyyy-MM-dd')!)
    if (this.range.controls.end.value == null) {
      this.range.controls.end.patchValue(this.datePipe.transform(this.endDate, 'yyyy-MM-dd')!)
    }
    this.getOrdersClient()
  }


}
