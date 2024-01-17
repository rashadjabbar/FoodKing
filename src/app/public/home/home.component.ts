import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ComboBox, AllCategoryBrowse } from 'src/models/category';
import { ProductBrowseData } from 'src/models/product';
import { AuthService, _isAuthenticated } from 'src/services/auth.service';
import { CategoryService } from 'src/services/category.service';
import { GlobalService } from 'src/services/global.service';
import { ProductService } from 'src/services/product.service';
import { BasketService } from 'src/services/public/basket.service';
import { showInfoAlert } from 'src/utils/alert';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(
    private categoryServices: CategoryService,
    private productService: ProductService,
    private basketService: BasketService,
    private router: Router,
    private globalService: GlobalService,
    private authService: AuthService,
    private dialog: MatDialog,

    ) {
      this.catId = sessionStorage.getItem('catId') as any
      this.imageIpUrl = environment.imageIpUrl

  }
  
  imageIpUrl!: string
  categories: AllCategoryBrowse[] = []

  requestData: any = {
    nextPageNumber: 1,
    visibleItemCount: 9,
    // filters:[
    //   {
    //   columnName: "productName",
    //   value: ""
    //   }
    // ]
  }

  catId = 0
  subCatId = 0
  orderByProducts = 1
  message = 'Hello!';
  currentPage?: number = 1

  productData: ProductBrowseData[] = []
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  length!: number;
  pageSize = 9;
  pageSizeOptions: number[] = [9,18,27];
  pageEvent!: PageEvent;
  dataSource = new MatTableDataSource<ProductBrowseData>(this.productData);


  ngOnInit() {
    this.globalService.data$.subscribe(res =>  this.getProduct(res.catId))
    this.dataSource.paginator = this.paginator;
    if (this.catId !== null) {
      this.router.navigate(['/'],{fragment: 'products'});
    }
    this.getCategories()

    if(sessionStorage.getItem("productIdForDetail")){
      this.openDetail(Number(sessionStorage.getItem("productIdForDetail")))
    }

  }

  onChangePage(pe: PageEvent) {
    this.currentPage = pe.pageIndex + 1
    this.requestData.nextPageNumber = pe.pageIndex + 1
    this.requestData.visibleItemCount = pe.pageSize
    this.getProduct(this.catId)
  }



  getCategories() {
    this.categoryServices.getCategoryAndSubCategory().subscribe((res: any) => {
      this.categories = res.data
    })
  }

  categoryClick(categoryId: any) {
   // this.catId = categoryId
    if(this.catId == categoryId)
      this.catId = 0;
    else
      this.catId = categoryId

    this.subCatId = 0
    this.getProduct(this.catId)
  }

  subCategoryClick(catId: any, subCatId: any) {
    this.catId = catId

    if(this.subCatId == subCatId)
      this.subCatId = 0;
    else
      this.subCatId = subCatId

    this.getProduct(this.catId)
  }

  getProduct(categoryId: number) {
    this.productService.getProductClientBrowseData(this.requestData, categoryId, this.subCatId, this.orderByProducts).subscribe({
      next: res => {
        this.productData = res.data.result
        this.length = res.data.count
      }
    })
  }

  filterProducts(event: any){
    this.requestData.filters = [
        {
        columnName: "productName",
        value: event.target.value
        }
      ];
      let filteredValues = this.requestData.filters.filter(x => x.value)
    if (filteredValues.length > 0) {
      this.requestData.nextPageNumber = 1
      this.catId = 0
      this.subCatId = 0 
    }else this.requestData.nextPageNumber = this.currentPage

    this.getProduct(this.catId)
  }

  addProductToBasket(productId: number){
    if (!_isAuthenticated) {
      this.router.navigate(['user-login'])
      
    }else {
      this.basketService.addProductToBasket({productId}).subscribe({
        next: res => {
          showInfoAlert('', "Səbətə əlavə edildi", false, false, 'Bağla','', 1000);
          this.globalService.refreshBasket({itemAddedToBasket: true})
        }
      })
    }
    
  }

  openDetail(id: number){
    sessionStorage.removeItem("productIdForDetail")

    const dialogRef = this.dialog.open(ProductDetailComponent, {
      data: id,
      maxHeight: '90vh',
      width: '45%',
      hasBackdrop: true,
      panelClass: "dialog-user-cabinet",
      disableClose: false,
    })

    dialogRef.afterClosed().subscribe(result => {
      this.getProduct(this.catId)
    });
  }

  addToWishList(index:number, productId: number){
    if (!_isAuthenticated) 
      this.router.navigate(['user-login'])

    this.productService.SaveWishList(productId).subscribe({
      next: res => {
        this.productData[index].isFavorite = !this.productData[index].isFavorite;
      }
    })
  }

}
