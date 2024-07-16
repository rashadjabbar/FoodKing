import { Component, ElementRef, EventEmitter, Output, ViewChild, numberAttribute } from '@angular/core';
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
import { PaginationDummyService } from 'src/services/public/pagination-dummy.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  @ViewChild('list') el!: ElementRef;

  constructor(
    private categoryServices: CategoryService,
    private productService: ProductService,
    private basketService: BasketService,
    private router: Router,
    private globalService: GlobalService,
    private authService: AuthService,
    private dialog: MatDialog,
    private paginationService: PaginationDummyService
  ) {
    this.catId = localStorage.getItem('catId') as any
    this.imageIpUrl = environment.imageIpUrl

  }

  currentPage?: number = 1
  imageIpUrl!: string
  categories: AllCategoryBrowse[] = []
  requestData: any = {
    nextPageNumber: 1,
    visibleItemCount: 9,
  }

  catId = 0
  subCatId = 0
  orderByProducts = 1
  message = 'Hello!';

  productData: ProductBrowseData[] = []
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  length!: number;
  pageSize = 9;
  pageSizeOptions: number[] = [9, 18, 27];
  pageEvent!: PageEvent;
  dataSource = new MatTableDataSource<ProductBrowseData>(this.productData);


  ngOnInit() {

    let slideIndex = 0;
    let slider = document.querySelector('#test');
    let slides = slider!.querySelectorAll('li');

    setInterval(() => {
      for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active');
      }

      slideIndex++;
      if (slideIndex > slides.length) {
        slideIndex = 0
      }

      slides[slideIndex - 1].classList.add('active');
      
    }, 5000)

    this.globalService.data$.subscribe(res => {
      this.requestData.nextPageNumber = 1
      this.getProduct(res.catId)
      this.catId = res.catId
    }
    )
    // this.dataSource.paginator = this.paginator;
    if (this.catId !== null) {
      this.router.navigate(['/'], { fragment: 'products' });
    }
    this.getCategories()
    if (localStorage.getItem("productIdForDetail")) {
      this.openDetail(Number(localStorage.getItem("productIdForDetail")))
    }

  }


  onChangePage(pe: PageEvent) {
    this.currentPage = pe.pageIndex + 1
    this.requestData.nextPageNumber = pe.pageIndex + 1
    this.requestData.visibleItemCount = pe.pageSize
    this.getProduct(this.catId)
    setTimeout(() => {
      var elements = document.getElementById('products');
      elements?.scrollIntoView();
    }, 300);
  }

  getCategories() {
    this.categoryServices.getCategoryAndSubCategory().subscribe((res: any) => {
      this.categories = res.data
    })
  }

  subCategoryClick(catId: any, subCatId: any) {

    this.requestData = {
      nextPageNumber: 1,
      visibleItemCount: 9,
    }

    this.pageSize = 9;
    this.pageSizeOptions = [9, 18, 27];

    this.catId = catId

    if (this.subCatId == subCatId)
      this.subCatId = 0;
    else
      this.subCatId = subCatId

    this.getProduct(this.catId)

    setTimeout(() => {
      if (this.productData.length !== 0) {
        this.paginator.firstPage()
      }
    }, 300);
  }

  categoryClick(categoryId: any) {
    // this.catId = categoryId
    this.requestData = {
      nextPageNumber: 1,
      visibleItemCount: 9,
    }

    this.pageSize = 9;
    this.pageSizeOptions = [9, 18, 27];

    if (this.catId == categoryId)
      this.catId = 0;
    else this.catId = categoryId

    this.subCatId = 0
    this.getProduct(this.catId)

    setTimeout(() => {
      if (this.productData.length !== 0) {
        this.paginator.firstPage()
      }
    }, 300);

  }

  getProduct(categoryId: number) {
    this.productService.getProductClientBrowseData(this.requestData, categoryId, this.subCatId, this.orderByProducts).subscribe({
      next: res => {
        this.productData = res.data.result
        this.length = res.data.count
      }
    })
  }

  filterProducts(event: any) {
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
    } else this.requestData.nextPageNumber = this.currentPage

    this.getProduct(this.catId)
  }

  addProductToBasket(productId: number) {
    if (!_isAuthenticated) {
      this.router.navigate(['user-login'])

    } else {
      this.basketService.addProductToBasket({ productId }).subscribe({
        next: res => {
          localStorage.setItem('notificationPlayed', 'false')
          showInfoAlert('', "Səbətə əlavə edildi", false, false, 'Bağla', '', 1000);
          this.globalService.refreshBasket({ itemAddedToBasket: true })
        }
      })
    }

  }

  openDetail(id: number) {
    localStorage.removeItem("productIdForDetail")

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

  addToWishList(index: number, productId: number) {
    if (!_isAuthenticated)
      this.router.navigate(['user-login'])

    this.productService.SaveWishList(productId).subscribe({
      next: res => {
        this.productData[index].isFavorite = !this.productData[index].isFavorite;
      }
    })
  }
}
