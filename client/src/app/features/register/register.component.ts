import { MatSnackBar } from '@angular/material/snack-bar';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { registerApi } from '../../core/service/authService';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [FormsModule],
})
export class RegisterComponent {
  userName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private router: Router, private snackBar: MatSnackBar) {}

  async register() {
    if (
      !this.userName ||
      !this.email ||
      !this.password ||
      !this.confirmPassword
    ) {
      this.snackBar.open('Vui lòng nhập đầy đủ thông tin!', '', {
        duration: 3000,
      });
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.snackBar.open('Mật khẩu xác nhận không khớp!', '', {
        duration: 3000,
      });
      return;
    }

    try {
      const res = await registerApi({
        email: this.email,
        password: this.password,
        userName: this.userName,
      });

      if (res?.status === 201) {
        this.snackBar.open('Đăng ký thành công!', '', { duration: 3000 });
        this.router.navigate(['/login']);
      } else {
        this.snackBar.open('Đăng ký thất bại!', '', { duration: 3000 });
      }
    } catch (error) {
      this.snackBar.open('Lỗi khi đăng ký!', '', { duration: 3000 });
    }
  }
}
