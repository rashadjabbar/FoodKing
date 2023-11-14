import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SpinnerService } from 'src/services/spinner.service';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable()
export class UserTypeInterceptor implements HttpInterceptor {

  constructor(
        private router: Router
    ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let data : any = jwt_decode(sessionStorage.getItem('token') as string)
   alert('abc')

    if (data?.userType != '1') 
      this.router.navigate(['']);

    return next.handle(request)
  }
}
