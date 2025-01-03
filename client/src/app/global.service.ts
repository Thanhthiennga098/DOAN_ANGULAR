import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'; // Để theo dõi thay đổi của searchText

@Injectable({
  providedIn: 'root', // Điều này giúp dịch vụ có sẵn ở toàn bộ ứng dụng
})
export class GlobalService {
  // Dùng BehaviorSubject để theo dõi sự thay đổi của searchText
  private searchTextSubject = new BehaviorSubject<string>('');

  // Getter để lấy giá trị searchText
  getSearchText() {
    return this.searchTextSubject.asObservable();
  }

  // Setter để cập nhật giá trị searchText
  setSearchText(text: string) {
    this.searchTextSubject.next(text);
  }
}
