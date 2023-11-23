import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environments';

export class User {
  name?: string;
  userId?: number;
  userType?: number;
  fullName?: string;
  passwordStatus?: boolean;
  nbf?: number;
  exp?: number;
  iss?: string;
  aud?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor(private http: HttpClient) { }

  baseUrl = environment.apiCommonUrl;


  private basketEmitter = new BehaviorSubject({ itemAddedToBasket: false });
  basketObservable$ = this.basketEmitter.asObservable();

  tokenValue = new BehaviorSubject(this.token);

  private categoryId = new BehaviorSubject({ catId: 0 });
  data$ = this.categoryId.asObservable();

  private userData = new BehaviorSubject(new User);
  userData$ = this.userData.asObservable();

  set token(tk: string) {
    this.tokenValue.next(tk);
    sessionStorage.setItem('token', tk);
  }

  get token() {
    return sessionStorage.getItem('token') ?? "";
  }


  refreshBasket(model: { itemAddedToBasket: boolean }) {
    this.basketEmitter.next(model)
  }

  getCategoryId(model: { catId: number }) {
    this.categoryId.next(model)
  }

  getUserData(model: User) {
    this.userData.next(model)
  }

  getAllUser() {
    return this.http.get<any>(`${this.baseUrl}ComboBox/GetAllUsers`);
  }

  getAllStatus() {
    return this.http.get<any>(`${this.baseUrl}ComboBox/GetAllStatuses`);
  }

  getProductsAutoComplate(filter: string) {
    return this.http.get<any>(`${this.baseUrl}AutoComplete/GetProducts?filter=${filter}`);
  }
}
