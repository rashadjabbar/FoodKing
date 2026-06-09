import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { _isAuthenticated } from 'src/services/auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PublicLoginGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!_isAuthenticated) {
      Swal.fire({
        icon: 'error',
        title: 'İcazəsiz giriş',
        text: 'Xəbərlər bölməsinə daxil olmaq üçün sistemə giriş edin.',
      });
      this.router.navigate(['/user-login']);
      return false;
    }

    return true;
  }
}
