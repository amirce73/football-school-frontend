import React, { useState, useRef, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import DateObjectModule from "react-date-object";
import persianModule from "react-date-object/calendars/persian";

const DateObject = DateObjectModule.default || DateObjectModule;
const persian = persianModule.default || persianModule;

const ITEM_HEIGHT = 44; // px

const toPersianDigits = (num) => {
    const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)]);
};

const PERSIAN_MONTHS = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

const ScrollColumn = ({ items, value, onChange, label, isMonth }) => {
    const scrollRef = useRef(null);
    const scrollTimeoutRef = useRef(null);
    const isMountedRef = useRef(false);

    useEffect(() => {
        if (scrollRef.current) {
            const index = items.indexOf(value);
            if (index !== -1) {
                const targetScrollTop = index * ITEM_HEIGHT;
                scrollRef.current.scrollTo({ top: targetScrollTop, behavior: 'auto' });
                scrollRef.current.scrollTop = targetScrollTop;
                isMountedRef.current = true;
            }
        }
    }, []);

    useEffect(() => {
        if (!isMountedRef.current || !scrollRef.current) return;

        const index = items.indexOf(value);
        if (index !== -1) {
            const targetScrollTop = index * ITEM_HEIGHT;
            if (Math.abs(scrollRef.current.scrollTop - targetScrollTop) > 20) {
                scrollRef.current.scrollTo({ top: targetScrollTop, behavior: 'smooth' });
            }
        }
    }, [value, items]);

    const handleScroll = () => {
        if (!scrollRef.current) return;

        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = setTimeout(() => {
            if (!scrollRef.current) return;
            const scrollTop = scrollRef.current.scrollTop;
            const index = Math.round(scrollTop / ITEM_HEIGHT);
            if (index >= 0 && index < items.length) {
                if (items[index] !== value) {
                    onChange(items[index]);
                }
            }
        }, 100);
    };

    return (
        <div style={{ flex: 1, height: ITEM_HEIGHT * 5, position: 'relative', zIndex: 2, overflow: 'hidden' }}>
            <div
                ref={scrollRef}
                className="hide-scrollbar"
                onScroll={handleScroll}
                style={{
                    height: '100%',
                    overflowY: 'auto',
                    scrollSnapType: 'y mandatory',
                    scrollBehavior: 'smooth',
                    WebkitOverflowScrolling: 'touch'
                }}
            >
                <div style={{ height: ITEM_HEIGHT * 2, scrollSnapAlign: 'center' }} />

                {items.map((item) => (
                    <div
                        key={item}
                        style={{
                            height: ITEM_HEIGHT,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            scrollSnapAlign: 'center',
                            fontSize: item === value ? (isMonth ? '1.1rem' : '1.3rem') : (isMonth ? '0.9rem' : '1.1rem'),
                            fontWeight: item === value ? '800' : '500',
                            color: item === value ? 'var(--primary, #3b82f6)' : 'var(--text-muted, #64748b)',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer',
                            userSelect: 'none'
                        }}
                        onClick={() => {
                            onChange(item);
                            scrollRef.current?.scrollTo({
                                top: items.indexOf(item) * ITEM_HEIGHT,
                                behavior: 'smooth'
                            });
                        }}
                    >
                        {isMonth ? PERSIAN_MONTHS[item - 1] : toPersianDigits(item)}
                    </div>
                ))}

                <div style={{ height: ITEM_HEIGHT * 2, scrollSnapAlign: 'center' }} />
            </div>
        </div>
    );
};

