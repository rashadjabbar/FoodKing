import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BasketService } from 'src/services/public/basket.service';
import { DailyProductNotesComponent } from './daily-product-notes/daily-product-notes.component';
import { environment } from 'src/environments/environments';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-daily-report',
  templateUrl: './daily-report.component.html',
  styleUrls: ['./daily-report.component.scss']
})
export class DailyReportComponent implements OnInit {

  constructor(private basketService: BasketService,
    private dialog: MatDialog,) { }

  productData: any[] =[]
  imageIpUrl: string = environment.imageIpUrl

  data?: any;

  ngOnInit() {
    this.data = jwt_decode(localStorage.getItem('token')!)
    this.basketService.getDailyOrderProductList(this.data.userType).subscribe(res =>{
      this.productData = res.data
    })
  }

  openDialog(){
    const dialogRef = this.dialog.open(DailyProductNotesComponent, {
      height: 'max-content',
      width: '20%',
      hasBackdrop: true,
      disableClose: true,
      autoFocus: false
    })

    dialogRef.afterClosed().subscribe(result => {
      this.basketService.getDailyOrderProductList(this.data.userType).subscribe(res =>{
        this.productData = res.data
      })
    });
  }

}
