import { MatSnackBar } from '@angular/material/snack-bar';
import { URLAVATAR } from './../config/constant';
import { commentType } from './../utils/datatype';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { postType } from '../utils/datatype';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
  userCommentPostApi,
  userDeletePostApi,
  userLikePostApi,
  userUpdatePostApi,
} from '../../core/service/postService';
import { URLIMAGE } from '../config/constant';
import { FormsModule } from '@angular/forms';
import {
  deleteCommentAPi,
  getCommentOffPostApi,
  updateCommentAPi,
} from '../../core/service/commentService';
import { createReportPost } from '../../core/service/reportService';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent {
  constructor(private snackBar: MatSnackBar) {}
  @Input() postData: postType = {
    _id: '',
    title: '',
    content: '',
    images: [],
    author: {
      _id: '',
      userName: '',
      email: '',
    },
    likes: [],
    totalComment: 0,
    createdAt: '',
    liked: false,
    isEdit: false,
    updateImages: [],
  };
  listComment = [] as commentType[];
  @Input() isAuthor: boolean = false;
  @Output() deletePostAgn = new EventEmitter<void>();

  // Khởi tạo số lượng like và comment từ postData nếu có
  isCommentModalOpen = false;
  newCommentText = '';

  // URL để hiển thị ảnh
  URLIMAGE = URLIMAGE;
  URLAVATAR = URLAVATAR;
  // Modal states
  isModalOpen: boolean = false;
  currentImageIndex: number = 0;
  openedMenuId: string | null = null;
  openPostMenuId: string | null = null;
  isReportModalOpen = false;
  reportContent = '';
  commnetReport = '';

  async fetchCommentPost() {
    const res = await getCommentOffPostApi(this.postData._id);
    if (res.data?.status === 200) {
      this.listComment = res.data?.data;
    }
  }
  async openCommentModal() {
    this.isCommentModalOpen = true;
    await this.fetchCommentPost();
  }

  closeCommentModal() {
    this.isCommentModalOpen = false;
  }

  // Hàm xử lý like post
  async likePost() {
    await userLikePostApi(this.postData._id);
    this.postData.liked = !this.postData.liked;
    if (this.postData.liked) {
      this.postData.likes.push('123');
    } else {
      this.postData.likes.pop();
    }
  }
  // Toggle menu
  toggleOptionsMenu(commentId: string) {
    this.openedMenuId = this.openedMenuId === commentId ? null : commentId;
  }
  toggleOptionsPostMenu(postId: string) {
    this.openPostMenuId = this.openPostMenuId === postId ? null : postId;
  }

  // Xóa bình luận
  async deleteComment(commentId: string) {
    try {
      const res = await deleteCommentAPi(commentId);
      if (res.data?.status === 200) {
        // await this.commentService.deleteComment(commentId); // API call để xóa
        this.listComment = this.listComment.filter((c) => c._id !== commentId); // Xóa bình luận khỏi danh sách
        this.postData.totalComment--;
        this.openedMenuId = null; // Đóng menu
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  }
  async deletePost(postId: string) {
    try {
      const res = await userDeletePostApi(postId);
      if (res.data?.status === 200) {
        this.deletePostAgn.emit();
        this.openPostMenuId = null;
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  }
  async editPost(postId: string) {
    this.postData.isEdit = true;
    this.openPostMenuId = null;
  }
  clearImg() {
    this.postData.images = [];
    this.postData.isClearImage = true;
  }
  onFileChange(event: any): void {
    const files = event.target.files as FileList;
    if (files) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          if (this.postData.updateImages) {
            this.postData.updateImages.push({
              file,
              preview: e.target.result,
            });
          } else {
            this.postData.updateImages = [
              {
                file,
                preview: e.target.result,
              },
            ];
          }
        };
        reader.readAsDataURL(file);
      });
    }
  }
  removeImage(index: number): void {
    if (this.postData.updateImages) this.postData.updateImages.splice(index, 1);
  }
  async saveEditPost() {
    const formData = new FormData();
    formData.append('title', this.postData.title);
    formData.append('content', this.postData.content);
    if (this.postData.updateImages) {
      this.postData.updateImages.forEach((imageObj) => {
        formData.append('images', imageObj.file, imageObj.file.name);
      });
    } else if (!this.postData.isClearImage) {
      formData.append('noUpdateImage', '1');
    }
    const res = await userUpdatePostApi(this.postData._id, formData);
    if (res.data?.status === 200) {
      window.location.reload();
    }
  }
  // Chỉnh sửa bình luận
  editComment(comment: commentType) {
    comment.isEditing = true; // Thêm trạng thái chỉnh sửa
    this.openedMenuId = null; // Đóng menu
  }
  cancelEditPost() {
    window.location.reload();
  }
  // Lưu chỉnh sửa
  async saveEditComment(comment: commentType) {
    try {
      const res = await updateCommentAPi(comment._id, {
        content: comment.content,
      }); // API call để cập nhật bình luận
      if (res.data?.status === 200) {
        comment.isEditing = false; // Tắt trạng thái chỉnh sửa
      }
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  }

  // Hủy chỉnh sửa
  async cancelEditComment(comment: commentType) {
    comment.isEditing = false; // Tắt trạng thái chỉnh sửa
    await this.fetchCommentPost();
  }
  async addComment() {
    if (this.newCommentText.trim()) {
      const res = await userCommentPostApi(this.postData._id, {
        content: this.newCommentText,
      });
      this.newCommentText = ''; // Clear the input field
      if (res.data) {
        this.postData.totalComment++;
        await this.fetchCommentPost();
      }
    }
  }

  // Mở modal và hiển thị ảnh đã click
  openImageModal(index: number) {
    this.isModalOpen = true;
    this.currentImageIndex = index;
  }

  // Đóng modal
  closeModal() {
    this.isModalOpen = false;
  }

  // Chuyển đến ảnh trước
  prevImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    } else {
      this.currentImageIndex = this.postData.images.length - 1;
    }
  }

  // Chuyển đến ảnh tiếp theo
  nextImage() {
    if (this.currentImageIndex < this.postData.images.length - 1) {
      this.currentImageIndex++;
    } else {
      this.currentImageIndex = 0;
    }
  }
  openReportModal(commentId?: string) {
    if (commentId) this.commnetReport = commentId;
    this.isReportModalOpen = true;
  }

  closeReportModal() {
    this.isReportModalOpen = false;
    this.reportContent = ''; // Clear the input
  }

  async submitReport() {
    if (this.reportContent.trim()) {
      const res = await createReportPost({
        post: this.postData._id,
        reson: this.reportContent,
        comment: this.commnetReport ? this.commnetReport : undefined,
      });
      this.openPostMenuId = null;
      this.openedMenuId = null;
      if (res.data) {
        this.snackBar.open('Báo cáo thành công!', 'Đóng', {
          duration: 3000,
        });
      }
      this.closeReportModal();
    } else {
      alert('Vui lòng nhập nội dung báo cáo!');
    }
  }
  // Trả về URL của ảnh hiện tại
  get currentImage() {
    return `${this.URLIMAGE}/${this.postData.images[this.currentImageIndex]}`;
  }
  getUserInitial(): string {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?._id) {
      return user._id;
    }
    return ''; // Trả về chuỗi rỗng nếu không có user hoặc _id
  }
}
