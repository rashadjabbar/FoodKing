import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { showErrorAlert, showInfoAlert } from 'src/utils/alert';
import { NewsService } from 'src/services/news.service';
import { StatusRequest } from 'src/models/status';
import { NewsFilter, NewsRequestPayload, NewsRawItem } from 'src/models/news';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
  providers: [DatePipe]
})
export class NewsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['no', 'content', 'link', 'username', 'createdDate', 'actions', 'approval', 'status'];
  visibleColumns: string[] = [];
  isAdmin = false;
  userType = 0;
  currentUserId: number | null = null;
  currentUsername = '';
  textTruncateLength = 100;
  dataSource = new MatTableDataSource<any>([]);
  editingNewsId: number | null = null;
  editingNewsOwnerId: number | null = null;
  editingNewsOwnerUsername = '';
  statusRequest!: StatusRequest;
  beginDate: any;
  endDate: any;
  length = 0;
  requestData: any = {
    nextPageNumber: 1,
    visibleItemCount: 25,
  };
  pageSize: number = this.requestData.visibleItemCount;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  range!: FormGroup;
  searchQuery = '';
  statusFilter: 'all' | 'active' | 'inactive' = 'active';

  constructor(
    private newsService: NewsService,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    this.beginDate = this.datePipe.transform(lastMonth, 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(today, 'yyyy-MM-dd');

    this.range = new FormGroup({
      start: new FormControl<string>(this.beginDate!),
      end: new FormControl<string>(this.endDate!),
    });
  }

  newsForm = this.fb.group({
    content: ['', Validators.required],
    // link is optional; if provided it may include http(s) or start with www.
    link: ['', Validators.pattern('^(https?:\\/\\/)?(www\\.)?\\S+$')],
  });

  ngOnInit(): void {
    this.setUserRole();
    this.updateVisibleColumns();
    this.dataSource.filterPredicate = this.newsFilterPredicate;
    this.getNews();
  }

  get f() {
    return this.newsForm.controls;
  }

  private buildRequestPayload(): NewsRequestPayload {
    const filters: NewsFilter[] = [];

    if (this.statusFilter !== 'all') {
      filters.push({
        columnName: 'Status',
        value: this.statusFilter === 'active' ? '1' : '0',
      });
    }

    return {
      nextPageNumber: this.requestData.nextPageNumber ?? 1,
      visibleItemCount: this.requestData.visibleItemCount ?? this.pageSize,
      filters,
      beginDate: this.beginDate ? new Date(this.beginDate).toISOString() : null,
      endDate: this.endDate ? new Date(this.endDate).toISOString() : null,
    };
  }

  private extractNewsItems(response: any): { items: NewsRawItem[]; count?: number } {
    if (Array.isArray(response)) {
      return { items: response, count: response.length };
    }

    if (Array.isArray(response?.result)) {
      return { items: response.result, count: response.count };
    }

    if (Array.isArray(response?.data)) {
      return { items: response.data, count: response.data.length };
    }

    if (Array.isArray(response?.data?.result)) {
      return { items: response.data.result, count: response.data.count ?? response.data.result.length };
    }

    return { items: [], count: 0 };
  }

  private createDataSource(items: any[]): MatTableDataSource<any> {
    const source = new MatTableDataSource<any>(items);
    source.filterPredicate = this.newsFilterPredicate;
    source.filter = this.getTableFilterString();
    return source;
  }

  private readonly newsFilterPredicate = (data: any, filter: string): boolean => {
    let filterObj: { search: string; status: 'all' | 'active' | 'inactive' } = { search: '', status: 'all' };

    try {
      filterObj = JSON.parse(filter);
    } catch {
      filterObj = { search: filter.toLowerCase?.() ?? '', status: 'all' };
    }

    const text = String(data.Text ?? data['content'] ?? data['news'] ?? data.news ?? '').toLowerCase();
    const link = String(data.Link ?? data['link'] ?? data['newsLink'] ?? '').toLowerCase();
    const statusValue = this.normalizeStatusValue(data);

    const matchesText = !filterObj.search || text.includes(filterObj.search) || link.includes(filterObj.search);
    const matchesStatus = filterObj.status === 'all'
      || (filterObj.status === 'active' && statusValue)
      || (filterObj.status === 'inactive' && !statusValue);

    return matchesText && matchesStatus;
  };

  private normalizeStatusValue(row: any): boolean {
    const status = row.status ?? row.Status ?? row.isActive ?? row.active;
    return status === true || status === 1 || String(status).toLowerCase() === 'true';
  }

  private getTableFilterString(): string {
    return JSON.stringify({
      search: this.searchQuery.trim().toLowerCase(),
      status: this.statusFilter,
    });
  }

  getNews() {
    const payload = this.buildRequestPayload();

    this.newsService.GetNewsFullData(payload).subscribe({
      next: (res: any) => {
        const { items, count } = this.extractNewsItems(res);

        this.length = typeof count === 'number' ? count : items.length;
        this.dataSource = this.createDataSource(items);
        this.applyTableFilter(this.requestData.nextPageNumber === 1);
      },
      error: () => {
        showErrorAlert('Xəta', 'Xəbərlər yüklənmədi', false, false, '', '', 1500);
      }
    });
  }

  startCreate() {
    this.editingNewsId = null;
    this.editingNewsOwnerId = null;
    this.editingNewsOwnerUsername = '';
    this.newsForm.reset({ content: '', link: '' });
  }

  editNews(news: any) {
    const ownerId = this.extractNewsOwnerId(news);
    const ownerUsername = this.extractNewsOwnerUsername(news);

    if (!this.canEditNews(news)) {
      showErrorAlert('Xəta', 'Bu xəbəri yalnız özünüz yarada və ya redaktə edə bilərsiniz', false, false, '', '', 1500);
      return;
    }

    this.editingNewsId = news.Id ?? news.newsId ?? news.id ?? null;
    this.editingNewsOwnerId = ownerId;
    this.editingNewsOwnerUsername = ownerUsername;
    this.newsForm.patchValue({
      content: news.text ?? news.Text ?? news.content ?? news.news ?? '',
      link: news.Link ?? news.link ?? news.newsLink ?? ''
    });
  }

  isRowEditing(row: any): boolean {
    return this.editingNewsId === (row.Id ?? row.newsId ?? row.id);
  }

  saveNews() {
    if (this.newsForm.invalid) {
      showErrorAlert('Xəta', 'Xahiş edirik məzmunu daxil edin və link düzgün formatda olsun', false, false, '', '', 1500);
      return;
    }

    const contentVal = String(this.newsForm.get('content')?.value ?? '').trim();
    const linkVal = String(this.newsForm.get('link')?.value ?? '').trim();

    const model: any = {
      Text: contentVal
    };

    if (this.editingNewsId != null) {
      if (!this.isEditingAllowed()) {
        showErrorAlert('Xəta', 'Bu xəbəri yalnız özünüz yarada və ya redaktə edə bilərsiniz', false, false, '', '', 1500);
        return;
      }
      model.Id = this.editingNewsId;
    }

    if (linkVal.length > 0) {
      model.Link = linkVal;
    }

    this.newsService.saveNews(model).subscribe({
      next: (res: any) => {
        if (res?.status === false) {
          showErrorAlert('Xəta', res?.message ?? 'Yadda saxlama alınmadı', false, false, '', '', 1500);
          return;
        }

        showInfoAlert('', 'Xəbər saxlanıldı', false, false, '', '', 1200);
        this.startCreate();
        this.getNews();
      },
      error: () => {
        showErrorAlert('Xəta', 'Xəbər saxlanmadı', false, false, '', '', 1500);
      }
    });
  }

  toggleStatus(news: any, event: any) {
    const newsId = news.Id ?? news.newsId ?? news.id;

    this.statusRequest = {
      id: newsId,
      status: event.target.checked,
      key: 'Status'
    };

    this.newsService.changeNewsStatus(this.statusRequest).subscribe({
      next: (result: any) => {
        if (result?.status === false) {
          showErrorAlert('Xəta', result?.message ?? 'Status dəyişmədi', false, false, '', '', 1500);
          return;
        }

        showInfoAlert('', 'Status yeniləndi', false, false, '', '', 1200);
        this.getNews();
      },
      error: () => {
        showErrorAlert('Xəta', 'Status dəyişmədi', false, false, '', '', 1500);
      }
    });
  }

  toggleApproval(news: any, event: any) {
    if (!this.isAdmin) {
      showErrorAlert('Xəta', 'Yalnız admin istifadəçilər xəbəri təsdiqləyə bilər', false, false, '', '', 1500);
      return;
    }

    const newsId = news.Id ?? news.newsId ?? news.id;

    this.statusRequest = {
      id: newsId,
      status: event.target.checked
    };

    this.newsService.approveNewsStatus(this.statusRequest).subscribe({
      next: (result: any) => {
        if (result?.status === false) {
          showErrorAlert('Xəta', result?.message ?? 'Təsdiq dəyişmədi', false, false, '', '', 1500);
          return;
        }

        showInfoAlert('', 'Təsdiq yeniləndi', false, false, '', '', 1200);
        this.getNews();
      },
      error: () => {
        showErrorAlert('Xəta', 'Təsdiq dəyişmədi', false, false, '', '', 1500);
      }
    });
  }

  private setUserRole() {
    const token = localStorage.getItem('token');

    if (!token) {
      this.isAdmin = false;
      this.userType = 0;
      this.currentUserId = null;
      this.currentUsername = '';
      return;
    }

    try {
      const data: any = jwt_decode(token);
      this.userType = Number(data?.userType);
      this.currentUserId = this.extractCurrentUserId(data);
      this.currentUsername = this.extractCurrentUsername(data);
      this.isAdmin = this.userType === 1 || this.userType === 5; //5 News Manager role, 1 Admin 
    } catch {
      this.isAdmin = false;
      this.userType = 0;
      this.currentUserId = null;
      this.currentUsername = '';
    }
  }

  canEditNews(news: any): boolean {
    if (this.isAdmin) {
      return true;
    }

    const ownerId = this.extractNewsOwnerId(news);

    if (ownerId !== null && this.currentUserId !== null) {
      return ownerId === this.currentUserId;
    }

    const ownerUsername = this.extractNewsOwnerUsername(news);
    if (ownerUsername) {
      return ownerUsername === this.currentUsername;
    }

    return false;
  }

  private isEditingAllowed(): boolean {
    if (this.isAdmin) {
      return true;
    }

    if (this.editingNewsOwnerId !== null && this.currentUserId !== null) {
      return this.editingNewsOwnerId === this.currentUserId;
    }

    if (this.editingNewsOwnerUsername) {
      return this.editingNewsOwnerUsername === this.currentUsername;
    }

    return false;
  }

  private extractCurrentUserId(data: any): number | null {
    return this.parseNumber(data?.userId);
  }

  private extractCurrentUsername(data: any): string {
    const value = data?.userName;
    return typeof value === 'string' ? value.trim().toLowerCase() : '';
  }

  private extractNewsOwnerId(news: any): number | null {
    return this.parseNumber(news?.userId);
  }

  private extractNewsOwnerUsername(news: any): string {
    const value = news?.userName;
    return typeof value === 'string' ? value.trim().toLowerCase() : '';
  }

  private parseNumber(value: any): number | null {
    if (value == null || value === '') {
      return null;
    }

    const num = Number(value);
    return Number.isFinite(num) ? num : null;
  }

  private updateVisibleColumns() {
    this.visibleColumns = this.displayedColumns.filter(col => {
      if (col === 'username') {
        return this.userType === 1 || this.userType === 5;
      }
      else if (col === 'status') {
        return this.userType === 1 || this.userType === 5;
      }
      return true;
    });
  }

  truncateText(text: string, length: number = this.textTruncateLength): string {
    if (!text) return '-';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  }

  onChangePage(pe: PageEvent): void {
    this.requestData.nextPageNumber = pe.pageIndex + 1;
    this.requestData.visibleItemCount = pe.pageSize;
    this.getNews();
  }

  handleKeyUp(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.applyTableFilter();
  }

  onStatusFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.statusFilter = select.value as 'all' | 'active' | 'inactive';
    this.requestData.nextPageNumber = 1;
    this.getNews();
  }

  private applyTableFilter(resetPage: boolean = false): void {
    if (!this.dataSource) {
      return;
    }

    this.dataSource.filter = this.getTableFilterString();

    if (resetPage && this.dataSource.paginator) {
      this.dataSource.paginator.pageIndex = 0;
    }
  }

  selectToday(): void {
    this.beginDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.range.get('start')?.patchValue(this.beginDate);
    this.range.get('end')?.patchValue(this.endDate);
    this.requestData.nextPageNumber = 1;
    this.getNews();
  }

  search(): void {
    this.beginDate = this.datePipe.transform(this.range.get('start')?.value, 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(this.range.get('end')?.value, 'yyyy-MM-dd');

    if (this.endDate == null) {
      this.endDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.range.get('end')?.patchValue(this.endDate);
    }

    if (this.beginDate == null) {
      const defaultBeginDate = new Date();
      defaultBeginDate.setMonth(defaultBeginDate.getMonth() - 1);
      this.beginDate = this.datePipe.transform(defaultBeginDate, 'yyyy-MM-dd');
      this.range.get('start')?.patchValue(this.beginDate);
    }

    this.requestData.nextPageNumber = 1;
    this.getNews();
  }

  getApprovalLabel(row: any): string {
    return this.isApprovalActive(row) ? 'Təsdiqləndi' : 'Təsdiq gözləyir';
  }

  isApprovalActive(row: any): boolean {
    const status = row.approvalStatus ?? row.ApprovalStatus ?? row.isApproved ?? row.approved;
    return status === true || status === 1 || String(status).toLowerCase() === 'true';
  }

  getCreatedDate(news: any) {
    return news.CreateDate ?? news.createdDate ?? news.createDate ?? news.createdAt ?? news.date ?? null;
  }
}

