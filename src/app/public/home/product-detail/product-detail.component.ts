import { Component, Inject, OnInit } from '@angular/core';
import { HomeComponent } from '../home.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from 'src/services/product.service';
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
}

export class Reviews{
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

  ) { }


  product?: ProductDetail

  stars: number[] = [1, 2, 3, 4, 5];
  selectedValue?: number;

  ngOnInit() {
    this.getProductById()
  }

  getProductById() {
    this.productService.getProductByIdClient(this.data).subscribe(res => {
      this.product = res.data
      console.log(res.data)
    })
  }

  countStar(star) {
    this.selectedValue = star;
    console.log('Value of star', star);
  }

  

}
