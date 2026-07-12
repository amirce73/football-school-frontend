import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import CustomSelect from '../../components/CustomSelect';

interface ScoutingRecord {
    id: number;
    course: string;
    evaluationDate: string;
    location: string;
    evaluator: string;
    playerCategory: string;
    totalScore: number;
}

export default function Talent() {
    const navigate = useNavigate();
    const [selectedCourse, setSelectedCourse] = useState('course1');

    const [records, setRecords] = useState<ScoutingRecord[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTalentRecords = async () => {
            setLoading(true);
            try {
                const response = await api.get('/specialized/talent');
                const mockData = [
                    { id: 1, course: 'دوره تابستانه پیشرفته 1402', evaluationDate: '1402/06/25', location: 'کمپ اصلی باشگاه', evaluator: 'علی کریمی', playerCategory: 'A', totalScore: 85 },
                    { id: 2, course: 'دوره پاییزه استعدادیابی 1402', evaluationDate: '1402/09/10', location: 'سالن سرپوشیده امید', evaluator: 'مهدی مهدوی‌کیا', playerCategory: 'B', totalScore: 72 },
                    { id: 3, course: 'آزمون آمادگی جسمانی', evaluationDate: '1402/11/05', location: 'کمپ شماره 2', evaluator: 'کادر فنی', playerCategory: 'A', totalScore: 91 }
                ];
                setRecords(response.data && response.data.length > 0 ? response.data : mockData);
            } catch (error) {
                console.error("Error fetching talent records:", error);
                const mockData = [
                    { id: 1, course: 'دوره تابستانه پیشرفته 1402', evaluationDate: '1402/06/25', location: 'کمپ اصلی باشگاه', evaluator: 'علی کریمی', playerCategory: 'A', totalScore: 85 },
                    { id: 2, course: 'دوره پاییزه استعدادیابی 1402', evaluationDate: '1402/09/10', location: 'سالن سرپوشیده امید', evaluator: 'مهدی مهدوی‌کیا', playerCategory: 'B', totalScore: 72 },
                    { id: 3, course: 'آزمون آمادگی جسمانی', evaluationDate: '1402/11/05', location: 'کمپ شماره 2', evaluator: 'کادر فنی', playerCategory: 'A', totalScore: 91 }
                ];
                setRecords(mockData);
            } finally {
                setLoading(false);
            }
        };

        fetchTalentRecords();
    }, [selectedCourse]);

    return (
        <div id="view-talent" className="view-section fade-in">
            <div className="sticky-top-bar">
                <button className="btn-top-action btn-back-top" onClick={() => navigate('/specialized-hub')}>
                    <i className="fa fa-arrow-right"></i> بازگشت</button>
                <h3 className="sticky-title">استعدادیابی</h3>
                <div style={{ width: '80px' }}></div>
            </div>
            
            <div className="card" style={{ padding: '15px' }}>
                <div className="input-group" style={{ marginBottom: '15px' }}>
                    <label>انتخاب دوره</label>
                    <CustomSelect value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                        <option value="course1">ترم پاییز - کلاس پیشرفته الف</option>
                        <option value="course2">ترم تابستان - کلاس مبتدی</option>
                    </CustomSelect>
                </div>

                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>دوره</th>
                                <th>تاریخ ارزیابی</th>
                                <th>مکان</th>
                                <th>ارزیاب</th>
                                <th>رده بازیکن</th>
                                <th>امتیاز کل</th>
                                <th>چاپ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>در حال دریافت اطلاعات...</td>
                                </tr>
                            ) : records.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>هیچ سابقه استعدادیابی یافت نشد.</td>
                                </tr>
                            ) : (
                                records.map((record) => (
                                    <tr key={record.id}>
                                        <td data-label="دوره">{record.course}</td>
                                        <td data-label="تاریخ ارزیابی" style={{ direction: 'ltr', textAlign: 'right' }}>{record.evaluationDate}</td>
                                        <td data-label="مکان برگزاری">{record.location}</td>
                                        <td data-label="نام ارزیاب">{record.evaluator}</td>
                                        <td data-label="گرید بازیکن">
                                            <span style={{
                                                padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold',
                                                backgroundColor: record.playerCategory === 'A' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(33, 150, 243, 0.1)',
                                                color: record.playerCategory === 'A' ? 'var(--success-color)' : 'var(--primary-color)'
                                            }}>
                                                {record.playerCategory}
                                            </span>
                                        </td>
                                        <td data-label="نمره کل" style={{ direction: 'ltr', textAlign: 'right', fontWeight: 'bold' }}>{record.totalScore} / 100</td>
                                        <td data-label="عملیات">
                                            <button className="btn-icon" title="چاپ فرم استعدادیابی" onClick={() => alert('در حال آماده سازی فایل برای چاپ...')}>
                                                <i className="fa fa-print" style={{ color: 'var(--primary-color)' }}></i>
                                            </button>
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
