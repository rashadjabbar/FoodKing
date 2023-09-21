import { Component } from '@angular/core';
import { AllCategory } from 'src/models/category';
import { CategoryService } from 'src/services/category.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(
    private categoryServices: CategoryService) { }
    categories: AllCategory[] = []

    ngOnInit() {
      this.getCategories()
    }
    
  getCategories() {
    this.categoryServices.getAllCategory().subscribe((res: any) => {
      this.categories = res.data
      console.log(res.data)
    })
  }
}
