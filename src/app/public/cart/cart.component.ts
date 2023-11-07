import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SaveOrder } from 'src/models/save-order';
import { GlobalService } from 'src/services/global.service';
import { BasketService } from 'src/services/public/basket.service';
import { showConfirmAlert, showInfoAlert } from 'src/utils/alert';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  constructor(
    private router: Router,
    private basketService: BasketService,
    private globalService: GlobalService) {  }

  basketItems: any = []  
  basketAmount?: number = 0;
  serviceFee?: number = 0;
  totalBasketAmount?: number = 0;
  orderData: SaveOrder = {orderItems:[]}

  ngOnInit() {
    this.getBasket()
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
    showConfirmAlert('', "Silmək istədiyinizdən əminsinizmi?", undefined, undefined).then(res =>{
      if (res.isConfirmed){
        this.basketService.removeBasketItem(id).subscribe(res => {
          this.getBasket();
          this.globalService.refreshBasket({itemAddedToBasket: true})
         }) 
      }
    });
  }

  changeQuantity(index:number, increase:boolean){
    if(increase)
    this.basketItems[index].count = Number(this.basketItems[index].count + 1);
    else
      this.basketItems[index].count = Number(this.basketItems[index].count - 1);

    this.calculateTotals();
  }

  calculateSubAmount(count:number, price:number){
    return Number(count*price).toFixed(2)
  }

  calculateTotals(){
    let total=0;
    for(let i=0;i<this.basketItems.length;i++){
      total += Number(this.calculateSubAmount(this.basketItems[i].count, this.basketItems[i].price))
    }

    this.basketAmount=total;

    this.basketService.getServiceFeeByAmount({amount: this.basketAmount}).subscribe(res => {
      this.serviceFee  = res.data
     }) 
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
          this.globalService.refreshBasket({itemAddedToBasket: true})
          this.router.navigate(['/']);
        }) 
      }
    });
    
   
  }
}
