import { Component, HostListener } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { getUserPostApi } from '../../core/service/postService';
import { postType } from '../../shared/utils/datatype';
import { PostComponent } from '../../shared/post/post.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { updateUserProfileApi } from '../../core/service/authService';
import { URLAVATAR } from '../../shared/config/constant';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatButtonModule, PostComponent, CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  user = JSON.parse(localStorage.getItem('user') || '{}');
  urlAvatar = URLAVATAR;
  post = {
    title: '',
    content: '',
    images: [] as { file: File; preview: string }[],
  };
  pagi = {
    currentPage: 1,
    totalItems: 1,
    totalPages: 1,
    limit: 10,
  };
  posts: postType[] = []; // Để lưu các bài viết từ API
  loading = false;
  // Trạng thái modal
  isModalOpen = false;

  // Dữ liệu form
  updatedUser = {
    userName: '',
    email: '',
    avatar: {} as { file: File },
    previewUrl: null,
  };
  openEditModal() {
    this.updatedUser = { ...this.user }; // Sao chép thông tin user
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
  onFileChange(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.updatedUser.previewUrl = e.target.result; // Hiển thị URL ảnh
      };
      this.updatedUser.avatar = {
        file: fileInput.files[0],
      };
      reader.readAsDataURL(file);
    }
  }

  async saveProfile() {
    const formData = new FormData();
    formData.append('userName', this.updatedUser.userName);
    formData.append('email', this.updatedUser.email);
    if (this.updatedUser.avatar?.file) {
      formData.append(
        'avatar',
        this.updatedUser.avatar.file,
        this.updatedUser.avatar.file?.name
      );
    }
    const res = await updateUserProfileApi(formData);
    if (res.data.status === 200) {
      localStorage.setItem('user', JSON.stringify(res.data.data));
      window.location.reload();
    }
    this.closeModal();
  }
  ngOnInit() {
    this.loadPosts();
  }

  async loadPosts() {
    try {
      this.loading = true; // Bật loading khi gọi API
      const formParam = {
        currentPage: this.pagi.currentPage,
        limit: this.pagi.limit,
      };
      const response = await getUserPostApi(formParam);
      if (response.data?.status === 200) {
        this.posts = [...this.posts, ...response.data.data.posts]; // Gộp các bài viết mới vào bài viết cũ
        this.pagi = {
          currentPage: response.data.data.currentPage,
          limit: this.pagi.limit,
          totalItems: response.data.data.totalItems,
          totalPages: response.data.data.totalPages,
        };
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      this.loading = false; // Tắt loading khi hoàn thành
    }
  }
  async deletePostAgn() {
    await this.loadMorePosts();
  }
  // Lắng nghe sự kiện cuộn trên window
  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    const scrollPosition = window.scrollY + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;

    // Kiểm tra xem người dùng đã cuộn đến cuối trang chưa
    if (
      scrollPosition >= pageHeight &&
      !this.loading &&
      this.pagi.currentPage < this.pagi.totalPages
    ) {
      this.loading = true;
      this.loadMorePosts();
    }
  }

  async loadMorePosts() {
    // Tải thêm bài viết khi cuộn đến cuối
    try {
      const formParam = {
        currentPage: this.pagi.currentPage,
        limit: this.pagi.limit + 10, // Tăng limit
      };
      const response = await getUserPostApi(formParam);
      if (response.data?.status === 200) {
        this.posts = [...this.posts, ...response.data.data.posts];
        this.pagi = {
          currentPage: response.data.data.currentPage,
          limit: this.pagi.limit * 2,
          totalItems: response.data.data.totalItems,
          totalPages: response.data.data.totalPages,
        };
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      this.loading = false;
    }
  }
  getUserInitial(): string {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?._id) {
      return user.userName.charAt(0).toUpperCase();
    }
    return ''; // Trả về chuỗi rỗng nếu không có user hoặc _id
  }
  getUserAvatarInitial(): string {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?._id) {
      return user.avatar;
    }
    return ''; // Trả về chuỗi rỗng nếu không có user hoặc _id
  }
}
