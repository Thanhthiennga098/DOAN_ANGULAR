import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { getAllPost } from '../../../core/service/postService';
import {
  delteteReport,
  getAllReport,
} from '../../../core/service/reportService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-report',
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
  templateUrl: './manage-report.component.html',
  styleUrl: './manage-report.component.css',
})
export class ManageReportComponent {
  constructor(private snackBar: MatSnackBar) {}
  displayedColumns: string[] = [
    '_id',
    'reson',
    'author',
    'post',
    'postId',
    'comment',
    'commentId',
    'createdAt',
    'actions',
  ];
  searchText = '';
  dataSource: any[] = [];
  totalRecords: number = 0;
  pageSize: number = 5;
  pageIndex: number = 0;
  ngOnInit() {
    this.LoadAllReport();
  }
  LoadAllReport = async () => {
    const response = await getAllReport({
      limit: this.pageSize,
      page: this.pageIndex + 1,
      searchText: this.searchText,
    });
    if (response && response.data) {
      this.dataSource = response.data.data.data;
      this.totalRecords = response.data.data.totalPages;
    }
  };

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.LoadAllReport();
  }

  async deleteReport(row: any) {
    try {
      const res = await delteteReport(row._id);
      if (res.data) {
        this.snackBar.open('Cập nhật trạng thái thành công!', 'Đóng', {
          duration: 3000,
        });
        this.LoadAllReport();
      }
    } catch (error) {
      this.snackBar.open('Cập nhật trạng thái Thất bại!', 'Đóng', {
        duration: 3000,
      });
    }
  }
  searchDataByKey = async () => {
    this.LoadAllReport();
  };
}
