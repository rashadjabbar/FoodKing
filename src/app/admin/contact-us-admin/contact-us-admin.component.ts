import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ContactUsBrowseData } from 'src/models/contactUs';
import { ContactUsService } from 'src/services/contactUs.service';

@Component({
  selector: 'app-contact-us-admin',
  templateUrl: './contact-us-admin.component.html',
  styleUrls: ['./contact-us-admin.component.scss']
})
export class ContactUsAdminComponent {

  constructor(
    public contactUsService: ContactUsService
  ) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  length!: number;
  contactData: ContactUsBrowseData[] = []

  requestData: any = {
    nextPageNumber: 1,
    visibleItemCount: 25,
  }
  dataSource = new MatTableDataSource<ContactUsBrowseData>(this.contactData);
  dataSourceReaded = new MatTableDataSource<ContactUsBrowseData>(this.contactData);
  pageSize: number = this.requestData.visibleItemCount;
  pageSizeOptions: number[] = [10, 25, 50];
  pageEvent!: PageEvent;

  tabID: number = 0;

  
  displayedColumns: string[] = [
    'id',
    'subject',
    'content',
    'username',
    'createdDate'
  ];

  displayedColmReaded: string[] = [
    'id',
    'subject',
    'content',
    'username',
    'createdDate'
  ];

  tabChange(id: number) {
    this.tabID = id
    if (id == 0) {
      this.getContactUsData()
    } else
      this.getContactUsReadedData()
  }

  onChangePage(pe: PageEvent) {
    this.requestData.nextPageNumber = pe.pageIndex + 1
    this.requestData.visibleItemCount = pe.pageSize
    
    if (this.tabID == 0) {
      this.getContactUsData()
    } else
      this.getContactUsReadedData();
  }

  ngOnInit() {
    this.getContactUsData()
    //this.getReportBalanceMonitoring()
  }

  getContactUsData(){
    this.contactUsService.getContactUs(this.requestData, 0).subscribe(res =>{
      this.dataSource = new MatTableDataSource<ContactUsBrowseData>(res.data);

        this.length = res.data.count
        this.dataSource.sort = this.sort;
    })
  }

  getContactUsReadedData(){
    this.contactUsService.getContactUs(this.requestData, 1).subscribe(res =>{
      this.dataSourceReaded.data = res.data.result;
    })
  }

  Read(){
    this.contactUsService.getContactUs(this.requestData, 1).subscribe(res =>{
      this.dataSourceReaded.data = res.data.result;
    })
  }

}
