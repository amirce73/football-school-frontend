import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SpecializedHub() {
  const navigate = useNavigate();

  const getGradientColor = (percent: number) => {
    if (percent === 0) return '#cbd5e1'; // empty state
    const hue = percent * 1.2; // 100% -> 120 (Green), 10% -> 12 (Red)
    return `hsl(${hue}, 80%, 45%)`;
  };

  const practiceScoresData = [
    { day: 'شنبه', val: 7, max: 10 },
    { day: '۱شنبه', val: 8, max: 10 },
    { day: '۲شنبه', val: 9, max: 10 },
    { day: '۳شنبه', val: 6, max: 10 },
    { day: '۴شنبه', val: 8, max: 10 },
    { day: '۵شنبه', val: 7, max: 10 },
    { day: 'جمعه', val: 0, max: 10 }
  ];

  return (
    <div id="view-specialized-hub" className="view-section fade-in">
            <div className="sticky-top-bar">
                <button className="btn-top-action btn-back-top" onClick={() => navigate('/dashboard')}><i className="fa fa-arrow-right"></i> بازگشت</button>
                <h3 className="sticky-title">اطلاعات تخصصی</h3>
                <div style={{"width":"80px"}}></div>
            </div>

            <div className="specialized-top-grid">
                <div className="card" style={{ padding: "16px", gridColumn: '1 / -1' }}>
                    <div className="section-title" style={{ marginTop: "0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div><i className="fa fa-line-chart" style={{ color: "var(--primary)" }}></i> نمرات در تمرینات (از ۱ تا ۱۰) - هفته اخیر</div>
                        <button className="btn-primary" style={{ fontSize: '0.8rem', padding: '4px 12px', borderRadius: '4px' }} onClick={() => navigate('/attendance')}>مشاهده</button>
                    </div>
                    <div className="css-chart-wrap">
                        {practiceScoresData.map((d, i) => {
                            const percent = (d.val / d.max) * 100;
                            return (
                                <div className="css-bar-col" key={`practice-${i}`}>
                                    <div className="css-bar">
                                        <div className="css-bar-fill" style={{ height: `${percent}%`, background: getGradientColor(percent) }}>
                                            {d.val > 0 && <span className="css-bar-val">{d.val}</span>}
                                        </div>
                                    </div>
                                    <span className="css-bar-label">{d.day}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="section-title" style={{"padding":"0 16px","marginTop":"16px"}}>
                    <i className="fa fa-folder-open" style={{"color":"var(--danger)"}}></i> فرم‌ها و گزارش‌ها
                </div>
                <div className="spec-grid">
                    <div className="spec-item" onClick={() => navigate('/attendance')}>
                        <div className="spec-icon" style={{"color":"#10b981","background":"#dcfce7"}}><i className="fa fa-check-square-o"></i></div>
                        <div className="spec-title">گزارش حضور و غیاب<br />در تمرینات</div>
                    </div>
                    <div className="spec-item" onClick={() => { alert('باز کردن فرم اطلاعات GPS...') }}>
                        <div className="spec-icon" style={{"color":"var(--warning)","background":"#fef3c7"}}><i className="fa fa-map-marker"></i></div>
                        <div className="spec-title">فرم داده‌های<br />GPS</div>
                    </div>
                    <div className="spec-item" onClick={() => navigate('/registration-history')}>
                        <div className="spec-icon" style={{"color":"#1d4ed8","background":"var(--primary-light)"}}><i className="fa fa-history"></i></div>
                        <div className="spec-title">تاریخچه<br />ثبت‌نام‌ها</div>
                    </div>
                    <div className="spec-item" onClick={() => navigate('/talent')}>
                        <div className="spec-icon" style={{"color":"#9333ea","background":"#f3e8ff"}}><i className="fa fa-search"></i>
                        </div>
                        <div className="spec-title">فرم<br />استعدادیابی</div>
                    </div>
                    <div className="spec-item" onClick={() => { alert('گزارش عملکرد مسابقه...') }}>
                        <div className="spec-icon" style={{"color":"#f59e0b","background":"#fef3c7"}}><i className="fa fa-line-chart"></i></div>
                        <div className="spec-title">تحلیل عملکرد<br />در مسابقه</div>
                    </div>
                    <div className="spec-item" onClick={() => { alert('گزارش عملکرد تمرین...') }}>
                        <div className="spec-icon" style={{"color":"#3b82f6","background":"#e0e7ff"}}><i className="fa fa-area-chart"></i></div>
                        <div className="spec-title">تحلیل عملکرد<br />در تمرینات</div>
                    </div>
                    <div className="spec-item" onClick={() => navigate('/insurance-status')}>
                        <div className="spec-icon" style={{"color":"#0ea5e9","background":"#e0f2fe"}}><i className="fa fa-heartbeat"></i></div>
                        <div className="spec-title">وضعیت<br />بیمه ورزشی</div>
                    </div>
                    <div className="spec-item" onClick={() => navigate('/certificate')}>
                        <div className="spec-icon" style={{"color":"#f59e0b","background":"#fef3c7"}}><i className="fa fa-certificate"></i></div>
                        <div className="spec-title">گواهی<br />پایان دوره</div>
                    </div>
                    <div className="spec-item" onClick={() => { alert('باز کردن فرم پزشکی...') }}>
                        <div className="spec-icon" style={{"color":"#ef4444","background":"#fee2e2"}}><i className="fa fa-medkit"></i>
                        </div>
                        <div className="spec-title">فرم<br />پزشکی</div>
                    </div>
                    <div className="spec-item" onClick={() => { alert('کارت عضویت شما در حال دانلود است...') }}>
                        <div className="spec-icon" style={{"color":"#64748b","background":"#f1f5f9"}}><i className="fa fa-id-badge"></i>
                        </div>
                        <div className="spec-title">دریافت کارت<br />عضویت</div>
                    </div>
                </div>
            </div>
        </div>
  );
}
