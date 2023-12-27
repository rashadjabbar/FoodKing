import { Component, Inject, OnInit } from '@angular/core';
import { HomeComponent } from '../home.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from 'src/services/product.service';
import { FormBuilder, Validators } from '@angular/forms';
import { _isAuthenticated } from 'src/services/auth.service';
import { showInfoAlert } from 'src/utils/alert';
import { Router } from '@angular/router';
import { BasketService } from 'src/services/public/basket.service';
import { GlobalService } from 'src/services/global.service';
export class ProductDetail {
  productInfo!: ProductInfo
  reviews?: Reviews[]
}

export class ProductInfo {
  id!: number
  name?: string
  information?: string
  price?: number
  imageUrl?: string
  countRating?: number
}

export class Reviews {
  id!: number
  userName?: string
  comment?: string
  createdDate?: string
}

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<HomeComponent>,
    private productService: ProductService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private router: Router,
    private basketService: BasketService,
    private globalService: GlobalService

  ) { }


  product?: ProductDetail

  stars: number[] = [1, 2, 3, 4, 5];
  ratingStars: number[] = [1, 2, 3, 4, 5];
  selectedValue?: number;
  selectedRatingValue?: number;
  reviewForm = this.formBuilder.group({
    comment: ['', Validators.required],
  })

  isAuthenticated: boolean = _isAuthenticated;

  ngOnInit() {
    if (sessionStorage.getItem('productComment')) {
      this.reviewForm.controls.comment.setValue(sessionStorage.getItem('productComment'))
      sessionStorage.removeItem('productComment')
    }

    this.getProductById()
  }

  getProductById() {
    this.productService.getProductByIdClient(this.data).subscribe(res => {
      this.product = res.data
      this.selectedValue = res.data.rateValue
      this.selectedRatingValue = res.data.productInfo.averageRating
    })
  }

  countStar(star) {
    if (!_isAuthenticated) {
      sessionStorage.setItem("productIdForDetail", this.data)
      this.router.navigate(['user-login'])
    } else {
      this.selectedValue = star;
      console.log('Value of star', star);

      let ratingData = {
        productId: this.data,
        rateValue: star
      }

      this.productService.saveProductRating(ratingData).subscribe(res => {
        this.getProductById()
      })
    }
  }

  addComment() {
    if (!_isAuthenticated) {
      sessionStorage.setItem("productIdForDetail", this.data)
      sessionStorage.setItem("productComment", this.reviewForm.controls.comment.value as string)
      this.router.navigate(['user-login'])
    } else {
      if (this.reviewForm.valid) {
        let reViewData = {
          id: 0,
          productId: this.data,
          comment: this.reviewForm.controls.comment.value
        }

        this.productService.addProductReview(reViewData).subscribe(res => {
          this.reviewForm.controls.comment.patchValue('')
          this.getProductById()
        })
      }
    }
  }

  addProductToBasket() {

    if (!_isAuthenticated) {
      sessionStorage.setItem("productIdForDetail", this.data)
      this.router.navigate(['user-login'])

    } else {
      let productId = this.data
      this.basketService.addProductToBasket({ productId }).subscribe({
        next: res => {
          showInfoAlert('', "Səbətə əlavə edildi", false, false, 'Bağla', '', 1000);
          this.globalService.refreshBasket({ itemAddedToBasket: true })
        }
      })
    }

  }


}
