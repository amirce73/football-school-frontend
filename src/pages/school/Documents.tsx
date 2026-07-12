import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { useAuth } from '../../contexts/AuthContext';

interface DocumentFile {
    type: string;
    file: File | null;
    status: 'none' | 'uploading' | 'success' | 'error';
}

export default function Documents() {
    const navigate = useNavigate();
    const { refreshUser } = useAuth();
    
    const [docs, setDocs] = useState<{ [key: string]: DocumentFile }>({
        identityCard: { type: 'شناسنامه', file: null, status: 'none' },
        nationalCard: { type: 'کارت ملی', file: null, status: 'none' },
        passport: { type: 'پاسپورت', file: null, status: 'none' },
        militaryService: { type: 'کارت پایان خدمت', file: null, status: 'none' },
        personalPhoto: { type: 'عکس پرسنلی', file: null, status: 'none' }
    });

    const handleFileSelect = (key: string, file: File | null) => {
        if (!file) return;
        setDocs(prev => ({
            ...prev,
            [key]: { ...prev[key], file, status: 'none' }
        }));
    };

    const handleUpload = async (key: string) => {
        const doc = docs[key];
        if (!doc.file) return;

        setDocs(prev => ({ ...prev, [key]: { ...prev[key], status: 'uploading' } }));
        
        const formData = new FormData();
        formData.append('file', doc.file);
        formData.append('documentType', doc.type);

        try {
            await api.post('/Profile/documents', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setDocs(prev => ({ ...prev, [key]: { ...prev[key], status: 'success' } }));
        } catch (error) {
            console.error(`Error uploading ${doc.type}:`, error);
            setDocs(prev => ({ ...prev, [key]: { ...prev[key], status: 'error' } }));
        }
    };

    const renderDocumentRow = (key: string, title: string, requiredFormats: string) => {
        const doc = docs[key];
        return (
            <div key={key} className="document-row">
                <div className="doc-info-col">
                    <div className="doc-title">{title}</div>
                    <div className="doc-format">فرمت های مجاز: <span dir="ltr">{requiredFormats}</span></div>
                </div>
                
                <div className="doc-status-col">
                    {doc.status === 'success' ? (
                        <span style={{ color: 'var(--success-color)' }}><i className="fa fa-check-circle fa-2x"></i></span>
                    ) : doc.status === 'uploading' ? (
                        <span style={{ color: 'var(--primary-color)' }}><i className="fa fa-spinner fa-spin fa-2x"></i></span>
                    ) : doc.status === 'error' ? (
                        <span style={{ color: 'var(--danger-color)' }}><i className="fa fa-times-circle fa-2x"></i></span>
                    ) : doc.file ? (
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-color)' }}>{doc.file.name}</span>
                    ) : (
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>فایلی انتخاب نشده</span>
                    )}
                </div>

                <div className="doc-action-col">
                    <input 
                        type="file" 
                        id={`file-${key}`} 
                        style={{ display: 'none' }} 
                        accept=".png,.jpeg,.jpg,.pdf"
                        onChange={(e) => handleFileSelect(key, e.target.files?.[0] || null)}
                    />
                    <input 
                        type="file" 
                        id={`camera-${key}`} 
                        style={{ display: 'none' }} 
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => handleFileSelect(key, e.target.files?.[0] || null)}
                    />
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <label htmlFor={`camera-${key}`} className="btn-secondary" style={{ cursor: 'pointer', padding: '8px 12px', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="عکس گرفتن">
                            <i className="fa fa-camera"></i>
                        </label>
                        <label htmlFor={`file-${key}`} className="btn-secondary" style={{ cursor: 'pointer', padding: '8px 15px', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="fa fa-folder-open"></i> انتخاب فایل
                        </label>
                    </div>
                    <button 
                        className="btn-primary" 
                        onClick={() => handleUpload(key)} 
                        disabled={!doc.file || doc.status === 'uploading'}
                        style={{ padding: '8px 15px' }}
                    >
                        <i className="fa fa-upload"></i> آپلود
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div id="view-documents" className="view-section fade-in">
            <div className="sticky-top-bar">
                <button className="btn-top-action btn-back-top" onClick={() => navigate('/profile-hub')}>
                    <i className="fa fa-arrow-right"></i> بازگشت</button>
                <h3 className="sticky-title">ثبت مدارک اصلی</h3>
                <button className="btn-top-action" style={{ background: 'transparent', color: 'var(--primary-color)', border: '1px solid var(--primary-color)' }} onClick={() => navigate('/certificates')}>
                    <i className="fa fa-file-text"></i> ثبت سایر مدارک
                </button>
            </div>
            
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {renderDocumentRow('identityCard', 'شناسنامه', 'png, jpeg, jpg, pdf')}
                    {renderDocumentRow('nationalCard', 'کارت ملی', 'png, jpeg, jpg, pdf')}
                    {renderDocumentRow('passport', 'پاسپورت', 'png, jpeg, jpg, pdf')}
                    {renderDocumentRow('militaryService', 'کارت پایان خدمت', 'png, jpeg, jpg, pdf')}
                    {renderDocumentRow('personalPhoto', 'عکس پرسنلی', 'png, jpeg, jpg, pdf')}
                </div>
            </div>
        </div>
    );
}
