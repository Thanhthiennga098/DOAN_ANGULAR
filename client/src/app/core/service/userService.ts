import instance from '../../shared/config/instance';
import { queryPagi } from '../../shared/utils/datatype';

const getAllUser = (query: queryPagi) => {
  return instance.get(`/user`, { params: query });
};
const createNewUser = (payload: {
  userName: string;
  email: string;
  password: string;
  roles: string[];
}) => {
  return instance.post(`/user`, payload);
};
const updateUserApi = (
  payload: {
    userName: string;
    email: string;
    roles: string[];
  },
  userId: string
) => {
  return instance.put(`/user/${userId}`, payload);
};
const lockUserAPi = (userId: string) => {
  return instance.put(`/user/lock/${userId}`);
};

export { getAllUser, createNewUser, updateUserApi, lockUserAPi };
