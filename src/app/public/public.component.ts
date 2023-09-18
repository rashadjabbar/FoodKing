import { Component } from '@angular/core';
import { AllCategory } from 'src/models/category';
import { CategoryService } from 'src/services/category.service';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss']
})
export class PublicComponent {

  constructor(
    private categoryServices: CategoryService) { }
    protocolData: AllCategory[] = []

    ngOnInit() {
      this.getProtocolData()
    }
    
  getProtocolData() {
    this.categoryServices.getAllCategory().subscribe((data: AllCategory[]) => {
      console.log(data)
    })
  }
}
