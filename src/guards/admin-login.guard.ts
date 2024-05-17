import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { UserService } from "src/services/user.service";
import Swal from "sweetalert2";
import jwt_decode from 'jwt-decode';
import { _isAuthenticated } from "src/services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AdminLogin implements CanActivate{
  constructor(private loginservices: UserService, private router: Router) {}
  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean  {
    //if (!this.loginservices.isLoginnedIn() && localStorage.getItem('token') == null) {
      if (!_isAuthenticated){
      Swal.fire({
        icon: 'error',
        title: 'İcazəsiz giriş...',
        text: 'Login sehifesinden daxil olun!',
      })
       this.router.navigate(['/user-login']);
      return false;
    }
    
    let data : any = jwt_decode(localStorage.getItem('token') as string)
    
    if (data?.userType != '1' && data?.userType != '4'){
      this.router.navigate(['']);
      return false;
    }

    return true
  }
}
