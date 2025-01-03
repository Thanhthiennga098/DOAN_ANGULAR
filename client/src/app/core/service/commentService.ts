import instance from '../../shared/config/instance';
import { queryPagi } from '../../shared/utils/datatype';

const getCommentOffPostApi = (postId: string) => {
  return instance.get(`/comment/${postId}`);
};
const deleteCommentAPi = (commentId: string) => {
  return instance.delete(`/comment/${commentId}`);
};
const updateCommentAPi = (commentId: string, formData: { content: string }) => {
  return instance.put(`/comment/${commentId}`, formData);
};
const getAllComment = (query: queryPagi) => {
  return instance.get(`/comment`, { params: query });
};
export {
  getCommentOffPostApi,
  deleteCommentAPi,
  updateCommentAPi,
  getAllComment,
};
