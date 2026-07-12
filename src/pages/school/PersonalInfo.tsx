import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isValidIranianNationalId } from '../../utils/validations';
import api from '../../api';
import { useAuth } from '../../contexts/AuthContext';
import { useForm, Controller } from 'react-hook-form';
import { useFormDraft } from '../../hooks/useFormDraft';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CustomSelect from '../../components/CustomSelect';
import StickySubmitButton from '../../components/StickySubmitButton';
import CustomScrollDatePicker from '../../components/CustomScrollDatePicker';
import DateObjectModule from "react-date-object";
import persianModule from "react-date-object/calendars/persian";

const DateObject = (DateObjectModule as any).default || DateObjectModule;
const persian = (persianModule as any).default || persianModule;

const schema = yup.object().shape({
    firstName: yup.string().required('نام الزامی است').matches(/^[آ-یژپچگ\s]+$/, 'فقط حروف فارسی مجاز است'),
    lastName: yup.string().required('نام خانوادگی الزامی است').matches(/^[آ-یژپچگ\s]+$/, 'فقط حروف فارسی مجاز است'),
    nationalId: yup.string().length(10, 'کد ملی باید دقیقاً ۱۰ رقم باشد')
        .matches(/^[0-9]+$/, 'فقط عدد مجاز است')
        .test('isValidNationalId', 'کد ملی وارد شده معتبر نیست', (value) => isValidIranianNationalId(value || ''))
        .required('کد ملی الزامی است'),
    birthDate: yup.string().required('تاریخ تولد الزامی است')
        .test('not-future', 'تاریخ تولد نمی‌تواند در آینده باشد', function (value) {
            if (!value) return true;
            const today = new DateObject({ calendar: persian });
            const todayStr = `${today.year}/${today.month.number.toString().padStart(2, '0')}/${today.day.toString().padStart(2, '0')}`;
            const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
            const englishValue = value.replace(/[۰-۹]/g, (w: string) => persianDigits.indexOf(w).toString());
            return englishValue <= todayStr;
        }),
    birthCertificateNo: yup.string().matches(/^[0-9]{1,10}$/, 'شماره شناسنامه حداکثر ۱۰ رقم و فقط عدد است').nullable(),
    fatherName: yup.string().matches(/^[آ-یژپچگ\s]*$/, 'فقط حروف فارسی مجاز است').nullable(),
    gender: yup.string().required('جنسیت الزامی است'),
    height: yup.string().matches(/^[0-9]*$/, 'فقط عدد مجاز است').nullable(),
    weight: yup.string().matches(/^[0-9]*$/, 'فقط عدد مجاز است').nullable(),
    bloodGroup: yup.string().nullable(),
    maritalStatus: yup.string().nullable(),
    militaryServiceStatus: yup.string().nullable(),
    religion: yup.string().required('دین الزامی است'),
    sect: yup.string().nullable(),
    occupation: yup.string().nullable(),
    healthStatus: yup.string().nullable(),
    description: yup.string().nullable()
});

type FormData = yup.InferType<typeof schema>;

