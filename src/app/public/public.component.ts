import { Component, ElementRef, ViewChild } from '@angular/core';
import { AllCategory } from 'src/models/category';
import { CategoryService } from 'src/services/category.service';
import { Router } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GlobalService, User } from 'src/services/global.service';
import { BasketService } from 'src/services/public/basket.service';
import { MatMenuTrigger } from '@angular/material/menu';
import jwt_decode from 'jwt-decode';
import { showConfirmAlert, showInfoAlert } from 'src/utils/alert';
import { SaveOrder } from 'src/models/save-order';
import { AuthService, _isAuthenticated } from 'src/services/auth.service';

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
    private authService: AuthService,
    private globalService: GlobalService) {  }

  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
  message: any;
  totalBasketAmount?: number = 0;
  basketAmount?: number = 0;
  serviceFee?: number = 0;
  orderData: SaveOrder = {orderItems:[]}


  categories: AllCategory[] = []
  basketItems: any = []

  userData?: User
  isAuthenticated: boolean=false;

  loginnedUser = sessionStorage.getItem('token')

  ngOnInit() {
    this.authService.identityCheck();
    this.isAuthenticated= _isAuthenticated;
    
    this.getCategories()

    if(this.isAuthenticated){
      this.getBasket()
      this.getUserData()

      this.globalService.basketObservable$.subscribe(res => {
        this.getBasket()
      })
    }

    this.loadJsFile('../../../assets/js/app.js')
  }

  public loadJsFile(url) {  
    let node = document.createElement('script');  
    node.src = url;  
    node.type = 'text/javascript';  
    document.getElementsByTagName('head')[0].appendChild(node);  
  }  

  getUserData(){
    this.userData = jwt_decode(sessionStorage.getItem('token')!)
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

  submitOrder(){
    showConfirmAlert('', "Sifariş etmək istədiyinizdən əminsinizmi?", undefined, undefined).then(res =>{
      if (res.isConfirmed){
        this.orderData!.id=0
        this.orderData!.serviceFee=this.serviceFee
        this.orderData!.amount=this.basketAmount
        
        this.basketItems.map((item: any) => {
          this.orderData.orderItems!.push({
            productId: item.productId,
            productName: item.name,
            count: item.count,
            price: item.price,
          })
        });
        
    
        this.basketService.SaveOrder(this.orderData!).subscribe(res => {
          showInfoAlert('', "Sifariş qəbul edildi", false, false, 'Bağla','', 1000);
          this.getBasket();
        }) 
      }
    });
  }

  logOut(){
    sessionStorage.removeItem('token')
    this.authService.identityCheck();
    this.isAuthenticated= _isAuthenticated;
    //this.router.navigate(['user-login']);
  }
}
