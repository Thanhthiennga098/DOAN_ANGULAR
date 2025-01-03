import { Component } from '@angular/core';
import {
  deleteCommentAPi,
  getAllComment,
} from '../../../core/service/commentService';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-comment',
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
  templateUrl: './manage-comment.component.html',
  styleUrl: './manage-comment.component.css',
})
export class ManageCommentComponent {
  constructor(private snackBar: MatSnackBar) {}
  displayedColumns: string[] = [
    '_id',
    'author',
    'content',
    'postId',
    'postContent',
    'createdAt',
    'actions',
  ];
  searchText = '';
  dataSource: any[] = [];
  totalRecords: number = 0;
  pageSize: number = 5;
  pageIndex: number = 0;
  ngOnInit() {
    this.LoadAllComment();
  }
  LoadAllComment = async () => {
    const response = await getAllComment({
      limit: this.pageSize,
      page: this.pageIndex + 1,
      searchText: this.searchText,
    });
    if (response && response.data) {
      this.dataSource = response.data.data.data;
      this.totalRecords = response.data.data.meta.totalPages;
    }
  };

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.LoadAllComment();
  }

  async deleteComment(row: any) {
    try {
      const response = await deleteCommentAPi(row._id);
      const data = response.data;

      if (data) {
        this.snackBar.open('Delete comment success', 'Đóng', {
          duration: 3000,
        });
        this.LoadAllComment();
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  }
  searchDataByKey = async () => {
    this.LoadAllComment();
  };
}
