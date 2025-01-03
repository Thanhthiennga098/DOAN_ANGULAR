import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { loginApi } from '../../../core/service/authService';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css',
  imports: [FormsModule],
  providers: [CookieService],
})
export class AdminLoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private cookieService: CookieService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}
  async login() {
    const helper = new JwtHelperService();
    if (!this.email || !this.password) {
      this.snackBar.open('Vui lòng nhập đầy đủ thông tin!', 'Đóng', {
        duration: 3000,
      });
      return;
    }
    try {
      const res = await loginApi({
        email: this.email,
        password: this.password,
      });
      if (res.data.status === 200) {
        const decodedToken = helper.decodeToken(
          res.data.data.tokens.accessToken
        );
        if (decodedToken?.role?.includes('ADMIN')) {
          this.cookieService.set('token', res.data.data.tokens.accessToken);
          this.cookieService.set('userId', res.data.data.user._id);
          localStorage.setItem('user', JSON.stringify(res.data.data.user));
          this.snackBar.open('Đăng nhập thành công!', 'Đóng', {
            duration: 3000,
          });
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/login']);
        }
      } else {
        this.snackBar.open('Đăng nhập thất bại, vui lòng thử lại!', 'Đóng', {
          duration: 3000,
        });
      }
    } catch (error) {
      this.snackBar.open('Lỗi đăng nhập, vui lòng thử lại!', 'Đóng', {
        duration: 3000,
      });
    }
  }
}
