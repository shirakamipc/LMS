import clsx from 'clsx';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useAuth } from 'Context/AuthContext';
import Modal from './index';

// Helper function to get first letter and generate avatar background color
const getAvatarDisplay = (fullName, avatar) => {
  if (avatar) {
    return { type: 'image', src: avatar };
  }

  const firstLetter = fullName?.charAt(0)?.toUpperCase() || '?';
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];
  const colorIndex = fullName?.charCodeAt(0) % colors.length || 0;

  return {
    type: 'text',
    letter: firstLetter,
    bgColor: colors[colorIndex]
  };
};

export default function UserModal() {
  const [isModal, setModal] = useState(false);
  const client = useQueryClient();
  const current_user = client.getQueryData('current_user');
  const { logout } = useAuth();

  const logOut = async () => {
    try {
      logout();
      toast.success("Đăng xuất thành công");
    } catch (error) {
      toast.error(error.message || "Đăng xuất thất bại");
    }
  };

  const avatarDisplay = getAvatarDisplay(current_user?.fullName, current_user?.avatar);

  const renderAvatar = (size = 'w-9 h-9') => {
    if (avatarDisplay.type === 'image') {
      return (
        <img
          src={avatarDisplay.src}
          className={`${size} rounded-full cursor-pointer`}
          alt='User avatar'
        />
      );
    }

    return (
      <div
        className={`${size} ${avatarDisplay.bgColor} rounded-full flex items-center justify-center text-white font-semibold cursor-pointer`}
        onClick={() => setModal(true)}
      >
        {avatarDisplay.letter}
      </div>
    );
  };

  return (
    <>
      <div className='relative ww-auto h-auto'>
        {renderAvatar()}
        <div
          className={clsx(
            'p-4 absolute bottom-0 right-0 translate-y-[calc(100%+8px)] z-[100] transition-all duration-700 bg-white w-72 shadow-2xl border-[1px] rounded-lg',
            {
              hidden: !isModal,
              block: isModal,
            },
          )}
        >
          <div className='flex items-center gap-3 pb-3 border-b-[1px]'>
            {avatarDisplay.type === 'image' ? (
              <img src={avatarDisplay.src} className='h-14 w-14 rounded-full' alt='User avatar' />
            ) : (
              <div className={`h-14 w-14 ${avatarDisplay.bgColor} rounded-full flex items-center justify-center text-white font-semibold text-lg`}>
                {avatarDisplay.letter}
              </div>
            )}
            <div>
              <h2 className='font-semibold'>{current_user?.fullName}</h2>
              <h3 className='text-sm font-light'>@{current_user?.fullName}</h3>
            </div>
          </div>

          <h3 className='cursor-pointer text-[14px] p-2 text-gray-700' onClick={logOut}>Đăng xuất</h3>
        </div>
      </div>
      <Modal isModal={isModal} setModal={setModal} isBackground></Modal>
    </>
  );
}
