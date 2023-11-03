import { Component, ElementRef, ViewChild } from '@angular/core';
import { AllCategory } from 'src/models/category';
import { CategoryService } from 'src/services/category.service';
import { appJs } from '../../assets/js/app.js'
import { Router } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GlobalService } from 'src/services/global.service';
import { BasketService } from 'src/services/public/basket.service';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss'],
})

export class PublicComponent {
  constructor(
    private router: Router,
    private basketService: BasketService,
    private categoryServices: CategoryService,
    private globalService: GlobalService) { appJs }

  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
  message: any;
  totalBasketAmount?: number = 0;
  basketAmount?: number = 0;
  serviceFee?: number = 0;


  categories: AllCategory[] = []
  basketItems: any = []

  ngOnInit() {
    this.getCategories()
    this.getBasket()

    this.globalService.basketObservable$.subscribe(res => {
      this.getBasket()
    })
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
    this.basketItems = res.data.basketItems
    console.log(res.data)
    this.basketAmount = res.data.amountInfo?.amount;
    this.serviceFee = res.data.amountInfo?.serviceFee;

   this.totalBasketAmount = isNaN(this.basketAmount! + this.serviceFee!)? 0 : this.basketAmount! + this.serviceFee!; 
    })
  }

  removeBasketItem(id: number){
    this.basketService.removeBasketItem(id).subscribe(res => {
      this.getBasket();
     }) 
  }

  closeBasket(){
    this.trigger.closeMenu();
  }

  confirmOrder(){
    
  }
}
