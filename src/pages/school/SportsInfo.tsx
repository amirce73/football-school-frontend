import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { useFormDraft } from '../../hooks/useFormDraft';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CustomSelect from '../../components/CustomSelect';
import StickySubmitButton from '../../components/StickySubmitButton';

const schema = yup.object().shape({
    competitionSeason: yup.string().nullable(),
    mainPosition: yup.string().required('پست اصلی الزامی است'),
    playingAbility: yup.string().matches(/^[آ-یژپچگ\s،-]*$/, 'فقط حروف فارسی مجاز است').nullable(),
    preferredFoot: yup.string().required('پای تخصصی الزامی است'),
    hasNationalTeam: yup.boolean().default(false),
    shirtSize: yup.string().required('سایز پیراهن الزامی است'),
    shortsSize: yup.string().required('سایز شورت الزامی است'),
    footballShoeSize: yup.string().nullable().test('is-valid-shoe', 'سایز کفش ۲ رقمی است (مانند ۴۲)', val => !val || /^[0-9]{2}$/.test(val)),
    slipperSize: yup.string().nullable().test('is-valid-slipper', 'سایز کفش ۲ رقمی است (مانند ۴۲)', val => !val || /^[0-9]{2}$/.test(val)),
    sportsWarmerSize: yup.string().nullable(),
    sportsSlogan: yup.string().max(100, 'شعار ورزشی نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد').nullable(),
    description: yup.string().max(500, 'توضیحات نمی‌تواند بیشتر از ۵۰۰ کاراکتر باشد').nullable()
});

type FormData = yup.InferType<typeof schema>;

