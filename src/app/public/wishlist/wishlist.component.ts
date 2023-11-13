import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environments';
import { AuthService, _isAuthenticated } from 'src/services/auth.service';
import { GlobalService } from 'src/services/global.service';
import { ProductService } from 'src/services/product.service';
import { BasketService } from 'src/services/public/basket.service';
import { showConfirmAlert, showInfoAlert } from 'src/utils/alert';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent {
  constructor(
    private productService: ProductService,
    private basketService: BasketService,
    private router: Router,
    private globalService: GlobalService,
    private authService: AuthService
    ) { 
      this.imageIpUrl = environment.imageIpUrl
    }

    imageIpUrl!: string
    wishList: any = []  

    ngOnInit() {
      this.getUserWishList()
    }

  getUserWishList(){
    this.productService.getUserWishList().subscribe(res => {
      this.wishList = res.data.result
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

  removeFromWishList(productId: number){
    if (!_isAuthenticated) 
      this.router.navigate(['user-login'])

      showConfirmAlert('', "Silmək istədiyinizdən əminsinizmi?", undefined, undefined).then(res =>{
        if (res.isConfirmed){
          this.productService.SaveWishList(productId).subscribe({
            next: res => {
              this.getUserWishList()
            }
        })
        }
      })
  }
}
