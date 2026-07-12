import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { login, setPanelType } = useAuth();
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!mobileNumber) {
        setError('لطفا شماره موبایل خود را وارد کنید');
        return;
    }

    if (mobileNumber.length < 10) {
        setError('شماره موبایل نامعتبر است');
        return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/login', { mobileNumber });
      
      // Save token and update context
      if (response.data && response.data.token) {
          await login(response.data.token);
          setPanelType('school');
          navigate('/dashboard');
      } else {
          setError('خطا در دریافت توکن');
      }
    } catch (err) {
      console.error(err);
      setError('خطا در برقراری ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Decorative background elements */}
      <div className="login-bg-shape shape-1"></div>
      <div className="login-bg-shape shape-2"></div>
      
      <div className="login-card fade-in-up">
        <div className="login-header">
            <div className="login-logo-placeholder">
                <i className="fa-solid fa-futbol"></i>
            </div>
            <h2>خوش آمدید</h2>
            <p>برای ورود یا ثبت‌نام، شماره موبایل خود را وارد کنید</p>
        </div>
        
        {error && (
            <div className="login-error-alert fade-in">
                <i className="fa-solid fa-circle-exclamation"></i>
                <span>{error}</span>
            </div>
        )}
        
        <form onSubmit={handleLogin} className="login-form">
            <div className={`login-input-group ${isFocused ? 'focused' : ''} ${mobileNumber ? 'has-value' : ''}`}>
                <div className="input-icon">
                    <i className="fa-solid fa-mobile-screen"></i>
                </div>
                <input 
                    type="tel" 
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    dir="ltr"
                    maxLength={11}
                    placeholder=" "
                />
                <label>شماره موبایل</label>
            </div>
            
            <button 
                type="submit" 
                className={`login-submit-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
            >
                {loading ? (
                    <span className="spinner"><i className="fa-solid fa-circle-notch fa-spin"></i> در حال بررسی...</span>
                ) : (
                    <span>ورود <i className="fa-solid fa-arrow-left"></i></span>
                )}
            </button>
        </form>
      </div>
    </div>
  );
}
