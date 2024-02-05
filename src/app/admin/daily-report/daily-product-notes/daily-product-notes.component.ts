import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DailyReportComponent } from '../daily-report.component';
import { BasketService } from 'src/services/public/basket.service';

@Component({
  selector: 'app-daily-product-notes',
  templateUrl: './daily-product-notes.component.html',
  styleUrls: ['./daily-product-notes.component.scss']
})
export class DailyProductNotesComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DailyReportComponent>,
    public basketService: BasketService
  ) { }

  notes: any

  ngOnInit() {
    this.basketService.getDailyOrderNotes().subscribe(res =>{
      this.notes = res.data
    })
  }

}
