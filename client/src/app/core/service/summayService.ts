import instance from '../../shared/config/instance';

const getTotalSumary = () => {
  return instance.get(`/summary/total`);
};
const getPostSummary = (type: string) => {
  return instance.get(`/summary/post/${type}`);
};
const getCommentSummary = (type: string) => {
  return instance.get(`/summary/comment/${type}`);
};
const getReportSummary = (type: string) => {
  return instance.get(`/summary/report/${type}`);
};
const getUserSummary = (type: string) => {
  return instance.get(`/summary/user/${type}`);
};
export {
  getTotalSumary,
  getCommentSummary,
  getReportSummary,
  getPostSummary,
  getUserSummary,
};
