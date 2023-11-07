import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs-compat/Observable';
import { Category, SubCategory } from 'src/models/category';
import { RequestData } from 'src/models/request';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {


  constructor(private http: HttpClient) { }

  baseUrl = environment.apiCategoryUrl;
  allCategoryUrl = environment.apiCommonUrl

  getCategory(request: RequestData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}GetCategories`, request );
  }

  getAllCategory(): Observable<any> {
    return this.http.get<any>(`${this.allCategoryUrl}ComboBox/GetCategories` );
  }

  getCategoryAndSubCategory(): Observable<any> {
    return this.http.get<any>(`${this.allCategoryUrl}ComboBox/GetCategoryAndSubCategory` );
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

  getSubCategory(request: RequestData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}GetSubCategories`, request );
  }

  changeSubCategoryStatus(status: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}ChangeSubCategoryStatus` ,  status);
  }

}
