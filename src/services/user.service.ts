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
import { ChangePasswordModel } from 'src/models/changePassword';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OtpComponent } from 'src/app/public-auth/user-login/otp/otp.component';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  baseUrl = environment.apiAdminAuthUrl;
  loginned!: boolean;

  constructor(private http: HttpClient,
    private globalService: GlobalService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  otp_dialogRef?: MatDialogRef<OtpComponent>;
  isLoginnedIn(): boolean {
    return this.loginned
  }

  login(data: any) {
    this.http.post<LoginResult>(this.baseUrl + `Auth/login`, data).subscribe({
      next: (result: any) => {
        if (result.status == false) {
          showInfoAlert('Məlumat', result.message, false, true, 'Bağla')
          localStorage.removeItem('token')
          return
        }
        data = jwt_decode(result.data.token)
        this.globalService.getUserData(data);
        this.loginned = result.status
        // this.globalService.token = result.data.token!;
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('notificationPlayed', 'false')

        this.authService.identityCheck();

        if (data.userType == '1') {
          this.router.navigate(['/admin']);
        } else this.router.navigate(['']);
      },
      error: (res: any) => {
        localStorage.removeItem('token')
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
          localStorage.removeItem('token')
          return
        }

        this.loginned = result.status
        this.globalService.token = result.data.token!;
        // localStorage.setItem('token', result.data.token);
        // this.router.navigate(['/']);
        this.otp_dialogRef = this.dialog.open(OtpComponent, {
          disableClose: true,
          hasBackdrop: true,
          width: '100%',
          height: '100vh',
          maxWidth: '100vw',
          autoFocus: false,
          data: {
            userId: result.data
          }
        })
      },
      error: (res: any) => {
        localStorage.removeItem('token')
        Swal.fire({
          icon: 'error',
          title: 'Xəta',
          text: res.error.message,
          showConfirmButton: true,
          confirmButtonText: 'Bağla'
        })
      },
    })
  }

  logout(): Observable<any> {
    return this.http.get<any>(this.baseUrl + `Auth/logout`);
  }

  changePassword(model: Partial<ChangePasswordModel>): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}Global/ChangeUserPassword`, model);
  }

  getUserInfo(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Global/GetUserInfo`);
  }

  saveUserInfo(model: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}Global/UpdateUser`, model);
  }

  registrationConfirmation(model: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}Auth/RegistrationConfirmation`, model);
  }
}
