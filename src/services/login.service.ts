import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { LoginResult } from 'src/models/login';
import { showInfoAlert } from 'src/utils/alert';
import Swal from 'sweetalert2';
import { GlobalService } from './global.service';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})

export class LoginService {

  baseUrl = environment.apiAdminAuthUrl;
  loginned!: boolean;

  constructor(private http: HttpClient,
    private globalService: GlobalService,
    private authService: AuthService,
    private router: Router
    ) {}

  isLoginnedIn(): boolean {
    return this.loginned
  }

  login(data: any) {
    this.http.post<LoginResult>(this.baseUrl + `Auth/login`, data).subscribe({
      next: (result: any) => {
        if (result.status == false) {
          debugger
          showInfoAlert('Məlumat', result.message, false, true, 'Bağla')
          sessionStorage.removeItem('token')
          return
        }
        data = jwt_decode(result.data.token)
        this.globalService.getUserData(data);
        this.loginned = result.status
        // this.globalService.token = result.data.token!;
        sessionStorage.setItem('token', result.data.token);

        this.authService.identityCheck();

        if (data.userType == '1') {
          this.router.navigate(['/admin']);
        }else this.router.navigate(['']);
      },
      error: (res: any) => {
        sessionStorage.removeItem('token')
        Swal.fire({
          icon: 'error',
          title: res.error.message,
          showConfirmButton: true,
          confirmButtonText: 'Bağla'
        })
      }
    })
  }

  userRegister(data: any) {
    this.http.post<LoginResult>(this.baseUrl + `Auth/register`, data).subscribe({
      next: (result: any) => {
        if (result.status == false) {
          showInfoAlert('Məlumat', result.message, false, true, 'Bağla')
          sessionStorage.removeItem('token')
          return
        }

        this.loginned = result.status
        this.globalService.token = result.data.token!;
        // sessionStorage.setItem('token', result.data.token);
        this.router.navigate(['/']);
      },
      error: (res: any) => {
        sessionStorage.removeItem('token')
        Swal.fire({
          icon: 'error',
          title: 'Xəta',
          text: res.error.message ,
          showConfirmButton: true,
          confirmButtonText: 'Bağla'
        })
      }
    })
  }

}
