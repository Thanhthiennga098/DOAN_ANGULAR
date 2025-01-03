import instance from '../../shared/config/instance';
import { queryPagi } from '../../shared/utils/datatype';

const createReportPost = (formData: {
  reson: string;
  post: string;
  comment?: string;
}) => {
  return instance.post(`/report`, formData);
};
const getAllReport = (query: queryPagi) => {
  return instance.get(`/report`, { params: query });
};
const delteteReport = (reportId: string) => {
  return instance.delete(`/report/${reportId}`);
};

export { createReportPost, getAllReport, delteteReport };
