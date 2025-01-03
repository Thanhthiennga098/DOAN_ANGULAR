import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthGuard implements CanActivate {
  constructor(private router: Router, private cookieService: CookieService) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    const helper = new JwtHelperService();
    const token = this.cookieService.get('token');
    if (token && !helper.isTokenExpired(token)) {
      const decodedToken = helper.decodeToken(token);
      if (decodedToken?.role?.includes('ADMIN')) {
        return true;
      }
    }
    this.router.navigate(['/login']);
    return false;
  }
}
