import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { Product } from 'src/models/product';
import { RequestData } from 'src/models/request';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  baseUrl = environment.apiProductUrl;
  allCategoryUrl = environment.apiCommonUrl

  getProduct(request: RequestData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}GetProductBrowseData`, request );
  }

  getAllCategory(): Observable<any> {
    return this.http.get<any>(`${this.allCategoryUrl}ComboBox/GetCategories` );
  }

  getAllSubCategory(): Observable<any> {
    return this.http.get<any>(`${this.allCategoryUrl}ComboBox/GetSubCategories` );
  }
  
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}GetProductById?productId=${id}`);
  }

  changeProductStatus(status: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}ChangeStatus` ,  status);
  }

  postandputProduct(category: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}SaveProduct`, category);
  }

  // CLIENT
  getProductClientBrowseData(request: RequestData, catId: number , subCatId: number, orderByProducts: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}GetProductClientBrowseData?subCategoryId=${subCatId}&categoryId=${catId}&orderByProducts=${orderByProducts}`, request );
  }

  SaveWishList(productId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}SaveWishList/${productId}`, null );
  }

  getUserWishList(): Observable<any> {
    return this.http.get<Product>(`${this.baseUrl}GetWishListByUserId`);
  }
}
