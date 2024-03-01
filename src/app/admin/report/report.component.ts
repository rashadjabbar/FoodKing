import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Report } from 'src/models/report';
import { GlobalService } from 'src/services/global.service';
import {MatSort, Sort} from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  constructor(
    public globalService: GlobalService,
    private _liveAnnounce: LiveAnnouncer
  ) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  length!: number;
  reportData: Report[] = []
  requestData: any = {
    nextPageNumber: 1,
    visibleItemCount: 25,
  }
  dataSource = new MatTableDataSource<Report>(this.reportData);
  pageSize: number = this.requestData.visibleItemCount;
  pageSizeOptions: number[] = [10, 25, 50];
  pageEvent!: PageEvent;

  displayedColumns: string[] = [
    'id',
    'name',
    'debtAmount',
    'avansAmount',
    'paymentAmount',
    'orderAmount',
  ];

  ngOnInit() {
    this.getReportBalance()
  }

  getReportBalance(){
    this.globalService.getClientBalance(this.requestData).subscribe(res =>{
      this.dataSource = new MatTableDataSource<Report>(res.data);

        this.length = res.data.count
        this.dataSource.sort = this.sort;
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


  onChangePage(pe: PageEvent) {
    this.requestData.nextPageNumber = pe.pageIndex + 1
    this.requestData.visibleItemCount = pe.pageSize
    this.getReportBalance()
  }

}
