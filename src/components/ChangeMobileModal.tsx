import React, { useState } from 'react';

interface ChangeMobileModalProps {
    isOpen: boolean;
    currentMobile: string;
    onClose: () => void;
    onSuccess: (newMobile: string) => void;
}

export default function ChangeMobileModal({ isOpen, currentMobile, onClose, onSuccess }: ChangeMobileModalProps) {
    const [step, setStep] = useState<'otp' | 'new_number'>('otp');
    const [otpCode, setOtpCode] = useState('');
    const [newMobile, setNewMobile] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleVerifyOtp = () => {
        setError('');
        if (otpCode !== '1234') {
            setError('کد وارد شده اشتباه است. (راهنما: ۱۲۳۴)');
            return;
        }
        setStep('new_number');
    };

    const handleChangeMobile = () => {
        setError('');
        if (!/^09[0-9]{9}$/.test(newMobile)) {
            setError('شماره موبایل جدید نامعتبر است');
            return;
        }
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            onSuccess(newMobile);
        }, 1500);
    };

    const convertPersianToEnglishDigits = (str: string) => {
        const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return str.replace(/[۰-۹]/g, w => persianDigits.indexOf(w).toString());
    };

    const handleOtpInput = (e: React.FormEvent<HTMLInputElement>) => {
        const val = convertPersianToEnglishDigits(e.currentTarget.value).replace(/[^0-9]/g, '');
        setOtpCode(val.slice(0, 4));
    };

    const handleMobileInput = (e: React.FormEvent<HTMLInputElement>) => {
        const val = convertPersianToEnglishDigits(e.currentTarget.value).replace(/[^0-9]/g, '');
        setNewMobile(val.slice(0, 11));
    };

    return (
        <div className="modal-overlay" onClick={onClose} style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex',
            justifyContent: 'center', alignItems: 'center'
        }}>
            <div className="modal-content fade-in" onClick={e => e.stopPropagation()} style={{
                background: 'var(--surface)', padding: '24px', borderRadius: '12px',
                width: '90%', maxWidth: '400px', boxShadow: 'var(--shadow-md)', textAlign: 'center'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>تغییر شماره موبایل</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--text-dark)' }}>&times;</button>
                </div>

                {step === 'otp' && (
                    <>
                        <div style={{ marginBottom: '16px', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                            کد تایید ۴ رقمی به شماره فعلی شما ({currentMobile}) ارسال شد.
                        </div>
                        <div className="input-group" style={{ textAlign: 'right' }}>
                            <input 
                                type="text" 
                                inputMode="numeric" 
                                style={{ direction: 'ltr', textAlign: 'center', fontSize: '1.2rem', letterSpacing: '8px', fontWeight: 'bold' }} 
                                placeholder="- - - -" 
                                value={otpCode}
                                onInput={handleOtpInput}
                            />
                            {error && <span className="error-text" style={{ marginTop: '8px', display: 'block' }}><i className="fa fa-exclamation-triangle"></i> {error}</span>}
                        </div>
                        <button type="button" onClick={handleVerifyOtp} className="btn-app-primary" style={{ width: '100%', padding: '12px', borderRadius: '8px', marginTop: '16px', fontWeight: 'bold' }}>
                            تایید کد
                        </button>
                    </>
                )}

                {step === 'new_number' && (
                    <>
                        <div style={{ marginBottom: '16px', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                            لطفاً شماره موبایل جدید خود را وارد کنید.
                        </div>
                        <div className="input-group" style={{ textAlign: 'right' }}>
                            <input 
                                type="text" 
                                inputMode="numeric" 
                                style={{ direction: 'ltr', textAlign: 'left', fontSize: '1.1rem' }} 
                                placeholder="09..." 
                                value={newMobile}
                                onInput={handleMobileInput}
                            />
                            {error && <span className="error-text" style={{ marginTop: '8px', display: 'block' }}><i className="fa fa-exclamation-triangle"></i> {error}</span>}
                        </div>
                        <button type="button" disabled={loading} onClick={handleChangeMobile} className="btn-app-primary" style={{ width: '100%', padding: '12px', borderRadius: '8px', marginTop: '16px', fontWeight: 'bold' }}>
                            {loading ? 'در حال ثبت...' : 'ثبت شماره جدید'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
