import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BasketService } from 'src/services/public/basket.service';
import { DailyProductNotesComponent } from './daily-product-notes/daily-product-notes.component';

@Component({
  selector: 'app-daily-report',
  templateUrl: './daily-report.component.html',
  styleUrls: ['./daily-report.component.scss']
})
export class DailyReportComponent implements OnInit {

  constructor(private basketService: BasketService,
    private dialog: MatDialog,) { }

  productData: any[] =[]

  ngOnInit() {
    this.basketService.getDailyOrderProductList().subscribe(res =>{
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
      this.basketService.getDailyOrderProductList().subscribe(res =>{
        this.productData = res.data
      })
    });
  }

}
