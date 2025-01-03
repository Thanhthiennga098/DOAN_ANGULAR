import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { loginApi } from '../../core/service/authService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [FormsModule],
  providers: [CookieService],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private cookieService: CookieService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  async login() {
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
        this.cookieService.set('token', res.data.data.tokens.accessToken);
        this.cookieService.set('userId', res.data.data.user._id);
        localStorage.setItem('user', JSON.stringify(res.data.data.user));
        this.snackBar.open('Đăng nhập thành công!', 'Đóng', { duration: 3000 });
        this.router.navigate(['/']);
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
