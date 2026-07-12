import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();
  return (
    <aside className="desktop-sidebar">
        <div style={{"fontSize":"0.75rem","fontWeight":"800","color":"var(--text-muted)","marginBottom":"16px","paddingRight":"8px"}}>
            منوی اصلی</div>
        <NavLink to="/dashboard" className={({isActive}) => isActive ? "dnav-item active" : "dnav-item"}><i className="fa fa-home"></i> خانه</NavLink>
        <NavLink to="/profile-hub" className={({isActive}) => isActive ? "dnav-item active" : "dnav-item"}><i className="fa fa-user"></i> پروفایل</NavLink>
        <NavLink to="/registration" className={({isActive}) => isActive ? "dnav-item active" : "dnav-item"}><i className="fa fa-edit"></i> ثبت‌نام</NavLink>
        <NavLink to="/financial-hub" className={({isActive}) => isActive ? "dnav-item active" : "dnav-item"}><i className="fa fa-credit-card"></i> مالی</NavLink>
        <NavLink to="/specialized-hub" className={({isActive}) => isActive ? "dnav-item active" : "dnav-item"}><i className="fa fa-building"></i> تخصصی</NavLink>
    </aside>
  );
}
