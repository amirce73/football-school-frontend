import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function FinancialHub() {
  const navigate = useNavigate();
  return (
    <div id="view-financial-hub" className="view-section fade-in">
            <div className="sticky-top-bar">
                <button className="btn-top-action btn-back-top" onClick={() => navigate('/dashboard')}><i className="fa fa-arrow-right"></i> بازگشت</button>
                <h3 className="sticky-title">اطلاعات مالی</h3>
                <div style={{"width":"80px"}}></div>
            </div>

            {/*  Desktop Refined Grid for Financial Top  */}
            <div className="financial-top-grid">
                <div className="debt-card status-due" style={{"padding":"16px"}}>
                    <div className="debt-info-wrap">
                        <div className="debt-icon">❌</div>
                        <div className="debt-info">
                            <span className="label">وضعیت مالی حساب</span>
                            <span className="amount" style={{"paddingTop":"3px"}}>۷,۵۰۰,۰۰۰ تومان</span>
                        </div>
                    </div>
                    <button className="btn-credit" title="پرداخت بدهی" onClick={() => { alert('انتقال به درگاه پرداخت...') }}><i className="fa fa-plus"></i> پرداخت بدهی</button>
                </div>

                <div className="card">
                    <div className="hub-list">
                        <div className="hub-btn" onClick={() => navigate('/bank-info')}>
                            <div className="hub-btn-left">
                                <div className="hub-btn-icon"><i className="fa fa-bank"></i></div> حساب‌های بانکی
                            </div>
                            <i className="fa fa-angle-left"></i>
                        </div>
                        <div className="hub-btn" onClick={() => { alert('انتقال به درگاه پرداخت...') }}>
                            <div className="hub-btn-left">
                                <div className="hub-btn-icon" style={{"color":"var(--success)"}}><i className="fa fa-credit-card"></i>
                                </div> پرداخت شهریه
                            </div>
                            <i className="fa fa-angle-left"></i>
                        </div>
                        <div className="hub-btn" onClick={() => navigate('/financial-timeline')}>
                            <div className="hub-btn-left">
                                <div className="hub-btn-icon" style={{"color":"var(--info)"}}><i className="fa fa-bar-chart"></i>
                                </div> گزارشات و تایم‌لاین مالی
                            </div>
                            <i className="fa fa-angle-left"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card recent-transactions-card">
                <h4 className="transactions-title"><i className="fa fa-exchange" style={{"color":"var(--primary)","marginLeft":"8px"}}></i> سوابق تراکنش‌های اخیر</h4>
                <div className="transactions-list">
                    <div className="transaction-item">
                        <div className="tr-info">
                            <div className="tr-icon success"><i className="fa fa-arrow-down"></i></div>
                            <div>
                                <strong>پرداخت شهریه خرداد</strong>
                                <span className="tr-date">۱۴۰۵/۰۳/۰۱ | ۱۲:۴۵</span>
                            </div>
                        </div>
                        <div className="tr-amount success">۶,۸۰۰,۰۰۰ تومان <span className="badge-success">موفق</span></div>
                    </div>
                    <div className="transaction-item">
                        <div className="tr-info">
                            <div className="tr-icon success"><i className="fa fa-arrow-down"></i></div>
                            <div>
                                <strong>هزینه لباس فرم مسابقات</strong>
                                <span className="tr-date">۱۴۰۵/۰۲/۱۵ | ۰۹:۳۰</span>
                            </div>
                        </div>
                        <div className="tr-amount success">۸۵۰,۰۰۰ تومان <span className="badge-success">موفق</span></div>
                    </div>
                    <div className="transaction-item">
                        <div className="tr-info">
                            <div className="tr-icon fail"><i className="fa fa-arrow-up"></i></div>
                            <div>
                                <strong>شهریه ترم تابستان (بدهی)</strong>
                                <span className="tr-date">۱۴۰۵/۰۳/۰۵ | ۱۸:۱۰</span>
                            </div>
                        </div>
                        <div className="tr-amount fail">۷,۵۰۰,۰۰۰ تومان <span className="badge-fail">ناموفق / بدهی</span></div>
                    </div>
                </div>
            </div>
        </div>
  );
}
