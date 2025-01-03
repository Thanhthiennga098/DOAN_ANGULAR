import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { createPostApi, getAllPost } from '../../core/service/postService'; // Import service
import { PostComponent } from '../../shared/post/post.component';
import { postType } from '../../shared/utils/datatype';
import { CommonModule } from '@angular/common';
import { URLAVATAR } from '../../shared/config/constant';
import { GlobalService } from '../../global.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PostComponent, FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(private globalService: GlobalService) {}
  user = JSON.parse(localStorage.getItem('user') || '{}');
  urlAvatar = URLAVATAR;
  searchText = '';
  searchTextSubscription: Subscription = new Subscription();
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

  ngOnInit() {
    this.searchTextSubscription = this.globalService
      .getSearchText()
      .subscribe((text) => {
        this.searchText = text;
        this.loadPosts();
      });
  }
  ngOnDestroy() {
    // Hủy đăng ký để tránh rò rỉ bộ nhớ khi component bị hủy
    if (this.searchTextSubscription) {
      this.searchTextSubscription.unsubscribe();
    }
  }
  onFileChange(event: any): void {
    const files = event.target.files as FileList;
    if (files) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.post.images.push({
            file,
            preview: e.target.result,
          });
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeImage(index: number): void {
    this.post.images.splice(index, 1);
  }

  async submitPost() {
    const formData = new FormData();
    formData.append('title', this.post.title);
    formData.append('content', this.post.content);

    this.post.images.forEach((imageObj) => {
      formData.append('images', imageObj.file, imageObj.file.name);
    });

    const res = await createPostApi(formData);
    if (res.data?.status === 201) {
      this.post = {
        title: '',
        content: '',
        images: [],
      };
      await this.loadPosts();
    }
  }

  async loadPosts() {
    try {
      this.loading = true; // Bật loading khi gọi API
      const formParam = {
        currentPage: this.pagi.currentPage,
        limit: this.pagi.limit,
        searchText: '',
      };
      this.globalService.getSearchText().subscribe((text) => {
        formParam.searchText = text;
      });
      const response = await getAllPost({
        ...formParam,
      });
      if (response.data?.status === 200) {
        this.posts = response.data.data.posts; // Gộp các bài viết mới vào bài viết cũ
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
      const response = await getAllPost(formParam);
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
  async handleNewComment() {
    await this.loadMorePosts();
  }
  getUserInitial(): string {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?._id) {
      return user.userName.charAt(0).toUpperCase();
    }
    return ''; // Trả về chuỗi rỗng nếu không có user hoặc _id
  }
  getUserIdInitial(): string {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?._id) {
      return user._id;
    }
    return ''; // Trả về chuỗi rỗng nếu không có user hoặc _id
  }
}
