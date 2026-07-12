import React from 'react';
import { useNavigate } from 'react-router-dom';
import sepahanLogo from '../../images/logo/Sepahan_New_Logo.svg';
import damghanLogo from '../../images/logo/damghan.jpg';
import stareganLogo from '../../images/logo/staregan-logo.jpg';
import tamLogo from '../../images/logo/tam logo.png';

export default function RegistrationHistory() {
    const navigate = useNavigate();
    return (
        <div id="view-registration-history" className="view-section fade-in">
            <div className="sticky-top-bar">
                <button className="btn-top-action btn-back-top" onClick={() => navigate('/specialized-hub')}><i className="fa fa-arrow-right"></i> بازگشت</button>
                <h3 className="sticky-title">تاریخچه ثبت‌نام‌ها</h3>
                <div style={{ "width": "80px" }}></div>
            </div>

            <div className="card" style={{ "background": "transparent", "border": "none", "boxShadow": "none" }}>
                <div className="timeline-container">
                    <div className="timeline-item">
                        <div className="timeline-logo success">
                            <img src={sepahanLogo} alt="logo" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/100'; }} />
                        </div>
                        <div className="timeline-content success">
                            <div className="tl-header success">
                                <span className="tl-title success">ترم تابستان ۱۴۰۵</span>
                                <span className="tl-date">۱۴۰۵/۰۳/۰۱</span>
                            </div>
                            <div className="tl-row"><span>رده سنی:</span> <strong>۱۴ و ۱۵ سال</strong></div>
                            <div className="tl-row"><span>نام کلاس:</span> <strong>پیشرفته الف</strong></div>
                            <div className="tl-row"><span>هزینه دوره:</span> <strong>۷,۵۰۰,۰۰۰ تومان</strong></div>
                            <div className="tl-status success"><i className="fa fa-check-circle"></i> ثبت‌نام موفق و قطعی</div>
                        </div>
                    </div>
                    <div className="timeline-item">
                        <div className="timeline-logo success">
                            <img src={damghanLogo} alt="logo" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/100'; }} />
                        </div>
                        <div className="timeline-content success">
                            <div className="tl-header success">
                                <span className="tl-title success">ترم بهار ۱۴۰۵</span>
                                <span className="tl-date">۱۴۰۴/۱۲/۲۰</span>
                            </div>
                            <div className="tl-row"><span>رده سنی:</span> <strong>۱۴ و ۱۵ سال</strong></div>
                            <div className="tl-row"><span>نام کلاس:</span> <strong>سپاهان</strong></div>
                            <div className="tl-row"><span>هزینه دوره:</span> <strong>۶,۸۰۰,۰۰۰ تومان</strong></div>
                            <div className="tl-status success"><i className="fa fa-check-circle"></i> ثبت‌نام موفق و قطعی</div>
                        </div>
                    </div>
                    <div className="timeline-item">
                        <div className="timeline-logo success">
                            <img src={stareganLogo} alt="logo" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/100'; }} />
                        </div>
                        <div className="timeline-content success">
                            <div className="tl-header success">
                                <span className="tl-title success">ترم زمستان ۱۴۰۴</span>
                                <span className="tl-date">۱۴۰۴/۰۹/۱۵</span>
                            </div>
                            <div className="tl-row"><span>رده سنی:</span> <strong>۱۲ و ۱۳ سال</strong></div>
                            <div className="tl-row"><span>نام کلاس:</span> <strong>تکنیک و تاکتیک</strong></div>
                            <div className="tl-row"><span>هزینه دوره:</span> <strong>۵,۵۰۰,۰۰۰ تومان</strong></div>
                            <div className="tl-status success"><i className="fa fa-check-circle"></i> ثبت‌نام موفق و قطعی</div>
                        </div>
                    </div>
                    <div className="timeline-item">
                        <div className="timeline-logo fail">
                            <img src={tamLogo} alt="logo" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/100'; }} />
                        </div>
                        <div className="timeline-content fail">
                            <div className="tl-header fail">
                                <span className="tl-title fail">ترم پاییز ۱۴۰۴</span>
                                <span className="tl-date">۱۴۰۴/۰۶/۲۵</span>
                            </div>
                            <div className="tl-row"><span>رده سنی:</span> <strong>۱۲ و ۱۳ سال</strong></div>
                            <div className="tl-row"><span>نام کلاس:</span> <strong>پایه</strong></div>
                            <div className="tl-row"><span>هزینه دوره:</span> <strong>۵,۰۰۰,۰۰۰ تومان</strong></div>
                            <div className="tl-status fail"><i className="fa fa-exclamation-circle"></i> انصراف از دوره</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
