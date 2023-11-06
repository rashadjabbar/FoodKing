import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Category } from 'src/models/category';
import { Product } from 'src/models/product';
import { ProductService } from 'src/services/product.service';
import Swal from 'sweetalert2';
import { NewCategoryComponent } from '../product-category/new-category/new-category.component';
import { NewSubcategoryComponent } from '../product-category/new-subcategory/new-subcategory.component';
import { NewProductComponent } from './new-product/new-product.component';
import { StatusRequest } from 'src/models/status';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class AddProductComponent implements OnInit {

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private router: Router) { }


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'id',
    'productName',
    'categoryName',
    'status'
  ];

  activeRow: any = -1;
  selectedId: any = 0;
  length!: number;
  productData: Product[] = []
  dataSource = new MatTableDataSource<Product>(this.productData);
  statusRequest!: StatusRequest;
  pageSize!: number;
  pageSizeOptions: number[] = [5, 10, 25];
  pageEvent!: PageEvent;

  selection = new SelectionModel<Product>(true, []);
  requestData: any = {
    nextPageNumber: 1,
    visibleItemCount: 5,
  }
  isActive = (index: number) => { return this.activeRow === index };

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.getProduct()
  }

  getProduct() {
    this.productService.getProduct(this.requestData).subscribe({
      next: res => {
        this.dataSource = new MatTableDataSource<Product>(res.data.result);

        this.length = res.data.count
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
  
  openDialog(type: number) {
    let id = 0

    if (type !== 1) {
      id = this.selection['selected'][0].id;
    } else id = 0

      const dialogRef = this.dialog.open(NewProductComponent, {
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
        this.getProduct();
      });
  }

  status(id: number, event: any) {
    this.statusRequest = {
      id: id,
      status: event.target.checked
    }

      this.productService.changeProductStatus(this.statusRequest).subscribe({
        next: res => {
          this.getProduct()
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
    this.getProduct()
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
    }
    else {
      this.activeRow = -1;
      this.selectedId = 0;
    }
  }
}