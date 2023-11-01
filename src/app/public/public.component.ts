import { Component, ViewChild } from '@angular/core';
import { AllCategory } from 'src/models/category';
import { CategoryService } from 'src/services/category.service';
import { appJs } from '../../assets/js/app.js'
import { Router } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductService } from 'src/services/product.service';
import { GlobalService } from 'src/services/global.service';
import { BasketService } from 'src/services/public/basket.service';
@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss'],

})
export class PublicComponent {
  message: any;

  constructor(
    private router: Router,
    private basketService: BasketService,
    private categoryServices: CategoryService,
    private globalService: GlobalService) { appJs }
  categories: AllCategory[] = []
  basketItems: any = []

  ngOnInit() {
    this.getCategories()
    this.getBasket()

  }


  getCategories() {
    this.categoryServices.getAllCategory().subscribe((res: any) => {
      this.categories = res.data
    })
  }

  browseCategory(category: any) {
    this.globalService.getCategoryId({catId: category});
    this.router.navigate(['/'],{fragment: 'products'});

    setTimeout(() => {
      var elements = document.getElementById('products');
      elements?.scrollIntoView();
    }, 300);
   
  }

  getBasket(){
    this.basketService.getBasket().subscribe(res => {
     this.basketItems =  res.data.basketItems
    }) 
  }

}
