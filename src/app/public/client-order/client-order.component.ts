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

@Component({
  selector: 'app-client-order',
  templateUrl: './client-order.component.html',
  styleUrls: ['./client-order.component.scss']
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
    this.endDate = this.datePipe.transform(this.endDate, 'yyyy-MM-dd');
    this.beginDate.setMonth(this.beginDate.getMonth() - 1)
    this.beginDate = this.datePipe.transform(this.beginDate, 'yyyy-MM-dd')
  }

  orderData: ClientOrder[] = []
  orderItem: OrderItem[] = []

  totalAmount!: number;

  requestData: any = {
    nextPageNumber: 1,
    visibleItemCount: 5,
  }

  panelOpenState = true;
  ngOnInit() {
    this.getOrdersClient()
    const width = window.innerWidth || document.documentElement.clientWidth ||
      document.body.clientWidth;
  }

  getOrdersClient() {
    this.basketService.getOrdersClient(this.requestData, this.beginDate!, this.endDate!).subscribe({
      next: res => {
        this.orderData = res.data
        this.orderItem = res.data.items
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

}
