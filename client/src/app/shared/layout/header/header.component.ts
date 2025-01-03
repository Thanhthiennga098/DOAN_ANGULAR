import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { GlobalService } from '../../../global.service';
import { FormsModule } from '@angular/forms';
import { logoutApi } from '../../../core/service/authService';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  user = JSON.parse(
    localStorage.getItem('user') ||
      '{"userName": "admin", "email": "admin@gmail.com"}'
  );
  searchText: string = '';
  constructor(
    private router: Router,
    private globalService: GlobalService,
    private cookieService: CookieService
  ) {} // Inject Router in constructor

  ngOnInit() {
    // Đăng ký để theo dõi thay đổi của searchText
    this.globalService.getSearchText().subscribe((text) => {
      this.searchText = text; // Cập nhật giá trị searchText khi có thay đổi
    });
  }

  updateSearchText() {
    this.globalService.setSearchText(this.searchText); // Cập nhật giá trị searchText trong service
  }

  getAvatarInitial() {
    return this.user.userName.charAt(0).toUpperCase();
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  async logout() {
    await logoutApi()
      .then((data) => data.data)
      .then((data) => {
        localStorage.removeItem('user');
        this.cookieService.deleteAll();
        this.router.navigate(['/login']);
      });
  }
}
