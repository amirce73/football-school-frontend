import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { useFormDraft } from '../../hooks/useFormDraft';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import StickySubmitButton from '../../components/StickySubmitButton';
import MapModal from '../../components/MapModal';
import ChangeMobileModal from '../../components/ChangeMobileModal';
import baleIcon from '../../images/icon/Bale_logo.png';
import eitaaIcon from '../../images/icon/eitaa-logo.png';
import rubikaIcon from '../../images/icon/logo-rubika.png';

// رندر آیکون: اگر رشته شامل '.' باشد تصویر، وگرنه Font Awesome
const SocialIcon = ({ icon, size = 16, style = {} }: { icon: string; size?: number; style?: React.CSSProperties }) => {
    if (icon.startsWith('fa ')) {
        return <i className={icon} style={{ fontSize: size, ...style }} />;
    }
    return <img src={icon} alt="" style={{ width: size, height: size, objectFit: 'contain', ...style }} />;
};

const schema = yup.object().shape({
    mobile: yup.string().required('موبایل الزامی است').matches(/^09[0-9]{9}$/, 'موبایل باید ۱۱ رقم باشد و با ۰۹ شروع شود'),
    guardianMobile: yup.string().matches(/^(09[0-9]{9})?$/, 'شماره ولی باید ۱۱ رقم باشد و با ۰۹ شروع شود').nullable(),
    tel: yup.string().matches(/^(0[1-9][0-9]{9})?$/, 'تلفن ثابت باید ۱۱ رقم باشد و با صفر شروع شود (مثال: 021...)').nullable(),
    emergencyPhone: yup.string().matches(/^(0[0-9]{10})?$/, 'تلفن ضروری باید ۱۱ رقم باشد و با صفر (۰) شروع شود').nullable(),
    email: yup.string().matches(/^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})?$/, 'فرمت ایمیل وارد شده معتبر نیست').nullable(),
    telegram: yup.string().nullable(),
    instagram: yup.string().nullable(),
    whatsapp: yup.string().nullable(),
    bale: yup.string().nullable(),
    eitaa: yup.string().nullable(),
    rubika: yup.string().nullable(),
    website: yup.string().matches(/^((https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?)?$/, 'آدرس وب‌سایت وارد شده نامعتبر است').nullable(),
    postalCode: yup.string().required('کد پستی الزامی است').matches(/^[0-9]{10}$/, 'کد پستی باید ۱۰ رقم باشد'),
    address: yup.string().required('آدرس الزامی است'),
    parentsWorkAddress: yup.string().nullable()
});

type FormData = yup.InferType<typeof schema>;

const SOCIAL_NETWORKS = [
    { key: 'telegram', label: 'تلگرام', icon: 'fa fa-telegram', color: '#229ED9', placeholder: 'https://t.me/username' },
    { key: 'instagram', label: 'اینستاگرام', icon: 'fa fa-instagram', color: '#C13584', placeholder: 'https://instagram.com/username' },
    { key: 'whatsapp', label: 'واتساپ', icon: 'fa fa-whatsapp', color: '#25D366', placeholder: 'شماره همراه: 09...' },
    { key: 'bale', label: 'بله', icon: baleIcon, color: '#2ECC71', placeholder: '@username یا شماره' },
    { key: 'eitaa', label: 'ایتا', icon: eitaaIcon, color: '#FF6B35', placeholder: '@username یا شماره' },
    { key: 'rubika', label: 'روبیکا', icon: rubikaIcon, color: '#ff3c00', placeholder: '@username یا شماره' },
];

const checkIdOrPhone = (val: string, name: string) => {
    if (val.startsWith('@')) {
        const raw = val.replace(/^@/, '');
        if (/^[0-9]+$/.test(raw)) {
            return 'شناسه نمی‌تواند فقط شامل عدد باشد';
        }
        return /^@[A-Za-z0-9_]{3,}$/.test(val) ? null : `شناسه ${name} باید حداقل ۳ حرف و شامل حروف انگلیسی باشد`;
    } else {
        if (/^[0-9]+$/.test(val)) {
            return /^09[0-9]{9}$/.test(val) ? null : 'شماره همراه باید ۱۱ رقم و با 09 شروع شود';
        }
        return 'فرمت وارد شده نامعتبر است';
    }
};

