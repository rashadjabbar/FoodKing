import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Payment } from 'src/models/payment';
import { StatusRequest } from 'src/models/status';
import { PaymentService } from 'src/services/payment.service';
import Swal from 'sweetalert2';
import { NewPaymentComponent } from './new-payment/new-payment.component';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  beginDate: any = new Date();
  endDate: any = new Date()
  constructor(
    private paymentService: PaymentService,
    private dialog: MatDialog,
    private router: Router,
    private datePipe: DatePipe
  ) { 
    this.endDate = this.datePipe.transform(this.endDate, 'yyyy-MM-dd');
    this.beginDate.setMonth(this.beginDate.getMonth() - 1)
    this.beginDate = this.datePipe.transform(this.beginDate, 'yyyy-MM-dd')
  }


  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  activeRow: any = -1;
  selectedId: any = 0;
  length!: number;
  paymentData: Payment[] = []

  dataSource = new MatTableDataSource<Payment>(this.paymentData);
  pageSize!: number;
  pageSizeOptions: number[] = [5, 10, 25];
  pageEvent!: PageEvent;

  requestData: any = {
    nextPageNumber: 1,
    visibleItemCount: 5,
  }

  displayedColumns: string[] = [
    'id',
    'name',
    'no',
    'amount',
    'createdDate'
  ];

  
  isActive = (index: number) => { return this.activeRow === index };

  ngOnInit() {
    this.getPayment()
  }

  getPayment() {
    this.paymentService.getpayment(this.requestData, this.beginDate!, this.endDate!).subscribe({
      next: res => {
        this.dataSource = new MatTableDataSource<Payment>(res.data.result);

        this.length = res.data.count

      },
      error: res => {
        if (res.status == 401) {
          Swal.fire({
            icon: 'error',
            title: 'İcazəsiz giriş...',
            text: 'Login sehifesinden daxil olun!',
          })
          this.router.navigate(['/login-adminpanel']);
        }
      }
    })
  }



  onChangePage(pe: PageEvent) {
    this.requestData.nextPageNumber = pe.pageIndex + 1
    this.requestData.visibleItemCount = pe.pageSize
    this.getPayment()
  }

  highlight(index: number, id: number): void {
    if (!this.isActive(index)) {
      this.activeRow = index;
      this.selectedId = id;
    }
    else {
      this.activeRow = -1;
      this.selectedId = 0;
    }
  }

  openDialog(type: number) {
    let id = 0

    if (type !== 1) {
      id = this.selectedId;
    } else id = 0

      const dialogRef = this.dialog.open(NewPaymentComponent, {
        data: { id: id, typeView: type },
        height: 'max-content',
        width: '30%',
        hasBackdrop: true,
        disableClose: true
      })
      dialogRef.afterClosed().subscribe(result => {
        this.activeRow = -1;
        this.selectedId = 0;
        this.getPayment();
      });
  }


  handleKeyUp(e: any) {
    let filterValue = e.target.value
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
