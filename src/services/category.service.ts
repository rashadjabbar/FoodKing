import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs-compat/Observable';
import { AllCategory, Category, SubCategory } from 'src/models/category';
import { Request } from 'src/models/request';
import { GlobalPositionStrategy } from '@angular/cdk/overlay';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {


  constructor(private http: HttpClient,
    private globalService: GlobalService) { }

  baseUrl = environment.apiCategoryUrl;
  allCategoryUrl = environment.apiCommonUrl

  token = sessionStorage.getItem('token')

  // postToken = {headers: {'Authorization': `Bearer ${this.token}`}}

  getCategory(request: Request): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}GetCategories`, request );
  }

  getAllCategory(): Observable<any> {
    return this.http.get<any>(`${this.allCategoryUrl}ComboBox/GetCategories` );
  }

  postandputCategory(category: Category): Observable<any> {
    return this.http.post<Category>(`${this.baseUrl}SaveCategory`, category);
  }

  saveSubCategory(subCategory: SubCategory): Observable<any> {
    return this.http.post<Category>(`${this.baseUrl}SaveSubCategory`, subCategory);
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}GetCategoryById?categoryId=${id}`);
  }

  GetSubCategoryById(id: number): Observable<SubCategory> {
    return this.http.get<Category>(`${this.baseUrl}GetSubCategoryById?subCategoryId=${id}`);
  }

  changeCategoryStatus(status: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}ChangeStatus` ,  status);
  }

  getSubCategory(request: Request): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}GetSubCategories`, request );
  }

  changeSubCategoryStatus(status: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}ChangeSubCategoryStatus` ,  status);
  }

}
