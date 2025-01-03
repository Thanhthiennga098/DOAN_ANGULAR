export interface FormUserLoginType {
  email: string;
  password: string;
}
export interface FormUserRegisterType {
  userName: string;
  email: string;
  password: string;
}
export interface FormUserResetPassword {
  email: string;
  password: string;
}
export interface formPostType {
  title: string;
  content: string;
  images: File[];
}
export interface pagiFormType {
  currentPage: number;
  limit: number;
  searchText?: string;
}
export interface commentType {
  _id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  parent: string | null;
  isEditing?: boolean;
  author: { userName: string; _id: string };
}
export interface postType {
  _id: string;
  title: string;
  content: string;
  images: string[];
  author: {
    _id: string;
    userName: string;
    email: string;
    avatar?: string;
  };
  likes: string[];
  totalComment: number;
  createdAt: string;
  liked: boolean;
  isEdit?: boolean;
  isClearImage?: boolean;
  updateImages?: any[];
}
export interface queryPagi {
  page: number;
  limit: number;
  options?: {};
  searchText?: string;
}
export interface meta {
  total: number;
  limit: number;
  page: number;
  totalPages: 2;
}
