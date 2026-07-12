import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { useAuth } from '../../contexts/AuthContext';
import CustomSelect from '../../components/CustomSelect';
import StickySubmitButton from '../../components/StickySubmitButton';

export default function TrainingBackpack() {
    const navigate = useNavigate();
    const { user, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        backpackSport: '',
        backpackTopic: '',
        backpackAgeGroup: '',
        backpackTrainingType: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                backpackSport: user.backpackSport || '',
                backpackTopic: user.backpackTopic || '',
                backpackAgeGroup: user.backpackAgeGroup || '',
                backpackTrainingType: user.backpackTrainingType || ''
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await api.put('/users/backpack', formData);
            await refreshUser();
            alert('تنظیمات کوله با موفقیت ذخیره شد!');
        } catch (error) {
            console.error(error);
            alert('خطا در ذخیره اطلاعات');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="view-training-backpack" className="view-section fade-in">
            <div className="sticky-top-bar">
                <button className="btn-top-action btn-back-top" onClick={() => navigate('/dashboard')}><i className="fa fa-arrow-right"></i> بازگشت</button>
                <h3 className="sticky-title">کوله تمرینات</h3>
                <div style={{ "width": "80px" }}></div>
            </div>

            <div className="backpack-container">
                <div className="backpack-header">
                    <div className="backpack-icon">
                        <i className="fa fa-briefcase"></i>
                    </div>
                    <div className="backpack-title-box">
                        <h2>کوله پشتی تمرین شما</h2>
                        <p>برنامه‌ها و آیتم‌های تمرینی خود را در اینجا پیکربندی کنید</p>
                    </div>
                </div>

                <div className="backpack-form-card">
                    <form className="backpack-form">
                        <div className="form-group">
                            <label>رشته ورزشی</label>
                            <CustomSelect name="backpackSport" value={formData.backpackSport} onChange={handleChange} className="form-control">
                                <option value="">انتخاب کنید...</option>
                                <option value="football">فوتبال</option>
                                <option value="futsal">فوتسال</option>
                            </CustomSelect>
                        </div>

                        <div className="form-group">
                            <label>موضوع تمرین</label>
                            <CustomSelect name="backpackTopic" value={formData.backpackTopic} onChange={handleChange} className="form-control">
                                <option value="">انتخاب کنید...</option>
                                <option value="tactical">تاکتیکی</option>
                                <option value="technical">تکنیکی</option>
                                <option value="physical">بدنسازی و آمادگی جسمانی</option>
                            </CustomSelect>
                        </div>

                        <div className="form-group">
                            <label>رده سنی</label>
                            <CustomSelect name="backpackAgeGroup" value={formData.backpackAgeGroup} onChange={handleChange} className="form-control">
                                <option value="">انتخاب کنید...</option>
                                <option value="u10">زیر ۱۰ سال</option>
                                <option value="u14">نونهالان (زیر ۱۴ سال)</option>
                                <option value="u16">نوجوانان (زیر ۱۶ سال)</option>
                                <option value="u18">جوانان (زیر ۱۸ سال)</option>
                                <option value="adults">بزرگسالان</option>
                            </CustomSelect>
                        </div>

                        <div className="form-group">
                            <label>نوع تمرین</label>
                            <CustomSelect name="backpackTrainingType" value={formData.backpackTrainingType} onChange={handleChange} className="form-control">
                                <option value="">انتخاب کنید...</option>
                                <option value="group">گروهی</option>
                                <option value="individual">انفرادی</option>
                                <option value="match">بازی تدارکاتی</option>
                            </CustomSelect>
                        </div>

                        <button type="button" className="btn-backpack-submit" onClick={handleSubmit} disabled={loading}>
                            {loading ? 'در حال ذخیره...' : 'ذخیره تنظیمات و مشاهده برنامه‌ها'}
                        </button>
                <StickySubmitButton loading={loading} text="ثبت اطلاعات" loadingText="در حال ثبت..." />

            </form>
                </div>
            </div>
        </div>
    );
}
