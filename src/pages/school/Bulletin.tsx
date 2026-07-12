import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Bulletin() {
  const navigate = useNavigate();
  return (
    <div id="view-bulletin" className="view-section fade-in">
            <div className="sticky-top-bar"><button className="btn-top-action btn-back-top" onClick={() => navigate('/dashboard')}><i className="fa fa-arrow-right"></i> بازگشت</button>
                <h3 className="sticky-title">تاریخچه پیام ها</h3>
                <div style={{"width":"80px"}}></div>
            </div>
            <div className="card" style={{"marginBottom":"12px","borderRight":"4px solid var(--primary)"}}>
                <div className="news-body"><strong>شروع ثبت‌نام ترم جدید</strong><br /><br />ثبت‌نام در طرح ترم تابستان ۱۴۰۵
                    شروع شده است...<span className="news-date">۱۴۰۵/۰۳/۰۱</span></div>
            </div>
            <div className="card" style={{"marginBottom":"12px","borderRight":"4px solid var(--text-muted)"}}>
                <div className="news-body"><strong>تعطیلی تمرینات پنجشنبه</strong><br /><br />به اطلاع می‌رساند تمرینات روز
                    پنجشنبه این هفته برگزار نخواهد شد.<span className="news-date">۱۴۰۵/۰۲/۲۸</span></div>
            </div>
        </div>
  );
}
