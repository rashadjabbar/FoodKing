import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { LoginService } from "src/services/login.service";
import Swal from "sweetalert2";
@Injectable({
  providedIn: 'root'
})
export class AdminLogin implements CanActivate{
  constructor(private loginservices: LoginService, private router: Router) {}
  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean  {
    if (!this.loginservices.isLoginnedIn() && sessionStorage.getItem('token') == null) {
      Swal.fire({
        icon: 'error',
        title: 'İcazəsiz giriş...',
        text: 'Login sehifesinden daxil olun!',
      })
      this.router.navigate(['/login-adminpanel']);
      return false;
    }
    
    return true
  }
}
