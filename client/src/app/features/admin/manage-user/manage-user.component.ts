import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import {
  createNewUser,
  getAllUser,
  lockUserAPi,
  updateUserApi,
} from '../../../core/service/userService';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-manage-user',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
  ],
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css'],
})
export class ManageUserComponent implements OnInit {
  constructor(private snackBar: MatSnackBar) {}
  displayedColumns: string[] = [
    '_id',
    'userName',
    'email',
    'roles',
    'status',
    'createdAt',
    'actions',
  ];
  dataSource: any[] = [];
  searchText: string = '';
  totalRecords: number = 0;
  pageSize: number = 5;
  pageIndex: number = 0;
  isModalOpen = false;
  isEditUser = false;
  userIdEdit = undefined;
  userForm = {
    userName: '',
    email: '',
    roles: [],
  };
  passWordForm = {
    password: '',
    confirmPassword: '',
  };

  ngOnInit() {
    this.loadListUser();
  }

  loadListUser = async () => {
    const response = await getAllUser({
      limit: this.pageSize,
      page: this.pageIndex + 1,
      searchText: this.searchText.trim() ? this.searchText : undefined,
    });
    if (response && response.data) {
      this.dataSource = response.data.data.data;
      this.totalRecords = response.data.data.meta.totalPages;
    }
  };

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadListUser();
  }

  async lockUser(row: any) {
    try {
      const res = await lockUserAPi(row._id);
      if (res.data) {
        this.snackBar.open('Trạng thansi tài khoản thành công!', 'Đóng', {
          duration: 3000,
        });
        this.loadListUser();
      }
    } catch (error) {
      this.snackBar.open('Trạng thansi tài khoản Thất bại!', 'Đóng', {
        duration: 3000,
      });
    }
  }

  editUser(row: (typeof this.dataSource)[0]) {
    this.userForm = {
      userName: row.userName,
      email: row.email,
      roles: row.roles,
    };
    this.userIdEdit = row._id;
    this.isEditUser = true;
    this.isModalOpen = true;
  }

  openAddUserModal() {
    this.isModalOpen = true;
  }

  closeAddUserModal() {
    this.isModalOpen = false;
    this.userForm = {
      email: '',
      roles: [],
      userName: '',
    };
  }
  async addNewUser() {
    if (this.passWordForm.password !== this.passWordForm.confirmPassword) {
      this.snackBar.open('Mật khẩu không trùng khớp!', 'Đóng', {
        duration: 3000,
      });
      return;
    }
    try {
      const res = await createNewUser({
        email: this.userForm.email,
        password: this.passWordForm.password,
        roles: this.userForm.roles,
        userName: this.userForm.userName,
      });
      this.closeAddUserModal();
      if (res.data) {
        this.snackBar.open('Tạo người dùng thành công!', 'Đóng', {
          duration: 3000,
        });
        this.loadListUser();
      }
    } catch (error) {
      this.closeAddUserModal();
      this.snackBar.open(`Vui lòng kiểm tra lại thông tin!`, 'Đóng', {
        duration: 3000,
      });
    }
  }
  async updateUser() {
    try {
      if (this.userIdEdit) {
        const res = await updateUserApi(
          {
            email: this.userForm.email,
            roles: this.userForm.roles,
            userName: this.userForm.userName,
          },
          this.userIdEdit
        );
        if (res.data) {
          this.snackBar.open('Cập nhật người dùng thành công!', 'Đóng', {
            duration: 3000,
          });
          this.loadListUser();
        }
      }
    } catch (error) {
      this.snackBar.open(`Vui lòng kiểm tra lại thông tin!`, 'Đóng', {
        duration: 3000,
      });
    } finally {
      this.userIdEdit = undefined;
      this.isEditUser = false;
      this.closeAddUserModal();
    }
  }
  searchDataByKey = async () => {
    this.loadListUser();
  };
}