export default function CustomScrollDatePicker({ isOpen, onClose, onConfirm, initialDate, allowFuture = false }) {
    const todayJalali = useMemo(() => {
        const today = new DateObject({ calendar: persian });
        return {
            year: today.year,
            month: today.month.number,
            day: today.day
        };
    }, []);

    const [year, setYear] = useState(todayJalali.year);
    const [month, setMonth] = useState(todayJalali.month);
    const [day, setDay] = useState(todayJalali.day);

    const convertPersianToEnglishDigits = (str) => {
        const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return str.replace(/[۰-۹]/g, w => persianDigits.indexOf(w).toString());
    };

    useEffect(() => {
        if (isOpen) {
            if (initialDate && initialDate.trim() !== '') {
                const englishInitial = convertPersianToEnglishDigits(initialDate);
                const parts = englishInitial.split('/');
                if (parts.length === 3) {
                    setYear(parseInt(parts[0], 10));
                    setMonth(parseInt(parts[1], 10));
                    setDay(parseInt(parts[2], 10));
                }
            } else {
                setYear(todayJalali.year);
                setMonth(todayJalali.month);
                setDay(todayJalali.day);
            }
        }
    }, [isOpen, initialDate, todayJalali]);

    const years = useMemo(() => {
        const startYear = 1320;
        const endYear = 1450;
        return Array.from({ length: endYear - startYear + 1 }, (_, i) => endYear - i);
    }, []);

    let maxMonths = 12;
    const months = Array.from({ length: maxMonths }, (_, i) => i + 1);

    const isLeapYear = (y) => {
        return new DateObject({ year: y, month: 1, day: 1, calendar: persian }).isLeap;
    };

    let maxDays = 31;
    if (month > 6) maxDays = 30;
    if (month === 12) maxDays = isLeapYear(year) ? 30 : 29;

    const days = Array.from({ length: maxDays }, (_, i) => i + 1);

    useEffect(() => {
        if (month > maxMonths) setMonth(maxMonths);
    }, [maxMonths, month]);

    useEffect(() => {
        if (day > maxDays) setDay(maxDays);
    }, [maxDays, day]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        const yStr = year.toString();
        const mStr = month.toString().padStart(2, '0');
        const dStr = day.toString().padStart(2, '0');
        onConfirm(`${yStr}/${mStr}/${dStr}`);
    };

    if (typeof document === 'undefined') return null;

    return ReactDOM.createPortal(
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                backdropFilter: 'blur(4px)',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',
                opacity: isOpen ? 1 : 0,
                transition: 'opacity 0.3s ease'
            }}>
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: '#fff',
                    borderTopLeftRadius: '28px',
                    borderTopRightRadius: '28px',
                    padding: '24px 20px',
                    boxShadow: '0 -10px 40px rgba(0,0,0,0.15)',
                    paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
                    width: '100%',
                    maxWidth: '400px'
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <button type="button" onClick={onClose} style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: 'var(--danger, #ef4444)', fontWeight: 'bold', fontSize: '0.95rem', cursor: 'pointer', padding: '8px 16px', borderRadius: '12px' }}>لغو</button>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>انتخاب تاریخ</h4>
                        <button
                            type="button"
                            onClick={() => {
                                setYear(todayJalali.year);
                                setMonth(todayJalali.month);
                                setDay(todayJalali.day);
                            }}
                            style={{
                                fontSize: '0.8rem',
                                color: 'var(--primary, #3b82f6)',
                                background: 'rgba(59, 130, 246, 0.1)',
                                border: '1px solid rgba(0, 0, 0, 0.2)',
                                padding: '4px 16px',
                                borderRadius: '20px',
                                marginTop: '8px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                outline: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                boxShadow: '0 2px 6px rgba(59, 130, 246, 0.15)'
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            امروز
                        </button>
                    </div>
                    <button type="button" onClick={handleConfirm} style={{ background: 'var(--primary, #3b82f6)', border: 'none', color: '#fff', fontWeight: 'bold', fontSize: '0.95rem', cursor: 'pointer', padding: '8px 16px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>تایید</button>
                </div>

                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', background: '#f8fafc', borderRadius: '20px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>

                    {/* Column Headers */}
                    <div style={{ display: 'flex', direction: 'rtl', padding: '12px 0', borderBottom: '1px solid #e2e8f0', background: '#f1f5f9' }}>
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
                            <div style={{ cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', background: '#e2e8f0' }} onClick={() => {
                                const idx = days.indexOf(day);
                                if (idx > 0) setDay(days[idx - 1]);
                            }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                            </div>
                            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted, #64748b)' }}>روز</span>
                            <div style={{ cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', background: '#e2e8f0' }} onClick={() => {
                                const idx = days.indexOf(day);
                                if (idx < days.length - 1) setDay(days[idx + 1]);
                            }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </div>
                        </div>

                        <div style={{ width: '1px', background: '#000', opacity: 0.3 }} />

                        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
                            <div style={{ cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', background: '#e2e8f0' }} onClick={() => {
                                const idx = months.indexOf(month);
                                if (idx > 0) setMonth(months[idx - 1]);
                            }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                            </div>
                            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted, #64748b)' }}>ماه</span>
                            <div style={{ cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', background: '#e2e8f0' }} onClick={() => {
                                const idx = months.indexOf(month);
                                if (idx < months.length - 1) setMonth(months[idx + 1]);
                            }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </div>
                        </div>

                        <div style={{ width: '1px', background: '#000', opacity: 0.3 }} />

                        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
                            <div style={{ cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', background: '#e2e8f0' }} onClick={() => {
                                const idx = years.indexOf(year);
                                if (idx > 0) setYear(years[idx - 1]);
                            }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                            </div>
                            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted, #64748b)' }}>سال</span>
                            <div style={{ cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', background: '#e2e8f0' }} onClick={() => {
                                const idx = years.indexOf(year);
                                if (idx < years.length - 1) setYear(years[idx + 1]);
                            }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </div>
                        </div>
                    </div>

                    <div style={{ position: 'relative', display: 'flex', direction: 'rtl' }}>
                        {/* Selection Highlight Box */}
                        <div style={{
                            position: 'absolute',
                            top: ITEM_HEIGHT * 2,
                            left: 10,
                            right: 10,
                            height: ITEM_HEIGHT,
                            background: '#fff',
                            border: '2px solid var(--primary, #3b82f6)',
                            borderRadius: '12px',
                            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.15)',
                            pointerEvents: 'none',
                            zIndex: 1
                        }} />

                        <ScrollColumn items={days} value={day} onChange={setDay} label="" />
                        <div style={{ width: '1px', background: '#000', opacity: 0.3, zIndex: 2, margin: '10px 0' }} />
                        <ScrollColumn items={months} value={month} onChange={setMonth} label="" isMonth={true} />
                        <div style={{ width: '1px', background: '#000', opacity: 0.3, zIndex: 2, margin: '10px 0' }} />
                        <ScrollColumn items={years} value={year} onChange={setYear} label="" />
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