export default function PersonalInfo() {
    const navigate = useNavigate();
    const methods = useForm<any>({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            gender: 'مرد'
        }
    });
    const { user, refreshUser } = useAuth();
    const [loading, setLoading] = React.useState(false);
    const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);

    const { register, handleSubmit, control, reset, formState: { errors } } = methods;
    const { clearDraft } = useFormDraft('personalinfo', methods);

    useEffect(() => {
        if (user) {
            reset({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                nationalId: user.nationalId || '',
                birthDate: user.birthDate || '',
                fatherName: user.fatherName || '',
                gender: user.gender || 'مرد',
                height: user.height || null,
                weight: user.weight || null,
                birthCertificateNo: user.birthCertificateNo || '',
                bloodGroup: user.bloodGroup || '',
                healthStatus: user.healthStatus || '',
                maritalStatus: user.maritalStatus || '',
                militaryServiceStatus: user.militaryServiceStatus || '',
                religion: user.religion || '',
                sect: user.sect || '',
                occupation: user.occupation || '',
                description: user.description || ''
            });
        }
    }, [user, reset]);

    const convertPersianToEnglishDigits = (str: string) => {
        const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return str.replace(/[۰-۹]/g, w => persianDigits.indexOf(w).toString());
    };

    const enforcePersian = (e: React.FormEvent<HTMLInputElement>) => {
        e.currentTarget.value = e.currentTarget.value.replace(/[^آ-یژپچگ\s]/g, '');
    };

    const enforceNumeric = (e: React.FormEvent<HTMLInputElement>) => {
        const val = e.currentTarget.value;
        const converted = convertPersianToEnglishDigits(val);
        e.currentTarget.value = converted.replace(/[^0-9]/g, '');
    };

    const enforceNumericLength = (e: React.FormEvent<HTMLInputElement>, maxLength: number) => {
        enforceNumeric(e);
        if (e.currentTarget.value.length > maxLength) {
            e.currentTarget.value = e.currentTarget.value.slice(0, maxLength);
        }
    };

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            await api.post('/Profile/personal-info', data);
            clearDraft();
            await refreshUser();
            alert('اطلاعات با موفقیت ذخیره شد!');
        } catch (error) {
            console.error('Error saving data:', error);
            alert('خطا در ذخیره اطلاعات');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="view-personal-info" className="view-section fade-in">
            <div className="sticky-top-bar">
                <button type="button" className="btn-top-action btn-back-top" onClick={() => navigate('/profile-hub')}>
                    <i className="fa fa-arrow-right"></i> بازگشت</button>
                <h3 className="sticky-title">اطلاعات فردی</h3>
            </div>

            <div className="card">
                <form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
                    <div className="input-group">
                        <label className={errors.firstName ? 'error-label' : ''}>
                            نام <span className="text-danger">*</span>
                            {user?.isIdentityVerified && <i className="fa fa-check-circle text-success" style={{ marginRight: '4px' }}></i>}
                        </label>
                        <input type="text" maxLength={50} {...register('firstName')} onInput={enforcePersian} className={errors.firstName ? 'error' : ''} readOnly={user?.isIdentityVerified} style={user?.isIdentityVerified ? { background: '#f1f5f9', color: '#64748b' } : {}} />
                        {errors.firstName && <span className="error-text"><i className="fa fa-exclamation-triangle"></i> {String(errors.firstName.message)}</span>}
                    </div>

                    <div className="input-group">
                        <label className={errors.lastName ? 'error-label' : ''}>
                            نام خانوادگی <span className="text-danger">*</span>
                            {user?.isIdentityVerified && <i className="fa fa-check-circle text-success" style={{ marginRight: '4px' }}></i>}
                        </label>
                        <input type="text" maxLength={50} {...register('lastName')} onInput={enforcePersian} className={errors.lastName ? 'error' : ''} readOnly={user?.isIdentityVerified} style={user?.isIdentityVerified ? { background: '#f1f5f9', color: '#64748b' } : {}} />
                        {errors.lastName && <span className="error-text"><i className="fa fa-exclamation-triangle"></i> {String(errors.lastName.message)}</span>}
                    </div>

                    <div className="input-group">
                        <label className={errors.nationalId ? 'error-label' : ''}>
                            کد ملی (۱۰ رقم) <span className="text-danger">*</span>
                            {user?.isIdentityVerified && <i className="fa fa-check-circle text-success" style={{ marginRight: '4px' }}></i>}
                        </label>
                        <input type="text" maxLength={10} inputMode="numeric" {...register('nationalId')} onInput={(e) => enforceNumericLength(e, 10)} className={errors.nationalId ? 'error' : ''} readOnly={user?.isIdentityVerified} style={user?.isIdentityVerified ? { background: '#f1f5f9', color: '#64748b' } : {}} />
                        {errors.nationalId && <span className="error-text"><i className="fa fa-exclamation-triangle"></i> {String(errors.nationalId.message)}</span>}
                    </div>

                    <div className="input-group">
                        <label className={errors.birthDate ? 'error-label' : ''}>
                            تاریخ تولد <span className="text-danger">*</span>
                            {user?.isIdentityVerified && <i className="fa fa-check-circle text-success" style={{ marginRight: '4px' }}></i>}
                        </label>
                        <Controller
                            control={control}
                            name="birthDate"
                            render={({ field }) => (
                                <>
                                    <div
                                        className={`date-picker-input ${errors.birthDate ? 'error' : ''}`}
                                        style={{ width: '100%', padding: '12px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', background: user?.isIdentityVerified ? '#f1f5f9' : '#fff', color: user?.isIdentityVerified ? '#64748b' : 'inherit', cursor: user?.isIdentityVerified ? 'default' : 'pointer', minHeight: '44px', display: 'flex', alignItems: 'center' }}
                                        onClick={() => !user?.isIdentityVerified && setIsDatePickerOpen(true)}
                                    >
                                        {field.value || <span style={{ color: '#94a3b8' }}>انتخاب تاریخ</span>}
                                    </div>
                                    {!user?.isIdentityVerified && (
                                        <CustomScrollDatePicker
                                            isOpen={isDatePickerOpen}
                                            onClose={() => setIsDatePickerOpen(false)}
                                            onConfirm={(dateString) => {
                                                field.onChange(dateString);
                                                setIsDatePickerOpen(false);
                                            }}
                                            initialDate={field.value}
                                        />
                                    )}
                                </>
                            )}
                        />
                        {errors.birthDate && <span className="error-text"><i className="fa fa-exclamation-triangle"></i> {String(errors.birthDate.message)}</span>}
                    </div>

                    <div className="input-group">
                        <label className={errors.birthCertificateNo ? 'error-label' : ''}>
                            شماره شناسنامه
                            {user?.isIdentityVerified && <i className="fa fa-check-circle text-success" style={{ marginRight: '4px' }}></i>}
                        </label>
                        <input type="text" maxLength={10} inputMode="numeric" {...register('birthCertificateNo')} onInput={(e) => enforceNumericLength(e, 10)} className={errors.birthCertificateNo ? 'error' : ''} readOnly={user?.isIdentityVerified} style={user?.isIdentityVerified ? { background: '#f1f5f9', color: '#64748b' } : {}} />
                        {errors.birthCertificateNo && <span className="error-text"><i className="fa fa-exclamation-triangle"></i> {String(errors.birthCertificateNo.message)}</span>}
                    </div>

                    <div className="input-group">
                        <label className={errors.fatherName ? 'error-label' : ''}>
                            نام پدر
                            {user?.isIdentityVerified && <i className="fa fa-check-circle text-success" style={{ marginRight: '4px' }}></i>}
                        </label>
                        <input type="text" maxLength={50} {...register('fatherName')} onInput={enforcePersian} className={errors.fatherName ? 'error' : ''} readOnly={user?.isIdentityVerified} style={user?.isIdentityVerified ? { background: '#f1f5f9', color: '#64748b' } : {}} />
                        {errors.fatherName && <span className="error-text"><i className="fa fa-exclamation-triangle"></i> {String(errors.fatherName.message)}</span>}
                    </div>

                    <div className="input-group">
                        <label className={errors.gender ? 'error-label' : ''}>جنسیت <span className="text-danger">*</span></label>
                        <CustomSelect {...register('gender')} className={errors.gender ? 'error' : ''}>
                            <option value="مرد">مرد</option>
                            <option value="زن">زن</option>
                        </CustomSelect>
                        {errors.gender && <span className="error-text"><i className="fa fa-exclamation-triangle"></i> {String(errors.gender.message)}</span>}
                    </div>

                    <div className="input-group">
                        <label className={errors.height ? 'error-label' : ''}>قد (سانتی‌متر)</label>
                        <input type="text" maxLength={3} inputMode="numeric" {...register('height')} onInput={(e) => enforceNumericLength(e, 3)} className={errors.height ? 'error' : ''} />
                        {errors.height && <span className="error-text"><i className="fa fa-exclamation-triangle"></i> {String(errors.height.message)}</span>}
                    </div>

                    <div className="input-group">
                        <label className={errors.weight ? 'error-label' : ''}>وزن (کیلوگرم)</label>
                        <input type="text" maxLength={3} inputMode="numeric" {...register('weight')} onInput={(e) => enforceNumericLength(e, 3)} className={errors.weight ? 'error' : ''} />
                        {errors.weight && <span className="error-text"><i className="fa fa-exclamation-triangle"></i> {String(errors.weight.message)}</span>}
                    </div>

                    <div className="input-group">
                        <label>گروه خونی</label>
                        <CustomSelect {...register('bloodGroup')}>
                            <option value="">انتخاب کنید...</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </CustomSelect>
                    </div>

                    <div className="input-group">
                        <label>وضعیت تاهل</label>
                        <CustomSelect {...register('maritalStatus')}>
                            <option value="">انتخاب کنید...</option>
                            <option value="مجرد">مجرد</option>
                            <option value="متاهل">متاهل</option>
                        </CustomSelect>
                    </div>

                    <div className="input-group">
                        <label>وضعیت نظام وظیفه</label>
                        <CustomSelect {...register('militaryServiceStatus')}>
                            <option value="">انتخاب کنید...</option>
                            <option value="مشمول">مشمول</option>
                            <option value="معافیت تحصیلی">معافیت تحصیلی</option>
                            <option value="معافیت دائم">معافیت دائم</option>
                            <option value="پایان خدمت">پایان خدمت</option>
                        </CustomSelect>
                    </div>

                    <div className="input-group">
                        <label className={errors.religion ? 'error-label' : ''}>دین <span className="text-danger">*</span></label>
                        <CustomSelect {...register('religion')} className={errors.religion ? 'error' : ''}>
                            <option value="">انتخاب کنید...</option>
                            <option value="اسلام">اسلام</option>
                            <option value="مسیحیت">مسیحیت</option>
                            <option value="یهودیت">یهودیت</option>
                            <option value="زرتشتی">زرتشتی</option>
                            <option value="سایر">سایر</option>
                        </CustomSelect>
                        {errors.religion && <span className="error-text"><i className="fa fa-exclamation-triangle"></i> {String(errors.religion.message)}</span>}
                    </div>

                    <div className="input-group">
                        <label className={errors.sect ? 'error-label' : ''}>مذهب</label>
                        <CustomSelect {...register('sect')} className={errors.sect ? 'error' : ''}>
                            <option value="">انتخاب کنید...</option>
                            <option value="شیعه">شیعه</option>
                            <option value="سنی">سنی</option>
                        </CustomSelect>
                        {errors.sect && <span className="error-text"><i className="fa fa-exclamation-triangle"></i> {String(errors.sect.message)}</span>}
                    </div>

                    <div className="input-group">
                        <label className={errors.occupation ? 'error-label' : ''}>شغل</label>
                        <input type="text" maxLength={50} {...register('occupation')} onInput={enforcePersian} className={errors.occupation ? 'error' : ''} />
                        {errors.occupation && <span className="error-text"><i className="fa fa-exclamation-triangle"></i> {String(errors.occupation.message)}</span>}
                    </div>

                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                        <label>وضعیت سلامت و بیماری‌های خاص</label>
                        <textarea rows={2} maxLength={500} {...register('healthStatus')} placeholder="اگر بیماری خاصی دارید اینجا بنویسید"></textarea>
                    </div>

                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                        <label>توضیحات</label>
                        <textarea rows={3} maxLength={500} {...register('description')}></textarea>
                    </div>
                    <StickySubmitButton loading={loading} text="ثبت اطلاعات" loadingText="در حال ثبت..." />

                </form>
            </div>
        </div>
    );
}
