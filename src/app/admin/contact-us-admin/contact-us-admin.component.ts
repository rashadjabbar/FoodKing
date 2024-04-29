import { SelectionModel } from '@angular/cdk/collections';
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
  dataSourceRead = new MatTableDataSource<ContactUsBrowseData>(this.contactData);
  pageSize: number = this.requestData.visibleItemCount;
  pageSizeOptions: number[] = [10, 25, 50];
  pageEvent!: PageEvent;

  tabID: number = 0;

  activeRow: any = -1;
  selectedId: any = 0;
  selection = new SelectionModel<any>(true, []);

  activeRowRead: any = -1;
  selectedIdRead: any = 0;
  selectionRead = new SelectionModel<any>(true, []);

  displayedColumns: string[] = [
    'id',
    'subject',
    'content',
    'username',
    'createdDate'
  ];

  displayedColmRead: string[] = [
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
      this.getContactUsReadData()
  }

  onChangePage(pe: PageEvent) {
    this.requestData.nextPageNumber = pe.pageIndex + 1
    this.requestData.visibleItemCount = pe.pageSize
    this.getContactUsData()

  }
  onChangePageRead(pe: PageEvent) {
    this.requestData.nextPageNumber = pe.pageIndex + 1
    this.requestData.visibleItemCount = pe.pageSize
    this.getContactUsReadData();
  }

  isActive = (index: number) => {return this.activeRow === index };
  isActiveRead = (index: number) => {return this.activeRowRead === index };

  ngOnInit() {
    this.getContactUsData()
    //this.getReportBalanceMonitoring()
  }

  getContactUsData() {
    this.contactUsService.getContactUs(this.requestData, 0).subscribe(res => {
      this.dataSource = new MatTableDataSource<ContactUsBrowseData>(res.data.result);
    })
  }

  getContactUsReadData() {
    this.contactUsService.getContactUs(this.requestData, 1).subscribe(res => {
      this.dataSourceRead.data = res.data.result;
    })
  }

  Read() {
    this.contactUsService.getContactUs(this.requestData, 1).subscribe(res => {
      this.dataSourceRead.data = res.data.result;
    })
  }

  highlight(index: number, id: number): void {
    if (!this.isActive(index)) {
      this.activeRow = index;
      this.selectedId = id;
      // this.getLine(this.activeRow);
    }
    else {
      this.activeRow = -1;
      this.selectedId = 0;

      // this.directionForm.reset()
      // this.Df['directionId'].setValue(0);
      // this.Df['name'].setValue(' ');
    }
  }
  highlightRead(index: number, id: number): void {
    if (!this.isActive(index)) {
      this.activeRowRead = index;
      this.selectedIdRead = id;
      // this.getLine(this.activeRow);
    }
    else {
      this.activeRowRead = -1;
      this.selectedIdRead = 0;

      // this.directionForm.reset()
      // this.Df['directionId'].setValue(0);
      // this.Df['name'].setValue(' ');
    }
  }

}
