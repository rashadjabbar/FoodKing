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

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  beginDate: any = new Date();
  endDate: any = new Date()
  constructor(
    private orderService: OrderService,
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
  orderData: BrowseOrder[] = []

  dataSource = new MatTableDataSource<BrowseOrder>(this.orderData);
  selection = new SelectionModel<BrowseOrder>(true, []);

  pageSize!: number;
  pageSizeOptions: number[] = [5, 10, 25];
  pageEvent!: PageEvent;

  highlightedRows: any[] = [];
  highlightedRowss: any = {};
  selectedAllRow = false

  orderIds: any[] = [];


  requestData: any = {
    nextPageNumber: 1,
    visibleItemCount: 5,
  }

  displayedColumns: string[] = [
    'select',
    'id',
    'status',
    'categoryName',
    'subCategoryName',
    'productName',
    'count',
    'amount',
    'createdDate',
  ];

  selRow: number = 0;



  isActive = (index: number) => { return this.activeRow === index };

  ngOnInit() {
    this.getOrder()
  }

  getOrder() {
    this.orderService.getOrder(this.requestData, this.beginDate!, this.endDate!).subscribe({
      next: res => {
        this.dataSource = new MatTableDataSource<BrowseOrder>(res.data.result);

        this.length = res.data.count
        console.log(res)

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
    this.selection.clear()
      this.highlightedRows = []
      this.highlightedRowss = {}
    this.getOrder()
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
    let id = 0
    this.selection.selected.forEach(row => this.orderIds.push({
      id: row.id
    }));

    console.log(this.selection.selected)

    if (type !== 1) {
      id = this.selectedId;
    } else id = 0

    const dialogRef = this.dialog.open(SaveOrderComponent, {
      data: this.orderIds,
      height: 'max-content',
      width: '20%',
      hasBackdrop: true,
      disableClose: true
    })
    dialogRef.afterClosed().subscribe(result => {
      // this.activeRow = -1;
      // this.selectedId = 0;
      this.selection.clear()
      this.highlightedRows = []
      this.highlightedRowss = {}
      this.getOrder();
    });
  }

  handleKeyUp(e: any) {
    let filterValue = e.target.value
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
