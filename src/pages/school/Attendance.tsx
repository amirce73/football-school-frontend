import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import CustomSelect from '../../components/CustomSelect';

interface AttendanceRecord {
    id: number;
    date: string;
    day: string;
    startTime: string;
    endTime: string;
    location: string;
    status: 'حاضر' | 'غایب' | 'تاخیر';
    scoreOrReason: string;
}

export default function Attendance() {
    const navigate = useNavigate();
    const [selectedCourse, setSelectedCourse] = useState('course1');

    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAttendance = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/specialized/attendance?courseId=${selectedCourse}`);
                const mockData: AttendanceRecord[] = [
                    { id: 1, date: '1402/05/12', day: 'دوشنبه', startTime: '16:00', endTime: '18:00', location: 'زمین چمن شماره 1', status: 'حاضر', scoreOrReason: '10' },
                    { id: 2, date: '1402/05/14', day: 'چهارشنبه', startTime: '16:00', endTime: '18:00', location: 'زمین چمن شماره 1', status: 'غایب', scoreOrReason: 'بیماری' },
                    { id: 3, date: '1402/05/19', day: 'دوشنبه', startTime: '16:00', endTime: '18:00', location: 'زمین چمن شماره 2', status: 'تاخیر', scoreOrReason: 'ترافیک (15 دقیقه)' },
                    { id: 4, date: '1402/05/21', day: 'چهارشنبه', startTime: '16:00', endTime: '18:00', location: 'زمین چمن شماره 1', status: 'حاضر', scoreOrReason: '9' }
                ];
                setRecords(response.data && response.data.length > 0 ? response.data : mockData);
            } catch (error) {
                console.error("Error fetching attendance:", error);
                const mockData: AttendanceRecord[] = [
                    { id: 1, date: '1402/05/12', day: 'دوشنبه', startTime: '16:00', endTime: '18:00', location: 'زمین چمن شماره 1', status: 'حاضر', scoreOrReason: '10' },
                    { id: 2, date: '1402/05/14', day: 'چهارشنبه', startTime: '16:00', endTime: '18:00', location: 'زمین چمن شماره 1', status: 'غایب', scoreOrReason: 'بیماری' },
                    { id: 3, date: '1402/05/19', day: 'دوشنبه', startTime: '16:00', endTime: '18:00', location: 'زمین چمن شماره 2', status: 'تاخیر', scoreOrReason: 'ترافیک (15 دقیقه)' },
                    { id: 4, date: '1402/05/21', day: 'چهارشنبه', startTime: '16:00', endTime: '18:00', location: 'زمین چمن شماره 1', status: 'حاضر', scoreOrReason: '9' }
                ];
                setRecords(mockData);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, [selectedCourse]);

    return (
        <div id="view-attendance" className="view-section fade-in">
            <div className="sticky-top-bar">
                <button className="btn-top-action btn-back-top" onClick={() => navigate('/specialized-hub')}>
                    <i className="fa fa-arrow-right"></i> بازگشت</button>
                <h3 className="sticky-title">حضور و غیاب</h3>
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
                                <th>تاریخ آموزش</th>
                                <th>روز</th>
                                <th>ساعت شروع</th>
                                <th>ساعت پایان</th>
                                <th>مکان</th>
                                <th>وضعیت حضور و غیاب</th>
                                <th>نمره / علت غیبت</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>در حال دریافت اطلاعات...</td>
                                </tr>
                            ) : records.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>هیچ سابقه‌ای در این دوره یافت نشد.</td>
                                </tr>
                            ) : (
                                records.map((record) => (
                                    <tr key={record.id}>
                                        <td data-label="تاریخ ثبت" style={{ direction: 'ltr', textAlign: 'right' }}>{record.date}</td>
                                        <td data-label="روز">{record.day}</td>
                                        <td data-label="ساعت شروع" style={{ direction: 'ltr', textAlign: 'right' }}>{record.startTime}</td>
                                        <td data-label="ساعت پایان" style={{ direction: 'ltr', textAlign: 'right' }}>{record.endTime}</td>
                                        <td data-label="مکان">{record.location}</td>
                                        <td data-label="وضعیت حضور و غیاب">
                                            <span style={{
                                                padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem',
                                                backgroundColor: record.status === 'حاضر' ? 'rgba(76, 175, 80, 0.1)' : 
                                                               record.status === 'غایب' ? 'rgba(244, 67, 54, 0.1)' : 'rgba(255, 152, 0, 0.1)',
                                                color: record.status === 'حاضر' ? 'var(--success-color)' : 
                                                       record.status === 'غایب' ? 'var(--danger-color)' : 'var(--warning-color)'
                                            }}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td data-label="نمره / علت غیبت">{record.scoreOrReason}</td>
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