const SOCIAL_VALIDATIONS: Record<string, (val: string) => string | null> = {
    telegram: (val) => {
        const idPart = val.replace(/^(https?:\/\/)?(t\.me\/)/, '').replace(/^@/, '');
        if (/^[0-9]+$/.test(idPart)) return 'شناسه تلگرام نمی‌تواند فقط شامل عدد باشد';
        if (/^[0-9]/.test(idPart)) return 'شناسه تلگرام باید با حرف شروع شود';
        return /^(https?:\/\/)?(t\.me\/[A-Za-z0-9_]{5,}|@[A-Za-z0-9_]{5,})$/.test(val) ? null : 'شناسه صحیح تلگرام وارد کنید (حداقل ۵ حرف)';
    },
    instagram: (val) => {
        const idPart = val.replace(/^(https?:\/\/)?(www\.)?instagram\.com\//, '').replace(/^@/, '').replace(/\/?$/, '');
        if (/^[0-9]+$/.test(idPart)) return 'شناسه اینستاگرام نمی‌تواند فقط شامل عدد باشد';
        return /^(https?:\/\/)?(www\.)?instagram\.com\/[A-Za-z0-9._]{1,30}\/?$|^@[A-Za-z0-9._]{1,30}$/.test(val) ? null : 'شناسه صحیح اینستاگرام وارد کنید';
    },
    whatsapp: (val) => /^09[0-9]{9}$/.test(val) ? null : 'شماره واتساپ باید شماره همراه ایرانی باشد (مثال: 09123456789)',
    bale: (val) => checkIdOrPhone(val, 'بله'),
    eitaa: (val) => checkIdOrPhone(val, 'ایتا'),
    rubika: (val) => checkIdOrPhone(val, 'روبیکا'),
};

const displaySocialValue = (network: string, val: string) => {
    if (!val) return '';
    if (network === 'telegram') return val.replace(/^(https?:\/\/)?(t\.me\/)/, '@').replace(/\/?$/, '');
    if (network === 'instagram') return val.replace(/^(https?:\/\/)?(www\.)?instagram\.com\//, '@').replace(/\/?$/, '');
    return val;
};

export default function ContactInfo() {
    const navigate = useNavigate();
    const methods = useForm<any>({
        resolver: yupResolver(schema),
        mode: 'onChange'
    });
    const { user, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [activeMapField, setActiveMapField] = useState<'address' | 'parentsWorkAddress' | null>(null);
    const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
    const [addingNew, setAddingNew] = useState(false);
    const [pendingNetwork, setPendingNetwork] = useState<string>('');
    const [pendingValue, setPendingValue] = useState('');
    const [editingNetwork, setEditingNetwork] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const [pendingError, setPendingError] = useState('');
    const [editError, setEditError] = useState('');
    const dropdownTriggerRef = useRef<HTMLDivElement>(null);
    const dropdownContainerRef = useRef<HTMLDivElement>(null);

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = methods;
    const { clearDraft } = useFormDraft('contactinfo', methods);

    useEffect(() => {
        if (user && user.contact) {
            reset({
                mobile: user.contact.mobile || '',
                guardianMobile: user.contact.guardianMobile || '',
                tel: user.contact.tel || '',
                emergencyPhone: user.contact.emergencyPhone || '',
                email: user.contact.email || '',
                telegram: user.contact.telegram || '',
                instagram: user.contact.instagram || '',
                whatsapp: user.contact.whatsapp || '',
                bale: user.contact.bale || '',
                eitaa: user.contact.eitaa || '',
                rubika: user.contact.rubika || '',
                website: user.contact.website || '',
                postalCode: user.contact.postalCode || '',
                address: user.contact.address || '',
                parentsWorkAddress: user.contact.parentsWorkAddress || ''
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

    const enforceEnglishAndSymbols = (e: React.FormEvent<HTMLInputElement>) => {
        // Allow English letters, digits, and common symbols used in URLs/Emails/Handles
        e.currentTarget.value = e.currentTarget.value.replace(/[^A-Za-z0-9@._:\/\-]/g, '');
    };

    const enforceSocialInput = (e: React.FormEvent<HTMLInputElement>, network: string) => {
        if (network === 'whatsapp') {
            enforceNumericLength(e, 11);
        } else {
            enforceEnglishAndSymbols(e);
        }
    };

    const formatSocialValue = (network: string, value: string) => {
        let val = value.trim();
        if (!val) return val;

        if (network === 'telegram') {
            val = val.replace(/^@/, '');
            if (!val.startsWith('http')) return `https://t.me/${val}`;
            return val;
        }
        if (network === 'instagram') {
            val = val.replace(/^@/, '');
            if (!val.startsWith('http')) return `https://instagram.com/${val}`;
            return val;
        }
        if (network === 'whatsapp') {
            return val;
        }
        if (['bale', 'eitaa', 'rubika'].includes(network)) {
            if (val.startsWith('@')) return val;
            if (/^[0-9]+$/.test(val)) return val;
            if (!val.startsWith('http')) return `@${val}`;
            return val;
        }
        return val;
    };

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            const payload = {
                ...data,
                parentMobile: data.guardianMobile,
                landlinePhone: data.tel,
                homeAddress: data.address
            };
            await api.put('/users/contact-info', payload);
            clearDraft();
            await refreshUser();
            alert('اطلاعات تماس با موفقیت ذخیره شد!');
        } catch (error) {
            console.error('Error saving data:', error);
            alert('خطا در ذخیره اطلاعات');
        } finally {
            setLoading(false);
        }
    };

    const watchedValues: Record<string, string> = watch() as any;

    return (
        <div id="view-contact-info" className="view-section fade-in">
            <div className="sticky-top-bar">
                <button type="button" className="btn-top-action btn-back-top" onClick={() => navigate('/profile-hub')}>
                    <i className="fa fa-arrow-right"></i> بازگشت</button>
                <h3 className="sticky-title">اطلاعات تماس</h3>
            </div>

            <div className="card">
                <form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                        <label className={errors.mobile ? 'error-label' : ''}>موبایل(شماره پنل)</label>
                        <style>{`
                            .desktop-mobile-hint { display: block; color: var(--primary); font-size: 0.85rem; margin-top: 4px; font-weight: bold; }
                            .desktop-mobile-input { flex: 1; width: auto; }
                            .desktop-mobile-container { display: flex; flex-direction: column; gap: 4px; }
                            .desktop-mobile-inner { display: flex; gap: 8px; width: 100%; }
                            .desktop-mobile-edit-btn {
                                padding: 0 16px;
                                border-radius: 8px;
                                white-space: nowrap;
                                background-color: var(--primary-light);
                                color: var(--font-color);
                                border: none;
                                transition: background-color 0.2s, box-shadow 0.2s;
                                cursor: pointer;
                                display: flex;
                                align-items: center;
                                gap: 6px;
                                font-weight: bold;
                                box-shadow: none;
                            }
                            .desktop-mobile-edit-btn:hover {
                                background-color: color-mix(in srgb, var(--primary) 80%, black);
                            }
                            @media (min-width: 768px) {
                                .desktop-mobile-hint { font-size: 0.9rem; margin-top: 0; margin-right: 4px; }
                                .desktop-mobile-input { flex: none !important; width: 315px !important; }
                                .desktop-mobile-container { flex-direction: row; gap: 8px; align-items: center; flex-wrap: wrap; }
                                .desktop-mobile-inner { flex: none; width: auto; }
                            }
                        `}</style>
                        <div className="desktop-mobile-container">
                            <div className="desktop-mobile-inner">
                                <input type="text" inputMode="numeric" readOnly {...register('mobile')} className={`desktop-mobile-input ${errors.mobile ? 'error' : ''}`} style={{ background: '#f1f5f9', color: '#64748b', direction: 'ltr', textAlign: 'left' }} />
                                <button type="button" onClick={() => setIsMobileModalOpen(true)} className="desktop-mobile-edit-btn">
                                    <i className="fa fa-edit"></i> ویرایش
                                </button>
                            </div>
                            <span className="desktop-mobile-hint">
                                برای ویرایش تلفن همراه روی دکمه ویرایش کلیک کنید.
                            </span>
                        </div>
                        {errors.mobile && <span className="error-text"><i className="fa fa-exclamation-triangle"></i> {String(errors.mobile.message)}</span>}
                    </div>

                    <div className="input-group">
                        <label className={errors.tel ? 'error-label' : ''}>تلفن ثابت</label>
                        <input type="text" inputMode="numeric" placeholder="021..." {...register('tel')} onInput={(e) => enforceNumericLength(e, 11)} className={errors.tel ? 'error' : ''} />
                        {errors.tel && <span className="error-text"><i className="fa fa-exclamation-triangle"></i> {String(errors.tel.message)}</span>}
                    </div>

                    <div className="input-group">
                        <label className={errors.guardianMobile ? 'error-label' : ''}>شماره ولی (پدر یا مادر)</label>
                        <input type="text" inputMode="numeric" placeholder="09..." {...register('guardianMobile')} onInput={(e) => enforceNumericLength(e, 11)} className={errors.guardianMobile ? 'error' : ''} />
                        {errors.guardianMobile && <span className="error-text"><i className="fa fa-exclamation-triangle"></i> {String(errors.guardianMobile.message)}</span>}
                    </div>

                    <div className="input-group">
                        <label className={errors.emergencyPhone ? 'error-label' : ''}>تلفن ضروری</label>
                        <input type="text" inputMode="numeric" {...register('emergencyPhone')} onInput={(e) => enforceNumericLength(e, 11)} className={errors.emergencyPhone ? 'error' : ''} />
                        {errors.emergencyPhone && <span className="error-text"><i className="fa fa-exclamation-triangle"></i> {String(errors.emergencyPhone.message)}</span>}
                    </div>

                    <div className="input-group">
                        <label className={errors.email ? 'error-label' : ''}>ایمیل</label>
                        <input type="email" style={{ textAlign: 'left', direction: 'ltr' }} {...register('email')} onInput={enforceEnglishAndSymbols} className={errors.email ? 'error' : ''} />
                        {errors.email && <span className="error-text"><i className="fa fa-exclamation-triangle"></i> {String(errors.email.message)}</span>}
                    </div>

                    {/* وب سایت و کد پستی - منتقل شده بالاتر از شبکه‌های اجتماعی */}
                    <div className="input-group">
                        <label className={errors.website ? 'error-label' : ''}>وب سایت</label>
                        <input type="text" style={{ textAlign: 'left', direction: 'ltr' }} placeholder="https://..." {...register('website')} onInput={enforceEnglishAndSymbols} className={errors.website ? 'error' : ''} />
                        {errors.website && <span className="error-text"><i className="fa fa-exclamation-triangle"></i> {String(errors.website.message)}</span>}
                    </div>

                    <div className="input-group">
                        <label className={errors.postalCode ? 'error-label' : ''}>
                            کد پستی (۱۰ رقم) <span className="text-danger">*</span>
                            {user?.isPostalVerified && <i className="fa fa-check-circle text-success" style={{ marginRight: '4px' }}></i>}
                        </label>
                        <input type="text" inputMode="numeric" placeholder="مثال: ۱۲۳۴۵۶۷۸۹۰" {...register('postalCode')} onInput={(e) => enforceNumericLength(e, 10)} className={errors.postalCode ? 'error' : ''} />
                        {errors.postalCode && <span className="error-text"><i className="fa fa-exclamation-triangle"></i> {String(errors.postalCode.message)}</span>}
                    </div>

                    {/* شبکه‌های اجتماعی */}
                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                        <label>شبکه‌های اجتماعی</label>
                        <div style={{
                            padding: '3px',
                            border: '1.5px solid rgba(234, 179, 8, 0.5)',
                            borderRadius: '10px',
                            background: '#f8fafc',
                            overflow: 'visible',
                            position: 'relative',
                        }}>
                            {/* ردیف‌های موجود */}
                            {SOCIAL_NETWORKS.some(n => !!watchedValues[n.key]) && (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                                    gap: '8px',
                                    padding: '5px'
                                }}>
                                    {SOCIAL_NETWORKS.filter(n => !!watchedValues[n.key]).map((network, idx, arr) => {
                                        const isEditing = editingNetwork === network.key;
                                        return (
                                            <div key={network.key} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                padding: '10px 14px',
                                                border: '1px solid rgba(234,179,8,0.2)',
                                                borderRadius: '8px',
                                                background: '#fff',
                                                transition: 'background 0.2s',
                                                direction: 'rtl',
                                            }}>
                                                {/* آیکون شبکه */}
                                                <div style={{
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                                                    background: network.color + '18', color: network.color,
                                                    border: `1.5px solid ${network.color}40`, fontSize: '1rem',
                                                }}>
                                                    <SocialIcon icon={network.icon} size={16} />
                                                </div>

                                                {isEditing ? (
                                                    <>
                                                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: network.color, flexShrink: 0, whiteSpace: 'nowrap' }}>
                                                            {network.label}
                                                        </span>
                                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                            <input
                                                                type="text"
                                                                value={editValue}
                                                                onChange={e => { setEditValue(e.target.value); if (editError) setEditError(''); }}
                                                                onInput={e => enforceSocialInput(e, network.key)}
                                                                style={{
                                                                    width: '100%', direction: 'ltr', textAlign: 'left',
                                                                    fontSize: '0.85rem', padding: '6px 10px',
                                                                    border: `1.5px solid ${editError ? '#ef4444' : 'var(--primary)'}`, borderRadius: '8px',
                                                                    outline: 'none', background: '#fff', fontFamily: 'inherit',
                                                                }}
                                                                autoFocus
                                                                placeholder={network.placeholder}
                                                            />
                                                            {editError && (
                                                                <span style={{ color: '#ef4444', fontSize: '0.7rem', direction: 'rtl' }}>
                                                                    <i className="fa fa-exclamation-triangle" style={{ marginLeft: '4px' }} />{editError}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <button type="button"
                                                            onClick={() => {
                                                                if (editValue.trim()) {
                                                                    const formattedValue = formatSocialValue(network.key, editValue);
                                                                    const validate = SOCIAL_VALIDATIONS[network.key];
                                                                    const errorMsg = validate ? validate(formattedValue) : null;
                                                                    if (errorMsg) {
                                                                        setEditError(errorMsg);
                                                                        return;
                                                                    }
                                                                    setValue(network.key as any, formattedValue, { shouldValidate: true });
                                                                    setEditingNetwork(null);
                                                                    setEditError('');
                                                                }
                                                            }}
                                                            style={{ background: 'var(--primary)', border: 'none', borderRadius: '7px', width: '28px', height: '28px', cursor: 'pointer', color: '#78350f', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                                                            title="تأیید"
                                                        ><i className="fa fa-check" style={{ fontSize: '0.8rem' }} /></button>
                                                        <button type="button"
                                                            onClick={() => { setEditingNetwork(null); setEditError(''); }}
                                                            style={{ background: '#f1f5f9', border: 'none', borderRadius: '7px', width: '28px', height: '28px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                                                            title="انصراف"
                                                        ><i className="fa fa-times" style={{ fontSize: '0.8rem' }} /></button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span style={{
                                                            fontSize: '0.78rem', fontWeight: 700,
                                                            color: network.color, flexShrink: 0, whiteSpace: 'nowrap'
                                                        }}>
                                                            {network.label}
                                                        </span>
                                                        <span style={{
                                                            flex: 1, direction: 'ltr', textAlign: 'left',
                                                            fontSize: '0.82rem', color: '#0f172a', fontWeight: 600,
                                                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                        }}>
                                                            {displaySocialValue(network.key, watchedValues[network.key])}
                                                        </span>
                                                        <button type="button"
                                                            onClick={() => { setEditingNetwork(network.key); setEditValue(watchedValues[network.key]); setAddingNew(false); }}
                                                            style={{ background: '#f1f5f9', border: 'none', borderRadius: '7px', width: '28px', height: '28px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: '0.15s' }}
                                                            title="ویرایش"
                                                        ><i className="fa fa-pencil" style={{ fontSize: '0.78rem' }} /></button>
                                                        <button type="button"
                                                            onClick={() => setValue(network.key as any, '', { shouldValidate: true })}
                                                            style={{ background: '#fee2e2', border: 'none', borderRadius: '7px', width: '28px', height: '28px', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: '0.15s' }}
                                                            title="حذف"
                                                        ><i className="fa fa-times" style={{ fontSize: '0.78rem' }} /></button>
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {addingNew && (() => {
                                const available = SOCIAL_NETWORKS.filter(n => !watchedValues[n.key]);
                                const selNet = SOCIAL_NETWORKS.find(n => n.key === pendingNetwork);
                                return (
                                    <div style={{
                                        padding: '10px 14px',
                                        background: 'var(--primary-light)',
                                        borderTop: SOCIAL_NETWORKS.some(n => !!watchedValues[n.key]) ? '1px solid rgba(234,179,8,0.3)' : 'none',
                                        animation: 'fadeIn 0.2s ease-out',
                                    }}>
                                        <div className="social-add-controls">
                                            <div className="social-fields-row">
                                                {/* نوع شبکه */}
                                                <div className="social-network-field" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <div ref={dropdownContainerRef} style={{ position: 'relative' }}>
                                                        {isSelectOpen && (
                                                            <div onClick={() => setIsSelectOpen(false)}
                                                                style={{ position: 'fixed', inset: 0, zIndex: 1000 }} />
                                                        )}
                                                        <div
                                                            ref={dropdownTriggerRef}
                                                            onClick={() => setIsSelectOpen(!isSelectOpen)}
                                                            style={{
                                                                display: 'flex', alignItems: 'center', gap: '7px',
                                                                padding: '7px 9px', direction: 'rtl',
                                                                border: `1.5px solid ${isSelectOpen ? 'var(--primary)' : 'rgba(234,179,8,0.6)'}`,
                                                                borderRadius: isSelectOpen ? '8px 8px 0 0' : '8px',
                                                                background: '#fff', cursor: 'pointer',
                                                                boxShadow: isSelectOpen ? '0 0 0 3px var(--primary-light)' : 'none',
                                                                transition: 'all 0.15s', userSelect: 'none',
                                                            }}
                                                        >
                                                            <div style={{
                                                                width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                background: selNet ? selNet.color + '20' : 'rgba(234,179,8,0.15)',
                                                                color: selNet ? selNet.color : '#eab308', fontSize: '0.8rem',
                                                            }}>
                                                                <SocialIcon icon={selNet ? selNet.icon : 'fa fa-share-alt'} size={14} />
                                                            </div>
                                                            <span style={{ flex: 1, fontSize: '0.8rem', fontWeight: 700, color: selNet ? '#0f172a' : '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                {selNet ? selNet.label : 'انتخاب شبکه'}
                                                            </span>
                                                            <i className={`fa fa-chevron-${isSelectOpen ? 'up' : 'down'}`}
                                                                style={{ fontSize: '0.6rem', color: '#94a3b8', flexShrink: 0 }} />
                                                        </div>
                                                        {isSelectOpen && (
                                                            <div style={{
                                                                position: 'absolute',
                                                                top: '100%',
                                                                right: 0,
                                                                left: 0,
                                                                background: '#fff',
                                                                border: '1.5px solid rgba(234,179,8,0.5)',
                                                                borderTop: 'none',
                                                                borderRadius: '0 0 10px 10px',
                                                                boxShadow: '0 10px 28px rgba(0,0,0,0.15)',
                                                                overflow: 'hidden',
                                                                zIndex: 1001,
                                                            }}>
                                                                {available.map((n, idx) => (
                                                                    <div
                                                                        key={n.key}
                                                                        onClick={() => { setPendingNetwork(n.key); setIsSelectOpen(false); }}
                                                                        style={{
                                                                            display: 'flex', alignItems: 'center', gap: '9px',
                                                                            padding: '9px 11px', cursor: 'pointer',
                                                                            borderBottom: idx < available.length - 1 ? '1px solid rgba(234,179,8,0.12)' : 'none',
                                                                            background: pendingNetwork === n.key ? 'var(--primary-light)' : '#fff',
                                                                            transition: 'background 0.12s', direction: 'rtl',
                                                                        }}
                                                                        onMouseEnter={e => { if (pendingNetwork !== n.key) e.currentTarget.style.background = 'rgba(234,179,8,0.07)'; }}
                                                                        onMouseLeave={e => { e.currentTarget.style.background = pendingNetwork === n.key ? 'var(--primary-light)' : '#fff'; }}
                                                                    >
                                                                        <div style={{
                                                                            width: '26px', height: '26px', borderRadius: '7px', flexShrink: 0,
                                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                            background: n.color + '18', color: n.color,
                                                                            border: `1.5px solid ${n.color}40`, fontSize: '0.85rem',
                                                                        }}>
                                                                            <SocialIcon icon={n.icon} size={16} />
                                                                        </div>
                                                                        <span style={{ fontSize: '0.83rem', fontWeight: 700, color: '#0f172a', flex: 1 }}>
                                                                            {n.label}
                                                                        </span>
                                                                        {pendingNetwork === n.key && (
                                                                            <i className="fa fa-check"
                                                                                style={{ color: 'var(--primary)', fontSize: '0.75rem' }} />
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                {/* آدرس اینترنتی */}
                                                <div className="social-url-field" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <input
                                                        type="text"
                                                        placeholder={selNet ? selNet.placeholder : 'https://...'}
                                                        value={pendingValue}
                                                        onChange={e => { setPendingValue(e.target.value); if (pendingError) setPendingError(''); }}
                                                        onInput={e => selNet && enforceSocialInput(e, selNet.key)}
                                                        style={{
                                                            width: '100%', direction: 'ltr', textAlign: 'left',
                                                            fontSize: '0.85rem', padding: '7px 10px',
                                                            border: `1.5px solid ${pendingError ? '#ef4444' : 'rgba(234,179,8,0.6)'}`, borderRadius: '8px',
                                                            outline: 'none', background: '#fff', fontFamily: 'inherit',
                                                        }}
                                                        autoFocus={!!pendingNetwork}
                                                    />
                                                    {pendingError && (
                                                        <span style={{ color: '#ef4444', fontSize: '0.7rem', direction: 'rtl' }}>
                                                            <i className="fa fa-exclamation-triangle" style={{ marginLeft: '4px' }} />{pendingError}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {/* دکمه‌ها */}
                                            <div className="social-buttons-row">
                                                <button type="button"
                                                    onClick={() => {
                                                        if (!pendingNetwork) { setPendingError('ابتدا نوع شبکه را انتخاب کنید'); return; }
                                                        if (!pendingValue.trim()) { setPendingError('آدرس یا شناسه را وارد کنید'); return; }
                                                        const formattedValue = formatSocialValue(pendingNetwork, pendingValue);
                                                        const validate = SOCIAL_VALIDATIONS[pendingNetwork];
                                                        const errorMsg = validate ? validate(formattedValue) : null;
                                                        if (errorMsg) {
                                                            setPendingError(errorMsg);
                                                            return;
                                                        }
                                                        setValue(pendingNetwork as any, formattedValue, { shouldValidate: true });
                                                        setAddingNew(false); setPendingNetwork(''); setPendingValue(''); setPendingError('');
                                                    }}
                                                    style={{
                                                        flexShrink: 0, display: 'flex', alignItems: 'center', gap: '5px',
                                                        padding: '7px 14px', background: 'var(--primary)', border: 'none',
                                                        borderRadius: '8px', cursor: 'pointer', color: '#fff',
                                                        fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 700,
                                                        boxShadow: '0 2px 6px var(--primary)',
                                                    }}
                                                ><i className="fa fa-plus" style={{ fontSize: '0.75rem' }} /> افزودن</button>
                                                <button type="button"
                                                    onClick={() => { setAddingNew(false); setPendingNetwork(''); setPendingValue(''); setIsSelectOpen(false); setPendingError(''); }}
                                                    style={{
                                                        flexShrink: 0, display: 'flex', alignItems: 'center', gap: '5px',
                                                        padding: '7px 12px', background: '#ef4444', border: 'none',
                                                        borderRadius: '8px', cursor: 'pointer', color: '#fff',
                                                        fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 700,
                                                    }}
                                                ><i className="fa fa-times" style={{ fontSize: '0.75rem' }} /> انصراف</button>
                                            </div>
                                        </div>

                                    </div>
                                );
                            })()}

                            {/* دکمه افزودن */}
                            {!addingNew && SOCIAL_NETWORKS.some(n => !watchedValues[n.key]) && (
                                <button
                                    type="button"
                                    onClick={() => { setAddingNew(true); setPendingNetwork(''); setPendingValue(''); setEditingNetwork(null); }}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        gap: '6px', width: '100%', padding: '11px 14px',
                                        background: 'transparent', border: 'none', cursor: 'pointer',
                                        fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)',
                                        borderTop: SOCIAL_NETWORKS.some(n => !!watchedValues[n.key]) ? '1px solid rgba(234,179,8,0.25)' : 'none',
                                        fontFamily: 'inherit', transition: '0.2s',
                                    }}
                                >
                                    <i className="fa fa-plus" style={{ fontSize: '0.78rem' }} />
                                    افزودن شبکه اجتماعی
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                        <label className={errors.address ? 'error-label' : ''} style={{ marginBottom: 0, right: '3px' }}>
                            آدرس دقیق منزل <span className="text-danger">*</span>
                            {user?.isPostalVerified && <i className="fa fa-check-circle text-success" style={{ marginRight: '4px' }}></i>}
                        </label>
                        <button type="button" onClick={() => !user?.isPostalVerified && setActiveMapField('address')} style={{ alignSelf: 'flex-start', marginTop: '16px', marginRight: '12px', marginBottom: '8px', background: 'var(--primary-light)', color: 'var(--font-color)', border: 'none', padding: '6px 12px', fontSize: '0.8rem', fontWeight: 'bold', borderRadius: '8px', opacity: user?.isPostalVerified ? 0.5 : 1, cursor: user?.isPostalVerified ? 'not-allowed' : 'pointer', boxShadow: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <i className="fa fa-map-marker"></i> انتخاب از نقشه
                        </button>
                        <textarea rows={2} {...register('address')} placeholder="استان، شهر، خیابان..." className={errors.address ? 'error' : ''} readOnly={user?.isPostalVerified} style={user?.isPostalVerified ? { background: '#f1f5f9', color: '#64748b' } : {}}></textarea>
                        {errors.address && <span className="error-text"><i className="fa fa-exclamation-triangle"></i> {String(errors.address.message)}</span>}
                    </div>

                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                        <label style={{ marginBottom: 0, right: '3px' }}>آدرس محل کار والدین</label>
                        <button type="button" onClick={() => setActiveMapField('parentsWorkAddress')} style={{ alignSelf: 'flex-start', marginTop: '16px', marginRight: '12px', marginBottom: '8px', background: 'var(--primary-light)', color: 'var(--font-color)', border: 'none', padding: '6px 12px', fontSize: '0.8rem', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer', boxShadow: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <i className="fa fa-map-marker"></i> انتخاب از نقشه
                        </button>
                        <textarea rows={2} {...register('parentsWorkAddress')} placeholder="آدرس دقیق"></textarea>
                    </div>
                    {!activeMapField && (
                        <StickySubmitButton loading={loading} text="ثبت اطلاعات" loadingText="در حال ثبت..." />
                    )}

                </form>
            </div>
            <ChangeMobileModal
                isOpen={isMobileModalOpen}
                currentMobile={user?.contact?.mobile || ''}
                onClose={() => setIsMobileModalOpen(false)}
                onSuccess={(newMobile) => {
                    setValue('mobile', newMobile, { shouldValidate: true });
                    setIsMobileModalOpen(false);
                    if (user && user.contact) {
                        user.contact.mobile = newMobile;
                    }
                }}
            />
            <MapModal
                isOpen={activeMapField !== null}
                onClose={() => setActiveMapField(null)}
                onConfirm={(addressStr) => {
                    if (activeMapField) {
                        setValue(activeMapField, addressStr, { shouldValidate: true });
                    }
                }}
            />
        </div>
    );
}
