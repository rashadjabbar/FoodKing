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
    private router: Router
    ) { }


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'id',
    'productName',
    'categoryName',
    'subCategoryName',
    'purchasePrice',
    'percentage',
    'price',
    'currentAvailability',
    'status'
  ];

  activeRow: any = -1;
  selectedId: any = 0;
  length!: number;
  productData: Product[] = []
  dataSource = new MatTableDataSource<Product>(this.productData);
  statusRequest!: StatusRequest;

  selection = new SelectionModel<Product>(true, []);
  requestData: any = {
    nextPageNumber: 1,
    visibleItemCount: 1000,
  }

  pageSize: number = this.requestData.visibleItemCount;
  pageSizeOptions: number[] = [10, 500, 1000];
  pageEvent!: PageEvent;

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

      const dialogRef = this.dialog.open(NewProductComponent, {
        data: { id: id, typeView: type },
        height: 'max-content',
        width: '50%',
        hasBackdrop: true,
        panelClass: "dialog-admin-product",
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
          //this.getProduct()
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

  currentAvailability(id: number, event: any) {
    this.statusRequest = {
      id: id,
      status: event.target.checked
    }

      this.productService.changeProductCurrentAvailability(this.statusRequest).subscribe({
        next: res => {
          //this.getProduct()
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
    this.getProduct()
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

  handleKeyUp(e: any) {
    let filterValue = e.target.value
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}
