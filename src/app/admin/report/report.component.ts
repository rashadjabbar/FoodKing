import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ReportDebt, ReportbalanceMonitoring } from 'src/models/report';
import { GlobalService } from 'src/services/global.service';
import {MatSort, Sort} from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ReportService } from 'src/services/report.service';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  constructor(
    public reportService: ReportService,
    private datePipe: DatePipe,
    private _liveAnnounce: LiveAnnouncer
  ) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  length!: number;
  reportData: ReportDebt[] = []

  lengthBalanceMonitoring!: number;
  reportDataBalanceMonitoring: ReportbalanceMonitoring[] = []

  requestData: any = {
    nextPageNumber: 1,
    visibleItemCount: 25,
  }
  dataSource = new MatTableDataSource<ReportDebt>(this.reportData);
  dataSourceBalanceMonitoring = new MatTableDataSource<ReportbalanceMonitoring>(this.reportDataBalanceMonitoring);
  pageSize: number = this.requestData.visibleItemCount;
  pageSizeOptions: number[] = [10, 25, 50];
  pageEvent!: PageEvent;

  tabID: number = 0;
  beginDate: any = new Date();
  endDate: any = new Date()

  range = new FormGroup({
    start: new FormControl<string>(this.datePipe.transform(this.beginDate.setMonth(this.beginDate.getMonth() - 1), 'yyyy-MM-dd')!),
    end: new FormControl<string>(this.datePipe.transform(this.endDate, 'yyyy-MM-dd')!),
  });

  displayedColumns: string[] = [
    'id',
    'name',
    'debtAmount',
    'avansAmount',
    'paymentAmount',
    'orderAmount',
  ];

  displayedColmBalanceRep: string[] = [
    'id',
    'orderAmount',
    'paymentAmount',
    'expectedProfit',
    'actualProfit'
  ];

  ngOnInit() {
    this.getReportBalance()
    //this.getReportBalanceMonitoring()
  }

  getReportBalance(){
    this.reportService.getClientBalance(this.requestData).subscribe(res =>{
      this.dataSource = new MatTableDataSource<ReportDebt>(res.data);

        this.length = res.data.count
        this.dataSource.sort = this.sort;
    })
  }

  getReportBalanceMonitoring(){
    this.reportService.getBalanceMonitoring(this.requestData, this.range.controls.start.value, this.range.controls.end.value).subscribe(res =>{
      this.dataSourceBalanceMonitoring.data = res.data.result;
      console.log(res.data.result);
        this.lengthBalanceMonitoring = res.data.count

    })
  }


  sortChange(sortState: Sort){
     if(sortState.direction){
       this._liveAnnounce.announce('sorted ${sortState.direction}ending');
     }
     else{
       this._liveAnnounce.announce('sorted cleared');
     }
  }

  tabChange(id: number) {
    this.tabID = id
    if (id == 0) {
      this.getReportBalance()
    } else
      this.getReportBalanceMonitoring()
  }

  handleDebtReportKeyUp(e: any) {
    let filterValue = e.target.value
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  handleBalanceReportKeyUp(e: any) {
    let filterValue = e.target.value
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceBalanceMonitoring.filter = filterValue;
  }

  onChangePage(pe: PageEvent) {
    this.requestData.nextPageNumber = pe.pageIndex + 1
    this.requestData.visibleItemCount = pe.pageSize
    
    if (this.tabID == 0) {
      this.getReportBalance()
    } else
      this.getReportBalanceMonitoring();
  }

  selectToday() {
    this.range.controls.end.patchValue(this.datePipe.transform(this.endDate, 'yyyy-MM-dd')!)
    this.range.controls.start.patchValue(this.datePipe.transform(this.endDate, 'yyyy-MM-dd')!)
    this.getReportBalanceMonitoring()

  }

  search() {
    this.range.controls.end.patchValue(this.datePipe.transform(this.range.controls.end.value, 'yyyy-MM-dd')!)
    this.range.controls.start.patchValue(this.datePipe.transform(this.range.controls.start.value, 'yyyy-MM-dd')!)
    if (this.range.controls.end.value == null) {
      this.range.controls.end.patchValue(this.datePipe.transform(this.endDate, 'yyyy-MM-dd')!)
    }
    this.getReportBalanceMonitoring()
  }

}
