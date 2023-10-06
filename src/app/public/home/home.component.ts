import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AllCategory, AllCategoryBrowse } from 'src/models/category';
import { ProductBrowseData } from 'src/models/product';
import { CategoryService } from 'src/services/category.service';
import { ProductService } from 'src/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(
    private categoryServices: CategoryService,
    private productService: ProductService) { }

  categories: AllCategoryBrowse[] = []

  requestData: any = {
    nextPageNumber: 1,
    visibleItemCount: 6,
  }

  catId = 0
  subCatId = 0

  productData: ProductBrowseData[] = []
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  length!: number;
  pageSize = 6;
  pageSizeOptions: number[] = [3, 6, 9];
  pageEvent!: PageEvent;
  dataSource = new MatTableDataSource<ProductBrowseData>(this.productData);


  ngOnInit() {
    this.dataSource.paginator = this.paginator;

    this.getCategories()
    this.getProduct()
  }

  onChangePage(pe: PageEvent) {
    this.requestData.nextPageNumber = pe.pageIndex + 1
    this.requestData.visibleItemCount = pe.pageSize
    console.log(pe)
    this.getProduct()
  }

  getCategories() {
    this.categoryServices.getCategoryAndSubCategory().subscribe((res: any) => {
      this.categories = res.data
      console.log(res.data)
    })
  }



  categoryClick(categoryId: any){
    this.catId = categoryId
    this.subCatId = 0
    this.getProduct()

  }

  subCategoryClick(catId: any , subCatId: any){
    this.catId = catId
    this.subCatId = subCatId
    this.getProduct()
  }

  getProduct() {
    this.productService.getProductClientBrowseData(this.requestData, this.catId, this.subCatId).subscribe({
      next: res => {
        console.log(res.data.result)
        this.productData = res.data.result
        this.length = res.data.count
      }
    })
  }
}
