import { AuthApi } from 'Apis/AuthApi';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from 'Context/AuthContext';

const schema = yup.object({
  fullName: yup.string().required('Không được để trống'),
  email: yup.string().email('Nhập vào dạng email').required('Không được để trống'),
  password: yup.string().required('Không được để trống'),
  retype_password: yup
    .string()
    .oneOf([yup.ref('password')], 'Mật khẩu không khớp')
    .required('Không được để trống'),
});

export default function Register() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const submitForm = async (data) => {
    try {
      // Remove retype_password field before sending to API
      const { retype_password, ...registerData } = data;
      const response = await AuthApi.register(registerData);

      toast.success(response.data?.message || "Đăng ký thành công");

      // Auto login after successful registration
      if (response.data?.access_token && response.data?.user) {
        const { access_token, refresh_token, user } = response.data;
        authLogin(user, access_token, refresh_token);

        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        // If no auto-login, redirect to login page
        setTimeout(() => {
          navigate('/auth/login');
        }, 1000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Đăng ký thất bại");
    }
  };

  return (
    <>
      <h3 className='text-2xl md:text-3xl font-bold mb-10'>Đăng ký tài khoản Hệ thống</h3>
      <form onSubmit={handleSubmit(submitForm)} className='flex flex-col items-center w-full'>
        <input
          {...register('fullName')}
          type='text'
          className='w-full sm:w-8/12 px-4 py-2 rounded-full bg-slate-200 mb-4 focus:outline-orange-400'
          placeholder='Nhập họ tên'
        />
        <p className='sm:ml-[-35%] pb-2 text-sm text-right text-red-500 font-medium'>{errors.fullName?.message}</p>
        <input
          {...register('email')}
          type='text'
          className='w-full sm:w-8/12 px-4 py-2 rounded-full bg-slate-200 mb-4 focus:outline-orange-400'
          placeholder='Nhập vào email'
        />
        <p className='sm:ml-[-35%] pb-2 text-sm text-right text-red-500 font-medium'>{errors.email?.message}</p>
        <input
          {...register('password')}
          type='password'
          className='w-full sm:w-8/12 px-4 py-2 rounded-full bg-slate-200 mb-4 focus:outline-orange-400'
          placeholder='Nhập vào mật khẩu'
        />
        <p className='sm:ml-[-35%] pb-2 text-sm text-right text-red-500 font-medium'>{errors.password?.message}</p>
        <input
          {...register('retype_password')}
          type='password'
          className='w-full sm:w-8/12 px-4 py-2 rounded-full bg-slate-200 mb-4 focus:outline-orange-400'
          placeholder='Xác nhận mật khẩu'
        />
        <p className='sm:ml-[-35%] pb-2 text-sm text-right text-red-500 font-medium'>
          {errors.retype_password?.message}
        </p>
        <button
          type='submit'
          className='w-full sm:w-8/12 text-center py-2 bg-gradient-to-tr from-[#2cccff] to-[#22dfbf] text-white rounded-md font-semibold '
        >
          Đăng ký
        </button>
      </form>
      <p className='pt-5 font-medium'>
        Bạn đã có tài khoản?
        <Link className='pl-3 text-orange-400 font-bold' to='/auth/login'>
          Đăng Nhập
        </Link>
      </p>
    </>
  );
}
