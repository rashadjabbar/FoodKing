import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Category, SubCategory } from 'src/models/category';
import { CategoryService } from 'src/services/category.service';
import { NewCategoryComponent } from './new-category/new-category.component';
import Swal from 'sweetalert2';
import { StatusRequest } from 'src/models/status';
import { showInfoAlert } from 'src/utils/alert';
import { Router } from '@angular/router';
import { NewSubcategoryComponent } from './new-subcategory/new-subcategory.component';

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
  subCatData: SubCategory[] = []
  statusRequest!: StatusRequest;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatPaginator) subPaginator!: MatPaginator;

  displayedColumns: string[] = [
    'id',
    'name',
    'status'
  ];

  displayedColumnsSub: string[] = [
    'id',
    'category',
    'subcategory',
    'hexColor',
    'status'
  ];

  length!: number
  sublength!: number
  tabID: number = 0;

  activeRow: any = -1;
  selectedId: any = 0;

  dataSource = new MatTableDataSource<Category>(this.catData);
  subDataSource = new MatTableDataSource<SubCategory>(this.subCatData);
  selection = new SelectionModel<Category>(true, []);

  requestData: any = {
    nextPageNumber: 1,
    visibleItemCount: 25,
  }

  pageSize: number = this.requestData.visibleItemCount;
  pageSizeOptions: number[] = [10, 25, 50];
  pageEvent!: PageEvent;

  isActive = (index: number) => { return this.activeRow === index };

  ngOnInit() {
    this.getCategory();
    // this.getSubCategory()
  }

  getCategory() {
    this.categoryServices.getCategory(this.requestData).subscribe({
      next: res => {
        this.dataSource = new MatTableDataSource<Category>(res.data.result);
        this.length = res.data.count
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

  getSubCategory() {
    this.categoryServices.getSubCategory(this.requestData).subscribe({
      next: res => {
        this.sublength = res.data.count
        this.subDataSource = new MatTableDataSource<SubCategory>(res.data.result);
        // this.subDataSource.paginator = this.subPaginator
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

  onChangePage(pe: PageEvent) {
    this.requestData.nextPageNumber = pe.pageIndex + 1
    this.requestData.visibleItemCount = pe.pageSize
    if (this.tabID == 0) {
      this.getCategory()
    } else
      this.getSubCategory();
  }

  tabChange(id: number) {
    this.tabID = id
    if (id == 0) {
      this.getCategory()
    } else
      this.getSubCategory()
  }

  status(id: number, event: any) {
    this.statusRequest = {
      id: id,
      status: event.target.checked
    }

    if (this.tabID == 0) {
      this.categoryServices.changeCategoryStatus(this.statusRequest).subscribe({
        next: res => {
          this.getCategory()
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
    } else
      this.categoryServices.changeSubCategoryStatus(this.statusRequest).subscribe({


        next: res => {
          this.getSubCategory()
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

  openDialog(type: number) {
    let id = 0

    if (type !== 1) {
      id = this.selection['selected'][0].id;
    } else id = 0

    if (this.tabID == 0) {
      const dialogRef = this.dialog.open(NewCategoryComponent, {
        data: { id: id, typeView: type },
        height: 'max-content',
        width: '30%',
        hasBackdrop: true,
        panelClass: "dialog-admin-category",
        disableClose: true
      })
      dialogRef.afterClosed().subscribe(result => {
        this.selection.clear()
        this.activeRow = -1;
        this.selectedId = 0;
        this.getCategory();
      });
    } else {
      const dialogRef = this.dialog.open(NewSubcategoryComponent, {
        data: { id: id, typeView: type },
        height: 'max-content',
        width: '30%',
        hasBackdrop: true,
        panelClass: "dialog-admin-subCategory",
        disableClose: true
      })
      dialogRef.afterClosed().subscribe(result => {
        this.selection.clear()
        this.activeRow = -1;
        this.selectedId = 0;
        this.getCategory();
        this.getSubCategory()
      });
    }



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

  
  handleKeyUp(e: any) {
    let filterValue = e.target.value
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  handleSubCatKeyUp(e: any) {
    let filterValue = e.target.value
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.subDataSource.filter = filterValue;
  }
}
