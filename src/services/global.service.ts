import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

export class User{
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

constructor() { }

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

 getCategoryId(model: {catId: number}) {
    this.categoryId.next(model) 
  }
  
  getUserData(model: User){
    this.userData.next(model)
  }



}
