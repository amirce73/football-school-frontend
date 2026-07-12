import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ClubInfo() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div id="view-club-info" className="view-section fade-in">
            <div className="sticky-top-bar"><button className="btn-top-action btn-back-top" onClick={() => navigate('/profile-hub')}><i className="fa fa-arrow-right"></i> بازگشت</button>
                <h3 className="sticky-title">اطلاعات باشگاهی</h3>
                <div style={{"width":"80px"}}></div>
            </div>
            <div className="card" style={{"padding":"20px"}}>
                <div className="info-row-text"><strong>باشگاه فعلی:</strong> <span>باشگاه سپاهان</span></div>
                <div className="info-row-text"><strong>شماره پیراهن:</strong> <span>-</span></div>
                <div className="info-row-text"><strong>رده سنی / کلاس:</strong> <span>{user?.currentClass || 'ثبت‌نام نشده'}</span></div>
                <div className="info-row-text"><strong>تاریخ شروع قرارداد (ترم جاری):</strong> <span>{user?.currentTerm || 'ثبت‌نام نشده'}</span></div>
            </div>
        </div>
  );
}
