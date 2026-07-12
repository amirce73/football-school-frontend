import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomSelect from '../../components/CustomSelect';

interface InsuranceRecord {
    id: number;
    course: string;
    insurer: string;
    expiryDate: string;
    remainingValidity: string;
    isValid: boolean;
}

export default function InsuranceStatus() {
    const navigate = useNavigate();
    const [selectedCourse, setSelectedCourse] = useState('course1');

    const [records] = useState<InsuranceRecord[]>([
        {
            id: 1,
            course: 'course1',
            insurer: 'فدراسیون پزشکی ورزشی',
            expiryDate: '1403/12/29',
            remainingValidity: '245 روز',
            isValid: true
        },
        {
            id: 2,
            course: 'course2',
            insurer: 'بیمه سامان (حوادث ورزشی)',
            expiryDate: '1402/11/15',
            remainingValidity: 'منقضی شده',
            isValid: false
        }
    ]);

    const filteredRecords = records.filter(r => r.course === selectedCourse || selectedCourse === 'all');

    return (
        <div id="view-insurance-status" className="view-section fade-in">
            <div className="sticky-top-bar">
                <button className="btn-top-action btn-back-top" onClick={() => navigate('/specialized-hub')}>
                    <i className="fa fa-arrow-right"></i> بازگشت</button>
                <h3 className="sticky-title">وضعیت بیمه ورزشی</h3>
                <div style={{ width: '80px' }}></div>
            </div>

            <div className="card" style={{ padding: '15px' }}>
                <div className="input-group" style={{ marginBottom: '15px' }}>
                    <label>انتخاب دوره</label>
                    <CustomSelect
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse((e.target as HTMLSelectElement).value)}
                        options={[
                            { value: 'all', label: 'همه دوره‌ها' },
                            { value: 'course1', label: 'ترم پاییز - کلاس پیشرفته الف' },
                            { value: 'course2', label: 'ترم تابستان - کلاس مبتدی' }
                        ]}
                    />
                </div>

                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>صادرکننده بیمه</th>
                                <th>تصویر بیمه</th>
                                <th>تاریخ انقضا</th>
                                <th>اعتبار باقی مانده</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRecords.length === 0 ? (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>سابقه‌ای یافت نشد.</td>
                                </tr>
                            ) : (
                                filteredRecords.map((record) => (
                                    <tr key={record.id}>
                                        <td data-label="صادرکننده بیمه">{record.insurer}</td>
                                        <td data-label="تصویر بیمه">
                                            <div style={{ width: '40px', height: '40px', background: '#eee', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <i className="fa fa-file-image-o" style={{ color: '#ccc' }}></i>
                                            </div>
                                        </td>
                                        <td data-label="تاریخ انقضا" style={{ direction: 'ltr', textAlign: 'right' }}>{record.expiryDate}</td>
                                        <td data-label="اعتبار باقی مانده">
                                            <span style={{
                                                padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold',
                                                backgroundColor: record.isValid ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                                                color: record.isValid ? 'var(--success-color)' : 'var(--danger-color)'
                                            }}>
                                                {record.remainingValidity}
                                            </span>
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
