import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AgeIcon, AttendanceIcon, InsuranceIcon, TalentIcon, BmiIcon } from '../../components/icons';
import sepahanLogo from '../../images/logo/Sepahan_New_Logo.svg';
import ClubDetailsModal from '../../components/ClubDetailsModal';

export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [debtStatus, setDebtStatus] = useState<'clear' | 'due'>('clear');

    let bmiVal = '--';
    let bmiStatus = 'نامشخص';
    let bmiColor = '#475569';
    let bmiBg = '#f1f5f9';
    if (user?.weight && user?.height) {
        const w = Number(user.weight);
        const h = Number(user.height) / 100;
        if (w > 0 && h > 0) {
            const bmi = parseFloat((w / (h * h)).toFixed(1));
            bmiVal = bmi.toString();
            if (bmi < 18.5) {
                bmiStatus = 'کمبود وزن';
                bmiColor = '#b45309';
                bmiBg = '#fef3c7';
            } else if (bmi < 25) {
                bmiStatus = 'نرمال';
                bmiColor = '#166534';
                bmiBg = '#dcfce7';
            } else if (bmi < 30) {
                bmiStatus = 'اضافه وزن';
                bmiColor = '#c2410c';
                bmiBg = '#ffedd5';
            } else {
                bmiStatus = 'چاقی';
                bmiColor = '#991b1b';
                bmiBg = '#fee2e2';
            }
        }
    }
    return (
        <div id="view-dashboard" className="view-section fade-in">
            <ClubDetailsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <div className="dashboard-grid">
                <div className="dashboard-top-row school-top-row">
                    {/* Club Intro Block */}
                    <div className="profile-card club-intro-card">
                        <div className="profile-club-row club-intro-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', width: '100%' }}>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                <div className="club-logo-wrapper">
                                    <div className="club-logo club-logo-interactive">
                                        <img src={sepahanLogo} alt="logo" onError={(e) => { e.currentTarget.src = ''; }} />
                                    </div>
                                    <a href="tel:09123456789" className="club-phone-number-btn dir-ltr">
                                        <i className="fa fa-phone"></i> 09123456789
                                    </a>
                                </div>
                                <div className="club-info" style={{ marginRight: '18px', marginLeft: 0 }}>
                                    <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: 'black' }}>باشگاه فوتبال</h3>
                                    <div className="term-pill">ترم تابستان ۱۴۰۵</div>
                                    <div style={{ "fontSize": "0.75rem", "marginTop": "4px", "marginBottom": "12px", "opacity": 1, "color": "rgb(113 113 122 / var(--tw-text-opacity, 1))" }}>
                                        کلاس آموزشی
                                    </div>

                                    <button className="beautiful-modal-btn" onClick={() => setIsModalOpen(true)}>
                                        اطلاعات مدرسه فوتبال
                                    </button>
                                </div>
                            </div>

                            <div className="social-column">
                                <a href="#" className="social-btn" title="تلگرام"><i style={{ "color": "deepskyblue" }} className="fa fa-paper-plane"></i></a>
                                <a href="#" className="social-btn" title="اینستاگرام"><i style={{ "color": "red" }} className="fa fa-instagram"></i></a>
                                <a href="#" className="social-btn" title="واتساپ"><i style={{ "color": "lawngreen" }} className="fa fa-whatsapp"></i></a>
                                <a href="#" className="social-btn" title="وب‌سایت"><i style={{ "color": "orange" }} className="fa fa-globe"></i></a>
                            </div>
                        </div>
                        <div className="profile-actions-box">
                            <div className="action-row" style={{ "marginBottom": "6px" }}>
                                <span className="action-label"><i className="fa fa-exclamation-triangle" style={{ "color": "#fde047", "fontSize": "1rem" }}></i> اطلاعات شما تکمیل نیست (۳۲٪)</span>
                                <button className="btn-mini" onClick={(e) => { e.stopPropagation(); navigate('/profile-hub'); }}>تکمیل اطلاعات</button>
                            </div>
                            <div className="progress-bar-wrap">
                                <div className="progress-fill" style={{ "width": "32%" }}></div>
                            </div>
                        </div>
                    </div>
                    {/* Left Cards Container */}
                    <div className="left-cards-container">
                        {/* Registration Card (Desktop/Tablet) */}
                        <div className="card registration-card school-registration-card" style={{ flex: 1, margin: 0, cursor: 'pointer', border: '1px solid var(--primary)' }} onClick={() => navigate('/registration')}>
                            <div className="reg-label" style={{ color: 'var(--text-muted)', fontWeight: 'bold' }}>ثبت‌نام آنلاین</div>
                            <div className="reg-val" style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fa fa-user-plus"></i></div>
                            <div className="reg-status" style={{ borderRadius: '16px', background: '#e0f2fe', color: '#0369a1', fontWeight: 'bold' }}>ورود</div>
                        </div>

                        {/* BMI Card (Mobile Only) */}
                        <div className="card bmi-card school-top-bmi-card" style={{ flex: 1, margin: 0, padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <div className="bmi-label" style={{ color: 'var(--text-muted)', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '4px', width: '100%' }}>
                                <BmiIcon width="32" height="32" color={bmiColor} style={{ flexShrink: 0 }} />
                                <span style={{ whiteSpace: 'nowrap', fontSize: '0.9rem' }}>شاخص BMI</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <div className="bmi-val" style={{ fontWeight: '900', color: bmiColor !== '#475569' ? bmiColor : 'var(--text-dark)', fontSize: '1.2rem' }}>{bmiVal}</div>
                                <div className="bmi-status" style={{ borderRadius: '16px', background: bmiBg, color: bmiColor, fontWeight: 'bold', padding: '2px 10px', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{bmiStatus}</div>
                            </div>
                        </div>

                        {/* Debt Card */}
                        <div
                            className={`debt-card status-${debtStatus} school-debt-card`}
                            style={{ flex: 1, margin: 0, cursor: 'pointer', padding: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                            onClick={() => setDebtStatus(s => s === 'clear' ? 'due' : 'clear')}
                            title="برای دیدن نمونه کلیک کنید"
                        >
                            <div className="debt-info-wrap" style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between', padding: '0', marginBottom: '6px' }}>
                                <div className="debt-info" style={{ display: 'flex', alignItems: 'center', gap: '4px', overflow: 'hidden' }}>
                                    <span className="label" style={{ whiteSpace: 'nowrap', fontSize: '0.75rem', opacity: 0.8 }}>وضعیت مالی:</span>
                                    <span className="amount" style={{ whiteSpace: 'nowrap', fontSize: '0.9rem', fontWeight: 'bold' }}>
                                        {debtStatus === 'clear' ? 'بدون بدهی' : '۱.۵M بدهی'}
                                    </span>
                                </div>
                                <div className="debt-icon" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', opacity: 0.9 }}>
                                    <i className={`fa ${debtStatus === 'clear' ? 'fa-check' : 'fa-exclamation-triangle'}`}></i>
                                </div>
                            </div>
                            <button className="btn-credit" style={{ margin: '0 auto', padding: '4px 12px', fontSize: '0.8rem', minHeight: 'auto', width: '100%' }} title="افزایش اعتبار"><i className="fa fa-plus"></i> شارژ</button>
                        </div>
                    </div>
                </div>

                <div className="stats-container-block">
                    <div className="stats-grid school-stats-grid">
                        <div className="stat-card school-stat-card">
                            <div className="stat-icon ic-blue"><AgeIcon width="24" height="24" /></div>
                            <div className="stat-info"><span className="stat-label">رده سنی</span><span className="stat-val">بزرگسالان</span></div>
                        </div>
                        <div className="stat-card school-stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/attendance')}>
                            <div className="stat-icon ic-green"><i className="fa fa-calendar-check-o"></i></div>
                            <div className="stat-info"><span className="stat-label">کل | حضور در تمرین</span><span className="stat-val">۲۰ | ۱۴ (۷۰٪)</span></div>
                        </div>
                        <div className="stat-card school-stat-card school-kpi-bmi" style={{ cursor: 'pointer' }} onClick={() => navigate('/bmi-history')}>
                            <div className="stat-icon" style={{ color: bmiColor, background: bmiBg, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', fontSize: '1.5rem', width: '48px', height: '48px' }}>
                                <BmiIcon width="26" height="26" />
                            </div>
                            <div className="stat-info"><span className="stat-label">شاخص BMI</span><span className="stat-val">{bmiVal !== '--' ? `${bmiVal} (${bmiStatus})` : 'نامشخص'}</span></div>
                        </div>
                        <div className="stat-card school-stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/talent')}>
                            <div className="stat-icon" style={{ color: '#9333ea', background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}><i className="fa fa-search"></i></div>
                            <div className="stat-info"><span className="stat-label">استعدادیابی</span><span className="stat-val">مشاهده</span></div>
                        </div>
                        <div className="stat-card school-stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/insurance-status')}>
                            <div className="stat-icon ic-orange"><InsuranceIcon width="24" height="24" /></div>
                            <div className="stat-info"><span className="stat-label">اعتبار بیمه</span><span className="stat-val">—</span></div>
                        </div>
                    </div>
                </div>

                <div className="col-span-3 media-group-wrapper">
                    <div className="dash-action-grid">
                        <div className="dash-action-card card-store" onClick={() => navigate('/store')}>
                            <i className="fa fa-shopping-cart"></i>
                            <h4>فروشگاه</h4>
                        </div>
                        <div className="dash-action-card card-gallery" onClick={() => navigate('/gallery')}>
                            <i className="fa fa-picture-o"></i>
                            <h4>گالری</h4>
                        </div>
                        {/* Training Backpack (Laptop only) */}
                        <div className="dash-action-card card-backpack" onClick={() => navigate('/training-backpack')}>
                            <i className="fa fa-briefcase"></i>
                            <h4>ویدیو</h4>
                        </div>
                    </div>
                    <div className="card news-card" onClick={() => navigate('/bulletin')} style={{ "cursor": "pointer", "marginBottom": "0px" }}>
                        <div className="news-header">
                            <h4><i className="fa fa-bell-o" style={{ "color": "var(--primary)" }}></i> اطلاعیه و پیام‌ها</h4>
                            <span className="badge-new">۱ پیام جدید</span>
                        </div>
                        <div className="news-body">
                            برای مشاهده همه پیام‌های بولتن خبری کلیک کنید. ثبت‌نام در طرح ترم تابستان ۱۴۰۵ شروع شده
                            است...
                            <span className="news-date">۱۴۰۵/۰۳/۰۱</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
