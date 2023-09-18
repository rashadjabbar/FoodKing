import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

constructor() { }

  tokenValue = new BehaviorSubject(this.token);

  set token(tk: string) {
    this.tokenValue.next(tk);
    sessionStorage.setItem('token', tk);
  }
  
   get token() {
    return sessionStorage.getItem('token') ?? "";
   }

}
