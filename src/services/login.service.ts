import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { LoginResult } from 'src/models/login';
import { showInfoAlert } from 'src/utils/alert';
import Swal from 'sweetalert2';
import { GlobalService } from './global.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  baseUrl = environment.apiAdminAuthUrl;
  loginned!: boolean;

  constructor(private http: HttpClient,
    private globalService: GlobalService,
    private router: Router
    ) {}

  isLoginnedIn(): boolean {
    return this.loginned
  }

  login(data: any) {
    this.http.post<LoginResult>(this.baseUrl + `Auth/login`, data).subscribe({
      next: (result: any) => {
        if (result.status == false) {
          showInfoAlert('Məlumat', result.message, false, true, 'Bağla')
          sessionStorage.removeItem('token')
          return
        }

        this.loginned = result.status
        this.globalService.token = result.data.token!;
        sessionStorage.setItem('token', result.data.token);
        this.router.navigate(['/admin']);
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
}
