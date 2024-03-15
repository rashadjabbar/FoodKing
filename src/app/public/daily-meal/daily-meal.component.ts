import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProductBrowseData } from 'src/models/product';
import { AuthService, _isAuthenticated } from 'src/services/auth.service';
import { CategoryService } from 'src/services/category.service';
import { GlobalService } from 'src/services/global.service';
import { ProductService } from 'src/services/product.service';
import { BasketService } from 'src/services/public/basket.service';
import { ProductDetailComponent } from '../home/product-detail/product-detail.component';
import { showInfoAlert } from 'src/utils/alert';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-daily-meal',
  templateUrl: './daily-meal.component.html',
  styleUrls: ['./daily-meal.component.scss']
})
export class DailyMealComponent implements OnInit {

  constructor(
    private categoryServices: CategoryService,
    private productService: ProductService,
    private basketService: BasketService,
    private router: Router,
    private globalService: GlobalService,
    private authService: AuthService,
    private dialog: MatDialog,
  ) {
    this.imageIpUrl = environment.imageIpUrl

   }
  productData: ProductBrowseData[] = []
  imageIpUrl!: string
  ngOnInit() {
    this.getProduct()
  }

  getProduct() {
    this.productService.getDailyProducts().subscribe({
      next: res => {
        this.productData = res.data
      }
    })
  }

  openDetail(id: number){
    localStorage.removeItem("productIdForDetail")

    const dialogRef = this.dialog.open(ProductDetailComponent, {
      data: id,
      maxHeight: '90vh',
      width: '45%',
      hasBackdrop: true,
      disableClose: false,
    })

    dialogRef.afterClosed().subscribe(result => {
      this.getProduct()
    });
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

    this.productService.SaveWishList(productId).subscribe({
      next: res => {
        this.productData[index].isFavorite = !this.productData[index].isFavorite;
      }
    })
  }

}
