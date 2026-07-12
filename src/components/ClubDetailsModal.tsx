import React from 'react';
import sepahanLogo from '../images/logo/Sepahan_New_Logo.svg';

interface ClubDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ClubDetailsModal({ isOpen, onClose }: ClubDetailsModalProps) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
                <div className="modal-header-gradient">
                    <button onClick={onClose} className="modal-close-btn">
                        <i className="fa fa-times"></i>
                    </button>
                    <div className="modal-logo-wrap">
                        <img src={sepahanLogo} alt="لوگو باشگاه" onError={(e) => { e.currentTarget.src = ''; }} />
                    </div>
                    <h2>باشگاه فولاد مبارکه سپاهان</h2>
                    <span className="modal-badge">کد ثبت: 10452</span>
                </div>
                
                <div className="modal-body-content">
                    <h3>
                        <i className="fa fa-info-circle" style={{ color: '#eab308' }}></i>
                        اطلاعات کامل مدرسه فوتبال
                    </h3>
                    
                    <div className="modal-info-list">
                        <div className="modal-info-item">
                            <div className="info-icon" style={{ background: '#dbeafe', color: '#3b82f6' }}>
                                <i className="fa fa-map-marker"></i>
                            </div>
                            <div>
                                <h4>آدرس دفتر مرکزی</h4>
                                <p>سمنان، دامغان، خیابان شهید بهشتی، ورزشگاه انقلاب، دفتر هیئت فوتبال</p>
                            </div>
                        </div>
                        
                        <div className="modal-info-item">
                            <div className="info-icon" style={{ background: '#dcfce7', color: '#22c55e' }}>
                                <i className="fa fa-phone"></i>
                            </div>
                            <div>
                                <h4>شماره‌های تماس</h4>
                                <p className="phone-numbers">
                                    <span className="dir-ltr">023-35221234</span>
                                    <span className="dir-ltr">09123456789</span>
                                </p>
                            </div>
                        </div>

                        <div className="modal-info-item">
                            <div className="info-icon" style={{ background: '#f3e8ff', color: '#a855f7' }}>
                                <i className="fa fa-user-tie"></i>
                            </div>
                            <div>
                                <h4>مدیرعامل / موسس</h4>
                                <p>مهندس علی احمدی</p>
                            </div>
                        </div>
                    </div>
                    
                    <button onClick={onClose} className="btn-modal-close-large">
                        بستن
                    </button>
                </div>
            </div>
        </div>
    );
}