export default function SportsInfo() {
    const navigate = useNavigate();
    const methods = useForm<any>({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            mainPosition: 'مهاجم',
            preferredFoot: 'راست',
            hasNationalTeam: false
        }
    });
    const { user, refreshUser } = useAuth();
    const [loading, setLoading] = React.useState(false);

    const { register, handleSubmit, reset, watch, formState: { errors } } = methods;
    const { clearDraft } = useFormDraft('sportsinfo', methods);

    useEffect(() => {
        console.log('User sports info:', user?.sports);
        if (user && user.sports) {
            console.log('Resetting form with:', user.sports);
            reset({
                competitionSeason: user.sports.competitionSeason || '',
                mainPosition: user.sports.mainPosition || 'مهاجم',
                playingAbility: user.sports.playingAbility || '',
                preferredFoot: user.sports.preferredFoot || 'راست',
                hasNationalTeam: user.sports.hasNationalTeam || false,
                sportsInsuranceNumber: user.sports.sportsInsuranceNumber || '',
                shirtSize: user.sports.shirtSize || '',
                shortsSize: user.sports.shortsSize || '',
                footballShoeSize: user.sports.footballShoeSize || '',
                slipperSize: user.sports.slipperSize || '',
                sportsWarmerSize: user.sports.sportsWarmerSize || '',
                sportsSlogan: user.sports.sportsSlogan || '',
                description: user.sports.description || ''
            });
        }
    }, [user, reset]);

    const convertPersianToEnglishDigits = (str: string) => {
        const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return str.replace(/[۰-۹]/g, w => persianDigits.indexOf(w).toString());
    };

    const enforceNumericLength = (e: React.FormEvent<HTMLInputElement>, maxLength: number) => {
        const val = e.currentTarget.value;
        const converted = convertPersianToEnglishDigits(val);
        let digitsOnly = converted.replace(/[^0-9]/g, '');
        if (digitsOnly.length > maxLength) {
            digitsOnly = digitsOnly.slice(0, maxLength);
        }
        e.currentTarget.value = digitsOnly;
    };

    const enforceNumeric = (e: React.FormEvent<HTMLInputElement>) => {
        const val = e.currentTarget.value;
        const converted = convertPersianToEnglishDigits(val);
        e.currentTarget.value = converted.replace(/[^0-9]/g, '');
    };

    const enforceEnglishAlphaNumeric = (e: React.FormEvent<HTMLInputElement>) => {
        e.currentTarget.value = e.currentTarget.value.replace(/[^A-Za-z0-9]/g, '');
    };

    const enforcePersian = (e: React.FormEvent<HTMLInputElement>) => {
        e.currentTarget.value = e.currentTarget.value.replace(/[^آ-یژپچگ\s،-]/g, '');
    };

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            const payload = {
                ...data,
                dominantFoot: data.preferredFoot,
                nationalTeamExperience: data.hasNationalTeam ? 'بله' : 'خیر',
                shoeSize: data.footballShoeSize ? parseInt(data.footballShoeSize, 10) : null
            };
            await api.put('/users/sports-info', payload);
            clearDraft();
            await refreshUser();
            alert('مشخصات ورزشی با موفقیت ذخیره شد!');
        } catch (error) {
            console.error('Error saving data:', error);
            alert('خطا در ذخیره اطلاعات');
        } finally {
            setLoading(false);
        }
    };

    const onError = (errors: any) => {
        alert('لطفا خطاهای فرم را برطرف کنید:\n' + Object.values(errors).map((e: any) => '- ' + e.message).join('\n'));
    };

    return (
        <div id="view-sports-info" className="view-section fade-in">
            <div className="sticky-top-bar">
                <button type="button" className="btn-top-action btn-back-top" onClick={() => navigate('/profile-hub')}>
                    <i className="fa fa-arrow-right"></i> بازگشت</button>
                <h3 className="sticky-title">مشخصات ورزشی</h3>

            </div>

            <div className="card">
                <form className="form-grid" onSubmit={handleSubmit(onSubmit, onError)}>
                    <div className="input-group">
                        <label className={errors.competitionSeason ? 'error-label' : ''}>فصل مسابقاتی</label>
                        <CustomSelect {...register('competitionSeason')} value={watch('competitionSeason')} className={errors.competitionSeason ? 'error' : ''}>
                            <option value="">انتخاب کنید...</option>
                            <option value="1402-1403">1402-1403</option>
                            <option value="1403-1404">1403-1404</option>
                        </CustomSelect>
                        {errors.competitionSeason && <span className="error-text"><i className="fa fa-exclamation-triangle"></i> {String(errors.competitionSeason.message)}</span>}
                    </div>

                    <div className="input-group">
                        <label className={errors.mainPosition ? 'error-label' : ''}>پست اصلی <span className="text-danger">*</span></label>
                        <CustomSelect {...register('mainPosition')} value={watch('mainPosition')} className={errors.mainPosition ? 'error' : ''}>
                            <option value="مهاجم">مهاجم</option>
                            <option value="هافبک">هافبک</option>
                            <option value="مدافع">مدافع</option>
                            <option value="دروازه‌بان">دروازه‌بان</option>
                        </CustomSelect>
                        {errors.mainPosition && <span className="error-text"><i className="fa fa-exclamation-triangle"></i> {String(errors.mainPosition.message)}</span>}
                    </div>

                    <div className="input-group">
                        <label className={errors.playingAbility ? 'error-label' : ''}>توانایی بازی در پست</label>
                        <input type="text" {...register('playingAbility')} onInput={enforcePersian} placeholder="مثال: هافبک دفاعی، دفاع وسط" className={errors.playingAbility ? 'error' : ''} />
                        {errors.playingAbility && <span className="error-text"><i className="fa fa-exclamation-triangle"></i> {String(errors.playingAbility.message)}</span>}
                    </div>

                    <div className="input-group">
                        <label className={errors.preferredFoot ? 'error-label' : ''}>پای تخصصی <span className="text-danger">*</span></label>
                        <CustomSelect {...register('preferredFoot')} value={watch('preferredFoot')} className={errors.preferredFoot ? 'error' : ''}>
                            <option value="راست">راست</option>
                            <option value="چپ">چپ</option>
                            <option value="هردو">هردو</option>
                        </CustomSelect>
                        {errors.preferredFoot && <span className="error-text"><i className="fa fa-exclamation-triangle"></i> {String(errors.preferredFoot.message)}</span>}
                    </div>

                    <div className="input-group">
                        <label>سابقه بازی در تیم ملی؟</label>
                        <CustomSelect {...register('hasNationalTeam', {
                            setValueAs: v => v === 'true' || v === true
                        })} value={watch('hasNationalTeam')}>
                            <option value="false">خیر</option>
                            <option value="true">بله</option>
                        </CustomSelect>
                    </div>

                    <div className="input-group">
                        <label>تاریخ اعتبار بیمه ورزشی</label>
                        <input type="text" value="۱۴۰۴/۰۸/۲۵" readOnly disabled style={{ background: '#f1f5f9', cursor: 'not-allowed', color: '#64748b' }} />
                    </div>

                    <div className="input-group">
                        <label className={errors.shirtSize ? 'error-label' : ''}>سایز پیراهن ورزشی <span className="text-danger">*</span></label>
                        <CustomSelect {...register('shirtSize')} value={watch('shirtSize')} className={errors.shirtSize ? 'error' : ''}>
                            <option value="">انتخاب کنید...</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                            <option value="XXL">XXL</option>
                        </CustomSelect>
                        {errors.shirtSize && <span className="error-text"><i className="fa fa-exclamation-triangle"></i> {String(errors.shirtSize.message)}</span>}
                    </div>

                    <div className="input-group">
                        <label className={errors.shortsSize ? 'error-label' : ''}>سایز شورت ورزشی <span className="text-danger">*</span></label>
                        <CustomSelect {...register('shortsSize')} value={watch('shortsSize')} className={errors.shortsSize ? 'error' : ''}>
                            <option value="">انتخاب کنید...</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                            <option value="XXL">XXL</option>
                        </CustomSelect>
                        {errors.shortsSize && <span className="error-text"><i className="fa fa-exclamation-triangle"></i> {String(errors.shortsSize.message)}</span>}
                    </div>

                    <div className="input-group">
                        <label className={errors.sportsWarmerSize ? 'error-label' : ''}>سایز گرمکن ورزشی</label>
                        <CustomSelect {...register('sportsWarmerSize')} value={watch('sportsWarmerSize')} className={errors.sportsWarmerSize ? 'error' : ''}>
                            <option value="">انتخاب کنید...</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                            <option value="XXL">XXL</option>
                        </CustomSelect>
                        {errors.sportsWarmerSize && <span className="error-text"><i className="fa fa-exclamation-triangle"></i> {String(errors.sportsWarmerSize.message)}</span>}
                    </div>

                    <div className="input-group">
                        <label className={errors.footballShoeSize ? 'error-label' : ''}>سایز کفش فوتبال</label>
                        <input type="text" inputMode="numeric" {...register('footballShoeSize')} onInput={(e) => enforceNumericLength(e, 2)} placeholder="مثال: 42" style={{ textAlign: 'left', direction: 'ltr' }} className={errors.footballShoeSize ? 'error' : ''} />
                        {errors.footballShoeSize && <span className="error-text"><i className="fa fa-exclamation-triangle"></i> {String(errors.footballShoeSize.message)}</span>}
                    </div>

                    <div className="input-group">
                        <label className={errors.slipperSize ? 'error-label' : ''}>سایز کفش راحتی</label>
                        <input type="text" inputMode="numeric" {...register('slipperSize')} onInput={(e) => enforceNumericLength(e, 2)} placeholder="مثال: 42" style={{ textAlign: 'left', direction: 'ltr' }} className={errors.slipperSize ? 'error' : ''} />
                        {errors.slipperSize && <span className="error-text"><i className="fa fa-exclamation-triangle"></i> {String(errors.slipperSize.message)}</span>}
                    </div>

                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                        <label>شعار ورزشی</label>
                        <input type="text" {...register('sportsSlogan')} />
                    </div>

                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                        <label>توضیحات</label>
                        <textarea rows={3} {...register('description')}></textarea>
                    </div>
                    <StickySubmitButton loading={loading} text="ثبت اطلاعات" loadingText="در حال ثبت..." />

                </form>
            </div>
        </div>
    );
}
