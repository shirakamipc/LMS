import { AuthApi } from 'Apis/AuthApi';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from 'Context/AuthContext';

const schema = yup.object({
  email: yup.string().email('Nhập vào dạng email').required('Không được để trống'),
  password: yup.string().required('Không được để trống'),
});

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema)
  });

  const client = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const { login: authLogin } = useAuth();

  const submitForm = async (data) => {
    try {
      const response = await AuthApi.login(data);
      const { access_token, refresh_token, user } = response.data;

      // Use AuthContext login method
      authLogin(user, access_token, refresh_token);

      // Update react-query cache
      client.setQueryData('current_user', user);

      toast.success("Đăng nhập thành công");

      // Redirect to the intended page or home
      const from = location.state?.from?.pathname || '/';
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Đăng nhập thất bại");
    }
  };

  return (
    <>
      <h3 className='text-2xl md:text-3xl font-bold mb-10'>Đăng nhập vào Hệ thống</h3>
      <form onSubmit={handleSubmit(submitForm)} className='w-full flex flex-col items-center'>
        <input
          type='text'
          className='w-full sm:w-8/12 px-4 py-2 rounded-full bg-slate-200 mb-4 focus:outline-orange-400'
          placeholder='Nhập vào email của bạn'
          {...register('email')}
        />
        <p className='sm:ml-[-35%] pb-2 text-sm text-right text-red-500 font-medium'>{errors.email?.message}</p>

        <input
          type='password'
          className='w-full sm:w-8/12 px-4 py-2 rounded-full bg-slate-200 mb-4 focus:outline-orange-400'
          placeholder='Nhập vào mật khẩu'
          {...register('password')}
        />
        <p className='sm:ml-[-35%] pb-2 text-sm text-right text-red-500 font-medium'>{errors.password?.message}</p>

        <button
          className='w-full sm:w-8/12 text-center py-2 bg-gradient-to-tr from-[#2cccff] to-[#22dfbf] text-white rounded-md font-semibold'
          type='submit'
        >
          Đăng nhập
        </button>
      </form>
      <p className='pt-5 font-medium'>
        Bạn chưa có tài khoản?
        <Link className='pl-3 text-orange-400 font-bold' to='/auth/register'>
          Đăng Ký
        </Link>
      </p>
    </>
  );
}
