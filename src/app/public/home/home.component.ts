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
    private authService: AuthService
    ) {
      this.catId = sessionStorage.getItem('catId') as any
  }
  categories: AllCategoryBrowse[] = []

  requestData: any = {
    nextPageNumber: 1,
    visibleItemCount: 6,
  }

  catId = 0
  subCatId = 0

  message = 'Hello!';

  productData: ProductBrowseData[] = []
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  length!: number;
  pageSize = 6;
  pageSizeOptions: number[] = [3, 6, 9];
  pageEvent!: PageEvent;
  dataSource = new MatTableDataSource<ProductBrowseData>(this.productData);


  ngOnInit() {
    this.globalService.data$.subscribe(res =>  this.getProduct(res.catId))
    this.dataSource.paginator = this.paginator;
    if (this.catId !== null) {
      this.router.navigate(['/'],{fragment: 'products'});
    }
    this.getCategories()
   
  }

  onChangePage(pe: PageEvent) {
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
    this.catId = categoryId
    this.subCatId = 0
    this.getProduct(categoryId)

  }

  subCategoryClick(catId: any, subCatId: any) {
    this.catId = catId
    this.subCatId = subCatId
    this.getProduct(catId)
  }

  getProduct(categoryId: number) {
    this.productService.getProductClientBrowseData(this.requestData, categoryId, this.subCatId).subscribe({
      next: res => {
        this.productData = res.data.result
        this.length = res.data.count
      }
    })
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

  addToWishList(index:number, productId: number){
    if (!_isAuthenticated) 
      this.router.navigate(['user-login'])

    this.productData[index].isFavorite = !this.productData[index].isFavorite;

   
  }

}
