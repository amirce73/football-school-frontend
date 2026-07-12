import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import StickySubmitButton from '../../components/StickySubmitButton';
import { isValidIranianNationalId } from '../../utils/validations';
import CustomScrollDatePicker from '../../components/CustomScrollDatePicker';
import { useAuth } from '../../contexts/AuthContext';

const schema = yup.object().shape({
    nationalId: yup.string().length(10, 'کد ملی باید دقیقاً ۱۰ رقم باشد')
        .matches(/^[0-9]+$/, 'فقط عدد مجاز است')
        .test('isValidNationalId', 'کد ملی وارد شده معتبر نیست', (value) => isValidIranianNationalId(value || ''))
        .required('کد ملی الزامی است'),
    birthDate: yup.string().required('تاریخ تولد الزامی است')
});

type FormData = yup.InferType<typeof schema>;

export default function Verification() {
    const navigate = useNavigate();
    const { simulateVerification } = useAuth();
    const [loading, setLoading] = useState(false);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [step, setStep] = useState<'initial' | 'processing' | 'success'>('initial');
    const [verifiedData, setVerifiedData] = useState<any>(null);

    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema),
        mode: 'onChange'
    });

    const convertPersianToEnglishDigits = (str: string) => {
        const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return str.replace(/[۰-۹]/g, w => persianDigits.indexOf(w).toString());
    };

    const enforceNumericLength = (e: React.FormEvent<HTMLInputElement>, maxLength: number) => {
        const val = e.currentTarget.value;
        const converted = convertPersianToEnglishDigits(val);
        e.currentTarget.value = converted.replace(/[^0-9]/g, '');
        if (e.currentTarget.value.length > maxLength) {
            e.currentTarget.value = e.currentTarget.value.slice(0, maxLength);
        }
    };

    const handleDateChange = (date: any) => {
        if (!date) {
            setValue('birthDate', '', { shouldValidate: true });
            return;
        }
        const persianDate = date.format("YYYY/MM/DD");
        const englishDate = convertPersianToEnglishDigits(persianDate);
        setValue('birthDate', englishDate, { shouldValidate: true });
    };

    const onSubmit = (data: FormData) => {
        setStep('processing');
        // شبیه‌سازی پرداخت و دریافت اطلاعات از سامانه
        setTimeout(() => {
            const resultData = {
                firstName: "علی",
                lastName: "محمدی",
                birthDate: data.birthDate,
                nationalId: data.nationalId,
                fatherName: "حسین",
                birthCertificateNo: "12345678"
            };
            simulateVerification('identity', resultData);

            simulateVerification('bank', {
                cardNumber: "6037991122334455",
                sheba: "120140040000000000000000"
            });

            simulateVerification('postal', {
                postalCode: "1234567890",
                address: "تهران، میدان آزادی، خیابان آزادی، پلاک ۱"
            });

            setVerifiedData(resultData);
            setStep('success');
        }, 3000);
    };

    return (
        <div id="view-verification" className="view-section fade-in">
            <div className="sticky-top-bar">
                <button type="button" className="btn-top-action btn-back-top" onClick={() => navigate('/profile-hub')}><i className="fa fa-arrow-right"></i> بازگشت</button>
                <h3 className="sticky-title">احراز هویت حساب</h3>
            </div>

            {step === 'initial' && (
                <>
                    <div style={{ "background": "var(--primary-light)", "color": "var(--primary)", "padding": "16px", "borderRadius": "var(--radius-md)", "marginBottom": "16px", "fontSize": "0.8rem", "fontWeight": "700", "lineHeight": "1.6" }}>
                        <i className="fa fa-info-circle" style={{ "fontSize": "1.1rem", "marginBottom": "6px", "marginLeft": "3px" }}></i>
                        با پرداخت هزینه استعلام (۵,۰۰۰ تومان)، اطلاعات شما به صورت خودکار از سامانه ثبت احوال دریافت و در پروفایل شما ثبت می‌شود.
                    </div>

                    <div className="card">
                        <form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
                            <div className="input-group">
                                <label className={errors.nationalId ? 'error-label' : ''}>کد ملی (۱۰ رقم) <span className="text-danger">*</span></label>
                                <input type="text" maxLength={10} inputMode="numeric" placeholder="مثال: ۱۲۳۴۵۶۷۸۹۰" {...register('nationalId')} onInput={(e) => enforceNumericLength(e, 10)} className={errors.nationalId ? 'error' : ''} />
                                {errors.nationalId && <span className="error-text"><i className="fa fa-exclamation-triangle"></i> {String(errors.nationalId.message)}</span>}
                            </div>
                            <div className="input-group">
                                <label className={errors.birthDate ? 'error-label' : ''}>تاریخ تولد <span className="text-danger">*</span></label>
                                <Controller
                                    control={control}
                                    name="birthDate"
                                    render={({ field }) => (
                                        <>
                                            <div
                                                className={`date-picker-input ${errors.birthDate ? 'error' : ''}`}
                                                style={{ width: '100%', padding: '12px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', background: '#fff', cursor: 'pointer', minHeight: '44px', display: 'flex', alignItems: 'center' }}
                                                onClick={() => setIsDatePickerOpen(true)}
                                            >
                                                {field.value || <span style={{ color: '#94a3b8' }}>انتخاب تاریخ</span>}
                                            </div>
                                            <CustomScrollDatePicker
                                                isOpen={isDatePickerOpen}
                                                onClose={() => setIsDatePickerOpen(false)}
                                                onConfirm={(dateString) => {
                                                    field.onChange(dateString);
                                                    setIsDatePickerOpen(false);
                                                }}
                                                initialDate={field.value}
                                            />
                                        </>
                                    )}
                                />
                                {errors.birthDate && <span className="error-text"><i className="fa fa-exclamation-triangle"></i> {String(errors.birthDate.message)}</span>}
                            </div>

                            <div className="input-group" style={{ gridColumn: '1 / -1', marginTop: '16px' }}>
                                <button type="submit" className="btn-app-primary" disabled={loading} style={{ width: '100%', padding: '14px', borderRadius: '10px', fontSize: '1rem', fontWeight: 'bold', backgroundColor: 'var(--success)' }}>
                                    {loading ? 'در حال انتقال به درگاه...' : 'پرداخت و استعلام (۵,۰۰۰ تومان)'}
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}

            {step === 'processing' && (
                <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <i className="fa fa-spinner fa-spin" style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '16px' }}></i>
                    <h4>در حال ارتباط با سامانه شاهکار...</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>لطفاً شکیبا باشید، این فرآیند ممکن است چند لحظه طول بکشد.</p>
                </div>
            )}

            {step === 'success' && verifiedData && (
                <div className="card fade-in" style={{ textAlign: 'center', padding: '30px 20px' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 16px auto' }}>
                        <i className="fa fa-check"></i>
                    </div>
                    <h3 style={{ color: '#16a34a', marginBottom: '8px' }}>استعلام موفقیت‌آمیز بود!</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>اطلاعات هویتی شما با موفقیت از سامانه دریافت شد و در پروفایل شما قفل گردید.</p>

                    <div style={{ background: '#f8fafc', borderRadius: 'var(--radius-md)', padding: '16px', textAlign: 'right', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px dashed #cbd5e1', paddingBottom: '8px' }}>
                            <span style={{ color: 'var(--text-muted)' }}>نام و نام خانوادگی:</span>
                            <strong>{verifiedData.firstName} {verifiedData.lastName}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px dashed #cbd5e1', paddingBottom: '8px' }}>
                            <span style={{ color: 'var(--text-muted)' }}>کد ملی:</span>
                            <strong>{verifiedData.nationalId}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px dashed #cbd5e1', paddingBottom: '8px' }}>
                            <span style={{ color: 'var(--text-muted)' }}>تاریخ تولد:</span>
                            <strong>{verifiedData.birthDate}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px dashed #cbd5e1', paddingBottom: '8px' }}>
                            <span style={{ color: 'var(--text-muted)' }}>نام پدر:</span>
                            <strong>{verifiedData.fatherName}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)' }}>شماره شناسنامه:</span>
                            <strong>{verifiedData.birthCertificateNo}</strong>
                        </div>
                    </div>

                    <button className="btn-app-primary" onClick={() => navigate('/profile-hub')} style={{ width: '100%', padding: '12px' }}>بازگشت به پروفایل</button>
                </div>
            )}
        </div>
    );
}
