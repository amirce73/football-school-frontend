import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomSelect from '../../components/CustomSelect';

interface OtherDocument {
    id: number;
    title: string;
    image?: string;
    issueDate: string;
    expiryDate: string;
    issuer: string;
    description: string;
    status: 'تایید شده' | 'در حال بررسی' | 'رد شده';
}

export default function Certificate() {
    const navigate = useNavigate();
    const [docs] = useState<OtherDocument[]>([
        // Mock data, in a real app this would come from the API
        {
            id: 1,
            title: 'گواهی سلامت پزشکی',
            issueDate: '1402/05/10',
            expiryDate: '1403/05/10',
            issuer: 'مرکز پزشکی ورزشی',
            description: 'سلامت کامل برای حضور در مسابقات',
            status: 'تایید شده'
        }
    ]);

    const [seasonFilter, setSeasonFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');

    return (
        <div id="view-certificate" className="view-section fade-in">
            <div className="sticky-top-bar">
                <button className="btn-top-action btn-back-top" onClick={() => navigate('/documents')}>
                    <i className="fa fa-arrow-right"></i> بازگشت</button>
                <h3 className="sticky-title">سایر مدارک</h3>
                <button className="btn-top-action btn-submit-top" onClick={() => alert('فرم افزودن مدرک باز می‌شود')}>
                    <i className="fa fa-plus"></i> مدرک جدید
                </button>
            </div>

            <div className="card" style={{ padding: '15px' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
                    <div className="input-group" style={{ flex: '1', minWidth: '150px' }}>
                        <CustomSelect value={seasonFilter} onChange={(e) => setSeasonFilter(e.target.value)}>
                            <option value="">همه فصل‌ها</option>
                            <option value="1402-1403">1402-1403</option>
                            <option value="1403-1404">1403-1404</option>
                        </CustomSelect>
                    </div>
                    <div className="input-group" style={{ flex: '1', minWidth: '150px' }}>
                        <CustomSelect value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                            <option value="">همه مدارک</option>
                            <option value="medical">پزشکی</option>
                            <option value="educational">تحصیلی</option>
                            <option value="other">متفرقه</option>
                        </CustomSelect>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>عنوان</th>
                                <th>تصویر</th>
                                <th>تاریخ صدور</th>
                                <th>تاریخ انقضا</th>
                                <th>صادرکننده</th>
                                <th>توضیحات</th>
                                <th>وضعیت</th>
                                <th>عملیات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {docs.length === 0 ? (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: 'center', padding: '20px' }}>مدرکی یافت نشد.</td>
                                </tr>
                            ) : (
                                docs.map((doc) => (
                                    <tr key={doc.id}>
                                        <td data-label="عنوان">{doc.title}</td>
                                        <td data-label="تصویر">
                                            <div style={{ width: '40px', height: '40px', background: '#eee', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <i className="fa fa-image" style={{ color: '#ccc' }}></i>
                                            </div>
                                        </td>
                                        <td data-label="تاریخ صدور" style={{ direction: 'ltr', textAlign: 'right' }}>{doc.issueDate}</td>
                                        <td data-label="تاریخ انقضا" style={{ direction: 'ltr', textAlign: 'right' }}>{doc.expiryDate}</td>
                                        <td data-label="صادرکننده">{doc.issuer}</td>
                                        <td data-label="توضیحات"><span title={doc.description}>{doc.description.substring(0, 15)}...</span></td>
                                        <td data-label="وضعیت">
                                            <span style={{
                                                padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem',
                                                backgroundColor: doc.status === 'تایید شده' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)',
                                                color: doc.status === 'تایید شده' ? 'var(--success-color)' : 'var(--warning-color)'
                                            }}>{doc.status}</span>
                                        </td>
                                        <td data-label="عملیات">
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px' }}>
                                                <button className="btn-icon" title="دانلود"><i className="fa fa-download" style={{ color: 'var(--primary-color)' }}></i></button>
                                                <button className="btn-icon" title="حذف"><i className="fa fa-trash" style={{ color: 'var(--danger-color)' }}></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
