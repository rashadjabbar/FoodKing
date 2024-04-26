import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { RequestData } from 'src/models/request';

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
  balance?: number
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
    localStorage.setItem('token', tk);
  }

  get token() {
    return localStorage.getItem('token') ?? "";
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
  
  getUserDebt(userId: number) {
    return this.http.get<any>(`${environment.apiAdminAuthUrl}Global/GetUserDebt?userId=${userId}`);
  }

  getUserBalance() {
    return this.http.get<any>(`${environment.apiAdminAuthUrl}Global/GetUserBalance`);
  }

  saveContactUs(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiContactUsUrl}/AddContactUs`, data);
  }

  getContactUsSubjects() {
    return this.http.get<any>(`${this.baseUrl}ComboBox/GetContactUsSubjects`);
  }
}
