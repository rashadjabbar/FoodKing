import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  constructor() { }

  endDate = new Date();
  beginDate = this.endDate.setMonth(this.endDate.getMonth() - 1);
  

  ngOnInit() {
    console.log('beginDate ' + this.beginDate)
    console.log('endDate ' + this.endDate)
  }

}
