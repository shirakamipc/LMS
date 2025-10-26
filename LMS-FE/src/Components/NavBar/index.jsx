import { navLink } from 'Constants/NavLink';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function NavBar() {
  return (
    <>

      {navLink.map((val, index) => (
        <NavLink
          to={val.path}
          key={index}
          className={({ isActive }) =>
            isActive
              ? 'py-4 my-4 flex justify-center items-center rounded-xl flex-col w-full bg-[#e8ebed]'
              : 'py-4 my-4 flex justify-center items-center rounded-xl flex-col w-full'
          }
        >
          {val.icon}
          <p className='capitalize text-xs font-semibold'>{val.title}</p>
        </NavLink>
      ))}
    </>
  );
}
