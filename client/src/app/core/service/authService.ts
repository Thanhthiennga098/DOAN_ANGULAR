import instance from '../../shared/config/instance';
import {
  FormUserLoginType,
  FormUserRegisterType,
  FormUserResetPassword,
} from '../../shared/utils/datatype';

const loginApi = (formdata: FormUserLoginType) => {
  return instance.post('/user/login', formdata);
};
const registerApi = (formdata: FormUserRegisterType) => {
  return instance.post('/user/register', formdata);
};
const logoutApi = () => {
  return instance.post('/user/logout');
};

const updateUserProfileApi = (formData: FormData) => {
  return instance.post('/user/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
const userForgotPasswordApi = (formData: FormUserResetPassword) => {
  return instance.post('/user/forgot-password', formData);
};
export {
  loginApi,
  registerApi,
  updateUserProfileApi,
  userForgotPasswordApi,
  logoutApi,
};
