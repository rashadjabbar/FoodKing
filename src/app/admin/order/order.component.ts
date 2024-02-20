import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BrowseOrder } from 'src/models/save-order';
import { OrderService } from 'src/services/order.service';
import Swal from 'sweetalert2';

import { SaveOrderComponent } from './save-order/save-order.component';
import { SelectionModel } from '@angular/cdk/collections';
import { EditOrderPopupComponent } from './edit-order-popup/edit-order-popup.component';
import { FormControl, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';

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
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class OrderComponent implements OnInit {
  beginDate: any = new Date();
  endDate: any = new Date()
  constructor(
    private orderService: OrderService,
    private dialog: MatDialog,
    private router: Router,
    private datePipe: DatePipe,
    private _liveAnnounce: LiveAnnouncer
  ) {
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  activeRow: any = -1;
  selectedId: any = 0;
  length!: number;
  orderData: BrowseOrder[] = []

  dataSource = new MatTableDataSource<BrowseOrder>(this.orderData);
  selection = new SelectionModel<BrowseOrder>(true, []);



  highlightedRows: any[] = [];
  highlightedRowss: any = {};
  selectedAllRow = false

  orderIds: any[] = [];

  requestData: any = {
    nextPageNumber: 1,
    visibleItemCount: 100,
  }

  pageSize: number = this.requestData.visibleItemCount;
  pageSizeOptions: number[] = [25, 100, 250];
  pageEvent!: PageEvent;

  range = new FormGroup({
    start: new FormControl<string>(this.datePipe.transform(this.beginDate, 'yyyy-MM-dd')!), //this.beginDate.setMonth(this.beginDate.getMonth() - 1
    end: new FormControl<string>(this.datePipe.transform(this.endDate, 'yyyy-MM-dd')!),
  });

  displayedColumns: string[] = [
    'select',
    'id',
    'no',
    'username',
    // 'categoryName',
    // 'subCategoryName',
    'productList',
    'itemCount',
    'serviceFee',
    'amount',
    'status',
    'createdDate',
  ];

  selRow: number = 0;

  isActive = (index: number) => { return this.activeRow === index };

  ngOnInit() {
    this.getOrder()


  }

  getOrder() {

    this.orderService.getOrder(this.requestData, this.range.controls.start.value, this.range.controls.end.value).subscribe({
      next: res => {
        this.dataSource = new MatTableDataSource<BrowseOrder>(res.data.result);
        this.length = res.data.count;
        this.dataSource.sort = this.sort;
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

  sortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnounce.announce('sorted ${sortState.direction}ending');
    }
    else {
      this._liveAnnounce.announce('sorted cleared');
    }
  }

  search() {
    this.range.controls.end.patchValue(this.datePipe.transform(this.range.controls.end.value, 'yyyy-MM-dd')!)
    this.range.controls.start.patchValue(this.datePipe.transform(this.range.controls.start.value, 'yyyy-MM-dd')!)
    if (this.range.controls.end.value == null) {
      this.range.controls.end.patchValue(this.datePipe.transform(this.endDate, 'yyyy-MM-dd')!)
    }
    this.getOrder()
  }

  onChangePage(pe: PageEvent) {
    this.requestData.nextPageNumber = pe.pageIndex + 1
    this.requestData.visibleItemCount = pe.pageSize
    this.selection.clear()
    this.highlightedRows = []
    this.highlightedRowss = {}
    this.getOrder()
  }

  highlight(index: number, id: number): void {
    if (!this.isActive(index)) {
      this.activeRow = index;
      // this.selectedId = id;
    }
    else {
      this.activeRow = -1;
      //this.selectedId = 0;
    }
  }

  selectToday() {
    this.range.controls.end.patchValue(this.datePipe.transform(this.endDate, 'yyyy-MM-dd')!)
    this.range.controls.start.patchValue(this.datePipe.transform(this.endDate, 'yyyy-MM-dd')!)
    this.getOrder()

  }




  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear()
      this.highlightedRows = []
      this.highlightedRowss = {}
    } else {
      this.dataSource.data.forEach(row => this.selection.select(row));
      this.highlightedRows = []
      this.highlightedRowss = {}
      this.dataSource.data.forEach(row => this.highlightedRows.push(row));
      this.dataSource.data.forEach(row => this.highlightedRowss[row.id!] = !this.highlightedRowss[row.id!]);

    }
  }

  selectedRow(event: any, row: any) {
    this.highlightedRows.push(row);
    this.highlightedRowss[row.id] = !this.highlightedRowss[row.id];
    event ? this.selection.toggle(row) : null
    this.selRow = this.selection['selected'].length

  }

  selectedAll(event: any) {
    event ? this.masterToggle() : null;
    this.selRow = this.selection['selected'].length
  }


  openDialog(type: number) {
    if (type == 1) {
      this.orderIds = []
      this.selection.selected.forEach(row =>
        this.orderIds.push(row.id)
      );

      const dialogRef = this.dialog.open(SaveOrderComponent, {
        data: this.orderIds,
        height: 'max-content',
        width: '20%',
        hasBackdrop: true,
        panelClass: "dialog-admin-order",
        disableClose: true,
        autoFocus: false
      })

      dialogRef.afterClosed().subscribe(result => {
        this.refreshBrowse();
      });

    } else {
      this.selectedId = this.selection.selected[0].id

      const dialogRef = this.dialog.open(EditOrderPopupComponent, {
        data: this.selectedId,
        height: 'max-content',
        width: '50%',
        hasBackdrop: true,
        panelClass: "dialog-admin-edit-order",
        disableClose: true,
        autoFocus: false
      })

      dialogRef.afterClosed().subscribe(result => {
        this.refreshBrowse();
      });
    }
  }


  refreshBrowse() {
    this.selection.clear()
    this.highlightedRows = []
    this.highlightedRowss = {}
    this.getOrder();
  }

  handleKeyUp(e: any) {
    let filterValue = e.target.value
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
