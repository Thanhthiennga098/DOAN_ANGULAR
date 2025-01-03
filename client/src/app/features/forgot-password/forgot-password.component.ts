import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { userForgotPasswordApi } from '../../core/service/authService';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  constructor(private router: Router, private snackBar: MatSnackBar) {}

  async resetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.snackBar.open(
        'Mật khẩu không trùng nhau vui lòng thử lại!',
        'Đóng',
        {
          duration: 3000,
        }
      );
      return;
    }
    try {
      const res = await userForgotPasswordApi({
        email: this.email,
        password: this.newPassword,
      });
      if (res.data.status === 200) {
        this.router.navigate(['/login']);
      }
    } catch (error) {
      this.snackBar.open(
        'Thông tin không chính xác, vui lòng thử lại!',
        'Đóng',
        {
          duration: 3000,
        }
      );
    }
  }
}
