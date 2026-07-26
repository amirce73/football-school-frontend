import React, { useState, useRef, useEffect } from 'react';
import api from '../api';

interface ChangeMobileModalProps {
    isOpen: boolean;
    currentMobile: string;
    onClose: () => void;
    onSuccess: (newMobile: string) => void;
}

export default function ChangeMobileModal({ isOpen, currentMobile, onClose, onSuccess }: ChangeMobileModalProps) {
    const [step, setStep] = useState<'otp' | 'new_number'>('otp');
    const [otpValues, setOtpValues] = useState(['', '', '', '']);
    const [otpStatus, setOtpStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [newMobile, setNewMobile] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep('otp');
            setOtpValues(['', '', '', '']);
            setOtpStatus('idle');
            setNewMobile('');
            setError('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleVerifyOtp = () => {
        setError('');
        const code = otpValues.join('');
        if (code !== '1234') {
            setOtpStatus('error');
            setError('کد وارد شده اشتباه است. (راهنما: ۱۲۳۴)');
            return;
        }
        
        setOtpStatus('success');
        setOtpValues(['✓', '', '', '']); // First input gets a checkmark
        setTimeout(() => {
            setStep('new_number');
        }, 1200);
    };

    const handleChangeMobile = async () => {
        setError('');
        if (!/^09[0-9]{9}$/.test(newMobile)) {
            setError('شماره موبایل جدید باید ۱۱ رقم باشد و با ۰۹ شروع شود.');
            return;
        }
        if (newMobile === currentMobile) {
            setError('شماره موبایل جدید نمی‌تواند با شماره فعلی یکسان باشد.');
            return;
        }

        setLoading(true);
        try {
            await api.put('/users/mobile', { newMobile });
            onSuccess(newMobile);
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.');
            }
        } finally {
            setLoading(false);
        }
    };

    const convertPersianToEnglishDigits = (str: string) => {
        const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return str.replace(/[۰-۹]/g, w => persianDigits.indexOf(w).toString());
    };

    const handleOtpChange = (index: number, val: string) => {
        if (otpStatus === 'success') return;
        const v = convertPersianToEnglishDigits(val).replace(/[^0-9]/g, '').slice(-1);
        const newOtp = [...otpValues];
        newOtp[index] = v;
        setOtpValues(newOtp);
        setOtpStatus('idle');
        setError('');
        
        if (v && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };
    
    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'Enter') {
            handleVerifyOtp();
        }
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
            <style>{`
                .fi-otp-container {
                    display: flex;
                    justify-content: center;
                    direction: ltr;
                    margin: 24px 0;
                    position: relative;
                    height: 56px;
                    width: 100%;
                }

                .fi-otp-input {
                    width: 48px;
                    height: 56px;
                    font-size: 1.5rem;
                    text-align: center;
                    border: 2px solid var(--border-color, #e2e8f0);
                    border-radius: 12px;
                    background: #f8fafc;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    outline: none;
                    position: absolute;
                    color: #1e293b;
                    font-weight: bold;
                }

                .fi-otp-input:focus {
                    border-color: var(--primary, #3b82f6);
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
                    background: #fff;
                }

                .fi-otp-container.error .fi-otp-input {
                    border-color: #ef4444;
                    color: #ef4444;
                    background: #fef2f2;
                    animation: shake 0.5s;
                }

                .fi-otp-input:nth-child(1) { left: calc(50% - 114px); }
                .fi-otp-input:nth-child(2) { left: calc(50% - 54px); }
                .fi-otp-input:nth-child(3) { left: calc(50% + 6px); }
                .fi-otp-input:nth-child(4) { left: calc(50% + 66px); }

                .fi-otp-container.success .fi-otp-input {
                    left: calc(50% - 28px);
                    opacity: 0;
                    transform: scale(0.5);
                    pointer-events: none;
                }
                .fi-otp-container.success .fi-otp-input:first-child {
                    opacity: 1;
                    transform: scale(1);
                    border-color: #22c55e;
                    background: #22c55e;
                    color: #fff;
                    width: 56px;
                    border-radius: 50%;
                }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20%, 60% { transform: translateX(-6px); }
                    40%, 80% { transform: translateX(6px); }
                }
            `}</style>
            <div className="modal-content fade-in" onClick={e => e.stopPropagation()} style={{
                background: 'var(--surface)', padding: '24px', borderRadius: '16px',
                width: '90%', maxWidth: '400px', boxShadow: 'var(--shadow-md)', textAlign: 'center'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>تغییر شماره موبایل</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--text-dark)' }}>&times;</button>
                </div>

                {step === 'otp' && (
                    <>
                        <div style={{ marginBottom: '16px', color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                            کد تایید ۴ رقمی به شماره فعلی شما ({currentMobile}) ارسال شد.
                        </div>
                        <div className={`fi-otp-container ${otpStatus}`}>
                            {[0, 1, 2, 3].map(index => (
                                <input 
                                    key={index}
                                    ref={el => inputRefs.current[index] = el}
                                    type="text" 
                                    inputMode="numeric" 
                                    className="fi-otp-input"
                                    value={otpValues[index]}
                                    onChange={e => handleOtpChange(index, e.target.value)}
                                    onKeyDown={e => handleOtpKeyDown(index, e)}
                                    disabled={otpStatus === 'success'}
                                />
                            ))}
                        </div>
                        {error && <span className="error-text" style={{ marginTop: '8px', display: 'block' }}><i className="fa fa-exclamation-triangle"></i> {error}</span>}
                        <button type="button" onClick={handleVerifyOtp} disabled={otpStatus === 'success'} className="btn-app-primary" style={{ width: '100%', padding: '12px', borderRadius: '8px', marginTop: '16px', fontWeight: 'bold', transition: 'all 0.2s' }}>
                            تایید کد
                        </button>
                    </>
                )}

                {step === 'new_number' && (
                    <div className="fade-in">
                        <div style={{ marginBottom: '16px', color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                            لطفاً شماره موبایل جدید خود را وارد کنید.
                        </div>
                        <div className="input-group" style={{ textAlign: 'right' }}>
                            <input 
                                type="text" 
                                inputMode="numeric" 
                                style={{ direction: 'ltr', textAlign: 'left', fontSize: '1.1rem', letterSpacing: '2px', padding: '12px' }} 
                                placeholder="09..." 
                                value={newMobile}
                                onInput={handleMobileInput}
                                autoFocus
                            />
                            {error && <span className="error-text" style={{ marginTop: '8px', display: 'block' }}><i className="fa fa-exclamation-triangle"></i> {error}</span>}
                        </div>
                        <button type="button" disabled={loading} onClick={handleChangeMobile} className="btn-app-primary" style={{ width: '100%', padding: '12px', borderRadius: '8px', marginTop: '20px', fontWeight: 'bold' }}>
                            {loading ? 'در حال ثبت...' : 'ثبت شماره جدید'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
