import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import {
  adminDeletePostApi,
  adminGetAllPost,
  adminUpdateStatusPostApi,
} from '../../../core/service/postService';
import { URLIMAGE } from '../../../shared/config/constant';

@Component({
  selector: 'app-manage-post',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
  ],
  templateUrl: './manage-post.component.html',
  styleUrl: './manage-post.component.css',
})
export class ManagePostComponent implements OnInit {
  constructor(private snackBar: MatSnackBar) {}

  displayedColumns: string[] = [
    '_id',
    'author',
    'content',
    'title',
    'images',
    'totalComment',
    'totalReport',
    'likes',
    'status',
    'actions',
  ];
  searchText: string = '';
  URLIMAGE = URLIMAGE;
  dataSource: any[] = [];
  totalRecords: number = 0;
  pageSize: number = 5;
  pageIndex: number = 0;
  ngOnInit() {
    this.LoadAllPost();
  }
  LoadAllPost = async () => {
    const response = await adminGetAllPost({
      limit: this.pageSize,
      currentPage: this.pageIndex + 1,
      searchText: this.searchText.trim() ? this.searchText : undefined,
    });
    if (response && response.data) {
      this.dataSource = response.data.data.posts;
      this.totalRecords = response.data.data.totalPages;
    }
  };

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.LoadAllPost();
  }

  async deletePost(row: any) {
    try {
      const res = await adminDeletePostApi(row._id);
      if (res.data) {
        this.snackBar.open('Cập nhật trạng thái thành công!', 'Đóng', {
          duration: 3000,
        });
        this.LoadAllPost();
      }
    } catch (error) {
      this.snackBar.open('Cập nhật trạng thái Thất bại!', 'Đóng', {
        duration: 3000,
      });
    }
  }

  async lockPost(row: any) {
    try {
      const res = await adminUpdateStatusPostApi(row._id);
      if (res.data) {
        this.snackBar.open('Cập nhật trạng thái thành công!', 'Đóng', {
          duration: 3000,
        });
        this.LoadAllPost();
      }
    } catch (error) {
      this.snackBar.open('Cập nhật trạng thái Thất bại!', 'Đóng', {
        duration: 3000,
      });
    }
  }
  searchDataByKey = async () => {
    this.LoadAllPost();
  };
}
