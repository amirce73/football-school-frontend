import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { useAuth } from '../../contexts/AuthContext';
import StickySubmitButton from '../../components/StickySubmitButton';
import CustomSelect from '../../components/CustomSelect';

export default function Registration() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
      currentTerm: '1',
      currentClass: '1'
  });
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
      if (user) {
          setFormData({
              currentTerm: user.currentTerm || '1',
              currentClass: user.currentClass || '1'
          });
      }
  }, [user]);

  const handleChange = (field: string, value: string) => {
      setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
      if (!accepted) {
          alert('لطفاً قوانین و مقررات را بپذیرید.');
          return;
      }
      setLoading(true);
      try {
          await api.put('/users/registration-pref', formData);
          await refreshUser();
          alert('ثبت‌نام با موفقیت انجام شد!');
      } catch (error) {
          console.error(error);
          alert('خطا در ثبت‌نام');
      } finally {
          setLoading(false);
      }
  };



  return (
    <div id="view-registration" className="view-section fade-in">
            <div className="sticky-top-bar">
                <button className="btn-top-action btn-back-top" onClick={() => navigate('/dashboard')}><i className="fa fa-arrow-right"></i> بازگشت</button>
                <h3 className="sticky-title">ثبت‌نام در دوره</h3>
            </div>
            <div className="registration-grid">
                <div className="card" style={{ overflow: 'visible' }}>
                    <div className="form-grid">
                        <div className="input-group desktop-full-width">
                            <label>دوره انتخابی: <span className="text-danger">*</span></label>
                            <CustomSelect
                                name="currentTerm"
                                value={formData.currentTerm}
                                onChange={(e) => handleChange('currentTerm', (e.target as HTMLSelectElement).value)}
                            >
                                <option value="ترم تابستان ۱۴۰۵">ترم تابستان ۱۴۰۵</option>
                                <option value="ترم پاییز ۱۴۰۵">ترم پاییز ۱۴۰۵</option>
                            </CustomSelect>
                        </div>
                        <div className="input-group desktop-full-width">
                            <label>کلاس / رده سنی:</label>
                            <CustomSelect
                                name="currentClass"
                                value={formData.currentClass}
                                onChange={(e) => handleChange('currentClass', (e.target as HTMLSelectElement).value)}
                            >
                                <option value="رده سنی ۱۴ و ۱۵ سال">رده سنی ۱۴ و ۱۵ سال</option>
                                <option value="رده سنی ۱۶ و ۱۷ سال">رده سنی ۱۶ و ۱۷ سال</option>
                            </CustomSelect>
                        </div>
                        <div className="checkbox-group" style={{"gridColumn":"1 / -1","background":"var(--primary-light)","padding":"12px","borderRadius":"var(--radius-base)","border":"1px solid rgba(234,179,8,0.3)","color":"var(--text-dark)"}}>
                            <label style={{"color":"var(--text-dark)","display":"flex","alignItems":"center","gap":"8px", "cursor": "pointer"}}>
                                <input type="checkbox" style={{"width":"auto","transform":"scale(1.2)"}} checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
                                قوانین و مقررات باشگاه را مطالعه کرده و می‌پذیرم.
                            </label>
                        </div>
                    </div>
                </div>

                <div className="card" style={{"padding":"16px","marginTop":"0"}}>
                    <h4 style={{"marginBottom":"12px","display":"flex","alignItems":"center","gap":"8px","color":"var(--text-dark)","fontWeight":"800"}}>
                        <i className="fa fa-pie-chart" style={{"color":"var(--primary)"}}></i> گزارش مالی ثبت‌نام‌ها
                    </h4>
                    <div style={{"display":"flex","justifyContent":"space-between","marginBottom":"8px","fontSize":"0.85rem"}}>
                        <span>کل پرداختی‌های شما:</span>
                        <strong style={{"color":"var(--success)"}}>۱۵,۰۰۰,۰۰۰ تومان</strong>
                    </div>
                    <div style={{"display":"flex","justifyContent":"space-between","marginBottom":"16px","fontSize":"0.85rem"}}>
                        <span>بدهی فعلی (ترم جاری):</span>
                        <strong style={{"color":"var(--danger)"}}>۷,۵۰۰,۰۰۰ تومان</strong>
                    </div>
                    <button onClick={() => navigate('/financial-timeline')} style={{"width":"100%","background":"#f8fafc","color":"var(--text-dark)","border":"1px solid var(--border)","padding":"12px","borderRadius":"var(--radius-sm)","fontWeight":"800","fontFamily":"inherit","cursor":"pointer","transition":"0.2s"}}>
                        <i className="fa fa-history" style={{"color":"var(--primary)"}}></i> مشاهده تایم‌لاین مالی تراکنش‌ها
                    </button>
                </div>
            </div>
            <StickySubmitButton loading={loading} text="ثبت نام" loadingText="در حال ثبت..." type="button" onClick={handleSubmit} />

        </div>
  );
}
