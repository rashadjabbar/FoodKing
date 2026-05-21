import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { RequestData } from 'src/models/request';
import { CampaignWinnerService } from 'src/services/campaign-winner.service';
import Swal from 'sweetalert2';

interface CampaignItem {
  id: number;
  fullName: string;
  campaignType: string;
  prizeType: string;
  prizeName: string;
  status: string | boolean;
  createdDate: Date;
}

@Component({
  selector: 'app-campaign-winner',
  templateUrl: './campaign-winner.component.html',
  styleUrls: ['./campaign-winner.component.scss']
})
export class CampaignWinnerComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  beginDate: any = new Date();
  endDate: any = new Date();
  campaignData: CampaignItem[] = [];
  selectedCampaign: CampaignItem | null = null;

  dataSource = new MatTableDataSource<CampaignItem>(this.campaignData);
  displayedColumns: string[] = ['no', 'fullName', 'campaignType', 'prizeType', 'prizeName', 'status', 'createdDate'];
  requestData: RequestData = {
    nextPageNumber: 1,
    visibleItemCount: 25,
  };
  pageSize = this.requestData.visibleItemCount!;
  pageSizeOptions: number[] = [10, 25, 50];
  pageEvent!: PageEvent;
  length = 0;
  range = new FormGroup({
    start: new FormControl<string>(this.datePipe.transform(this.beginDate, 'yyyy-MM-dd')!),
    end: new FormControl<string>(this.datePipe.transform(this.endDate, 'yyyy-MM-dd')!),
  });

  constructor(
    private campaignWinnerService: CampaignWinnerService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.endDate = this.datePipe.transform(this.endDate, 'yyyy-MM-dd');
    this.beginDate.setMonth(this.beginDate.getMonth() - 1);
    this.beginDate = this.datePipe.transform(this.beginDate, 'yyyy-MM-dd');
  }

  ngOnInit(): void {
    this.dataSource.filterPredicate = (data, filter) => {
      const normalized = filter.trim().toLowerCase();
      const statusLabel = String(data.status ?? '').toLowerCase();
      return [data.fullName, data.campaignType, data.prizeType, data.prizeName, statusLabel]
        .some(value => value.toLowerCase().includes(normalized));
    };
    this.getCampaignWinners();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  onChangePage(pe: PageEvent): void {
    this.pageEvent = pe;
    this.requestData.nextPageNumber = pe.pageIndex + 1;
    this.requestData.visibleItemCount = pe.pageSize;
    this.getCampaignWinners();
  }

  getCampaignWinners(): void {
    this.campaignWinnerService.getCampaignWinners(this.requestData, this.beginDate!, this.endDate!).subscribe({
      next: res => {
        this.dataSource = new MatTableDataSource<CampaignItem>(res.data.result);
        this.selectedCampaign = null;

        this.dataSource.filterPredicate = (data, filter) => {
          const normalized = filter.trim().toLowerCase();
          const statusLabel = String(data.status ?? '').toLowerCase();
          return [data.fullName, data.campaignType, data.prizeType, data.prizeName, statusLabel]
            .some(value => value.toLowerCase().includes(normalized));
        };
        this.dataSource.paginator = this.paginator;
        this.length = res.data.count;
      },
      error: res => {
        if (res.status == 401) {
          Swal.fire({
            icon: 'error',
            title: 'Icazesiz giris...',
            text: 'Login sehifesinden daxil olun!',
          });
          this.router.navigate(['/user-login']);
        }
      }
    });
  }

  selectToday(): void {
    this.beginDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.range.controls.start.patchValue(this.beginDate);
    this.range.controls.end.patchValue(this.endDate);
    this.requestData.nextPageNumber = 1;
    this.getCampaignWinners();
  }

  search(): void {
    this.beginDate = this.datePipe.transform(this.range.controls.start.value, 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(this.range.controls.end.value, 'yyyy-MM-dd');

    if (this.endDate == null) {
      this.endDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.range.controls.end.patchValue(this.endDate);
    }

    if (this.beginDate == null) {
      const defaultBeginDate = new Date();
      defaultBeginDate.setMonth(defaultBeginDate.getMonth() - 1);
      this.beginDate = this.datePipe.transform(defaultBeginDate, 'yyyy-MM-dd');
      this.range.controls.start.patchValue(this.beginDate);
    }

    this.requestData.nextPageNumber = 1;
    this.getCampaignWinners();
  }

  handleKeyUp(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.dataSource.filter = input.value.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  selectRow(row: CampaignItem): void {
    this.selectedCampaign = this.selectedCampaign?.id === row.id ? null : row;
  }

  completeSelectedCampaign(): void {
    if (!this.selectedCampaign || this.isCompleted(this.selectedCampaign.status)) {
      return;
    }

    this.campaignWinnerService.completeCampaignGift({
      id: this.selectedCampaign.id,
      status: true
    }).subscribe({
      next: res => {
        if (res?.status === false) {
          this.showToast('error', res?.message || 'Kampaniya tamamlanmadı.');
          return;
        }

        this.showToast('success', 'Kampaniya hədiyyəsi tamamlandı.');
        this.getCampaignWinners();
      },
      error: res => {
        if (res.status == 401) {
          Swal.fire({
            icon: 'error',
            title: 'Icazesiz giris...',
            text: 'Login sehifesinden daxil olun!',
          });
          this.router.navigate(['/user-login']);
          return;
        }

        this.showToast('error', 'Sorğunu icra etmək mümkün olmadı.');
      }
    });
  }

  isCompleted(status: string | boolean): boolean {
    if (typeof status === 'boolean') {
      return status;
    }

    return status.toLowerCase() === 'tamamlandı';
  }

  getStatusSymbol(status: string | boolean): string {
    return this.isCompleted(status) ? '✓' : '•';
  }

  private showToast(icon: 'success' | 'error', title: string): void {
    Swal.mixin({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 2200,
      timerProgressBar: true
    }).fire({
      icon,
      title
    });
  }
}
