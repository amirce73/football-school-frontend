import React from 'react';
import { NavLink } from 'react-router-dom';

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/dashboard" className={({ isActive }) => isActive ? "bnav-item active" : "bnav-item"}><i className="fa fa-home"></i> خانه</NavLink>
      <NavLink to="/profile-hub" className={({ isActive }) => isActive ? "bnav-item active" : "bnav-item"}><i className="fa fa-user"></i> پروفایل</NavLink>
      <NavLink to="/registration" className={({ isActive }) => isActive ? "bnav-item active" : "bnav-item"}><i className="fa fa-edit"></i> ثبت‌نام</NavLink>
      <NavLink to="/financial-hub" className={({ isActive }) => isActive ? "bnav-item active" : "bnav-item"}><i className="fa fa-credit-card"></i> مالی</NavLink>
      <NavLink to="/specialized-hub" className={({ isActive }) => isActive ? "bnav-item active" : "bnav-item"}><i className="fa fa-building"></i> تخصصی</NavLink>
    </nav>
  );
}
