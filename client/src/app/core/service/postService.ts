import instance from '../../shared/config/instance';
import { pagiFormType } from '../../shared/utils/datatype';

const createPostApi = (formdata: FormData) => {
  return instance.post('/post', formdata, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
const getAllPost = (formParam: pagiFormType) => {
  return instance.get('/post', { params: formParam });
};
const adminGetAllPost = (formParam: pagiFormType) => {
  return instance.get('/admin-post', { params: formParam });
};
const userLikePostApi = (postId: string) => {
  return instance.put(`/user-like-post/${postId}`);
};
const userCommentPostApi = (
  postId: string,
  formData: { content: string; parent?: string }
) => {
  return instance.put(`/user-comment-post/${postId}`, formData);
};
const userUpdatePostApi = (postId: string, formData: FormData) => {
  return instance.post(`/post/${postId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
const getUserPostApi = (formParam: pagiFormType) => {
  return instance.get('/user-post', { params: formParam });
};
const userDeletePostApi = (postId: string) => {
  return instance.delete(`/post/${postId}`);
};
const adminDeletePostApi = (postId: string) => {
  return instance.delete(`/admin-post/${postId}`);
};

const adminUpdateStatusPostApi = (postId: string) => {
  return instance.put(`/post-lock/${postId}`);
};
export {
  createPostApi,
  getAllPost,
  userLikePostApi,
  userCommentPostApi,
  getUserPostApi,
  userDeletePostApi,
  userUpdatePostApi,
  adminUpdateStatusPostApi,
  adminGetAllPost,
  adminDeletePostApi,
};
