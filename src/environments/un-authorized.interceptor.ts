import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import {catchError, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Injectable()
export class UnAuthorizedInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      headers: request.headers
        .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
        .set('Access-Control-Allow-Origin', '*')
        .set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT')
    });
    return next.handle(request).pipe(
      catchError(err => {
        if(err.status === 401) {
          Swal.fire({
            icon: 'error',
            title: 'İcazəsiz giriş...',
            text: 'Login sehifesinden daxil olun!',
          })
          this.router.navigate(['/login-adminpanel']);

          return of(err);
        }
        throw err;
      })
    );
  }
}
