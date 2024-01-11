import { Component, OnInit } from '@angular/core';
import { BasketService } from 'src/services/public/basket.service';

@Component({
  selector: 'app-daily-report',
  templateUrl: './daily-report.component.html',
  styleUrls: ['./daily-report.component.scss']
})
export class DailyReportComponent implements OnInit {

  constructor(private basketService: BasketService) { }

  productData: any[] =[]

  ngOnInit() {
    this.basketService.getDailyOrderProductList().subscribe(res =>{
      this.productData = res.data
    })
  }

}
