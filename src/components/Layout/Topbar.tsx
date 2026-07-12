import React from 'react';
import { useNavigate } from 'react-router-dom';
import messiProfile from '../../images/messi-profile.jpg';
import { useAuth } from '../../contexts/AuthContext';
import DateObjectModule from "react-date-object";
import persianModule from "react-date-object/calendars/persian";
import persianFaModule from "react-date-object/locales/persian_fa";

const DateObject = (DateObjectModule as any).default || DateObjectModule;
const persian = (persianModule as any).default || persianModule;
const persian_fa = (persianFaModule as any).default || persianFaModule;

export default function Topbar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    React.useEffect(() => {
        const handleClickOutside = () => {
            const menu = document.getElementById('profileMenu');
            if (menu && menu.classList.contains('show')) {
                menu.classList.remove('show');
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        logout();
        navigate('/login');
    };

    const toPersianNum = (str: string) => {
        if (!str) return str;
        const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return str.toString().replace(/[0-9]/g, w => persianDigits[parseInt(w)]);
    };

    const getShamsiJoinDate = () => {
        if (!user?.createdAt) return "- - - - / - - / - -";
        try {
            return toPersianNum(new DateObject(new Date(user.createdAt)).convert(persian, persian_fa).format("YYYY/MM/DD"));
        } catch {
            return toPersianNum(user.createdAt.split('T')[0]);
        }
    };

    return (
        <nav className="top-navbar">
            <div className="navbar-container">
                {/*  Header Profile & Dropdown  */}
                <div className="header-profile" onClick={(e) => { e.stopPropagation(); document.getElementById('profileMenu')?.classList.toggle('show'); }}>
                    <div className="header-profile-avatar">
                        <img src={messiProfile} alt="user" onError={(e) => { e.currentTarget.src = ''; }} />
                    </div>
                    <div>
                        <div className="header-profile-info">
                            <span className="name">{user?.firstName || "نام"} {user?.lastName || "نام خانوادگی"}</span>
                            <span className="meta"><i className="fa fa-calendar-check-o" style={{ "marginLeft": "4px" }}></i>عضویت:
                                <strong style={{ marginRight: '4px' }} className="dir-ltr">{getShamsiJoinDate()}</strong></span>
                        </div>
                    </div>
                    <i className="fa fa-angle-down" style={{ "color": "var(--text-muted)", "marginRight": "4px", "fontSize": "1.1rem" }}></i>

                    <div id="profileMenu" className="profile-menu">
                        <div style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "padding": "16px 20px" }}>
                            <div style={{ "display": "flex", "flexDirection": "row" }}>
                                <div style={{ "fontWeight": "800", "color": "var(--text-dark)", "marginBottom": "12px", "fontSize": "1.05rem", "textAlign": "center", "display": "flex", "justifyContent": "center", "alignItems": "center" }}>
                                    {user?.firstName} {user?.lastName}</div>
                                <div style={{ "marginRight": "auto", "marginBottom": "12px", "display": "flex", "justifyContent": "center" }} onClick={() => navigate('/verification')}>
                                    <span style={{ "borderColor": "#334155" }} className="badge-verify unverified"><i className="fa fa-exclamation-circle"></i>استعلام هویت نشده</span>
                                </div>
                            </div>
                            <div style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "0.8rem", "color": "var(--text-muted)", "marginBottom": "6px" }}>
                                <span>کد ملی:</span> <strong>{toPersianNum(user?.nationalCode || "") || "- - - - - - - - - -"}</strong></div>
                            <div style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "0.8rem", "color": "var(--text-muted)", "marginBottom": "6px" }}>
                                <span>تاریخ تولد:</span> <strong className="dir-ltr">{toPersianNum(user?.birthDate || "") || "- - / - - / - - - -"}</strong></div>
                            <div style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "0.8rem", "color": "var(--text-muted)", "marginBottom": "6px" }}>
                                <span>سن:</span> <strong>
                                    {user?.birthDate ? toPersianNum((Math.max(0, new DateObject({ calendar: persian }).year - parseInt(
                                        user.birthDate.split('/')[0].replace(/[۰-۹]/g, (w: string) => ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'].indexOf(w).toString())
                                    ))).toString()) : toPersianNum((user?.age || 0).toString())} سال
                                </strong>
                            </div>
                            <div style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "0.8rem", "color": "var(--text-muted)" }}>
                                <span>رده سنی:</span> <strong>{user?.currentClass || "- - - - - - -"}</strong></div>
                        </div>

                        <a href="#" style={{ "color": "#334155" }} onClick={() => navigate('/verification')}><i className="fa fa-shield"></i>
                            تایید هویت و مدارک</a>
                        <a href="#" style={{ "color": "var(--danger)", "padding": "12px 16px" }} onClick={handleLogout}><i className="fa fa-sign-out"></i> خروج از
                            حساب</a>
                    </div>
                </div>

                <div className="header-actions">
                    {/*  Bulletin / Notifications Button  */}
                    <button className="btn-noti" title="اعلان‌ها" onClick={() => navigate('/bulletin')}>
                        <i className="fa fa-bell-o"></i>
                        <span className="badge">۳</span>
                    </button>
                    <a href="#" className="btn-app-header" title="دانلود اپلیکیشن">
                        <i className="fa fa-android"></i> <span>دانلود اپ</span>
                    </a>
                </div>
            </div>
        </nav>
    );
}
