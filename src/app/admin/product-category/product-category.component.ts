import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Category } from 'src/models/category';
import { CategoryService } from 'src/services/category.service';
import { NewCategoryComponent } from './new-category/new-category.component';
import Swal from 'sweetalert2';
import { StatusRequest } from 'src/models/status';
import { showInfoAlert } from 'src/utils/alert';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss']
})
export class ProductCategoryComponent {

  constructor(
    private categoryServices: CategoryService,
    private dialog: MatDialog,
    private router: Router) { }

  catData: Category[] = []
  statusRequest!: StatusRequest;

  @ViewChild('paginator') paginator!: MatPaginator;
  displayedColumns: string[] = [
    'id',
    'name',
    'status'
  ];

  displayedColumnsSub: string[] = [
    'id',
    'category',
    'subcategory',
    'status'
  ];

  length!: number
  pageSize!: number;
  pageSizeOptions: number[] = [5, 10, 25];
  pageEvent!: PageEvent;

  activeRow: any = -1;
  selectedId: any = 0;

  dataSource = new MatTableDataSource<Category>(this.catData);
  subDataSource = new MatTableDataSource<Category>(this.catData);
  selection = new SelectionModel<Category>(true, []);

  requestData: any = {
    nextPageNumber: 1,
    visibleItemCount: 10,
  }

  isActive = (index: number) => { return this.activeRow === index };

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.getCategory();
  }

  getCategory() {
    this.categoryServices.getCategory(this.requestData).subscribe({
      next: res => {
        this.length = res.data.count
        this.dataSource = new MatTableDataSource<Category>(res.data.result);
        this.dataSource.paginator = this.paginator
      },
      error: res =>{
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

  status(id: number, event: any) {
    this.statusRequest = {
      id: id,
      status: event.target.checked
    }
    this.categoryServices.changeCategoryStatus(this.statusRequest).subscribe({
      next: res => {
        this.getCategory()
      },
      error: res =>{
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

  openDialog(type: number) {
    let id = 0

    if (type !== 1) {
      id = this.selection['selected'][0].id;
    } else id = 0

    const dialogRef = this.dialog.open(NewCategoryComponent, {
      data: { id: id, typeView: type },
      height: 'max-content',
      width: '30%',
      hasBackdrop: true,
      disableClose: true
    })
    dialogRef.afterClosed().subscribe(result => {
      this.selection.clear()
      this.activeRow = -1;
      this.selectedId = 0;
      this.getCategory();
    });
  }


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
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

}