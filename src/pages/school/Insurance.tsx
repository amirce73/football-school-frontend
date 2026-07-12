import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { useAuth } from '../../contexts/AuthContext';

export default function Insurance() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
      rpeIndex: '5',
      sleepQuality: '4'
  });

  useEffect(() => {
      if (user) {
          setFormData({
              rpeIndex: user.rpeIndex?.toString() || '5',
              sleepQuality: user.sleepQuality?.toString() || '4'
          });
      }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
      setLoading(true);
      try {
          await api.put('/users/insurance-rpe', {
              rpeIndex: parseInt(formData.rpeIndex),
              sleepQuality: parseInt(formData.sleepQuality)
          });
          await refreshUser();
          alert('گزارش با موفقیت ثبت شد!');
      } catch (error) {
          console.error(error);
          alert('خطا در ثبت اطلاعات');
      } finally {
          setLoading(false);
      }
  };

  return (
    <div id="view-insurance" className="view-section fade-in">
            <div className="sticky-top-bar"><button className="btn-top-action btn-back-top" onClick={() => navigate('/specialized-hub')}><i className="fa fa-arrow-right"></i> بازگشت</button>
                <h3 className="sticky-title">فرم فشار تمرین RPE</h3><button className="btn-top-action btn-submit-top" onClick={handleSubmit} disabled={loading}><i className="fa fa-check"></i> {loading ? '...' : 'ثبت گزارش'}</button>
            </div>
            <div className="card">
                <div className="form-grid">
                    <div className="input-group"><label>شاخص فشار تمرین RPE (از ۰ تا ۱۰)</label><input type="number" name="rpeIndex" min="0" max="10" value={formData.rpeIndex} onChange={handleChange} /></div>
                    <div className="input-group"><label>کیفیت خواب (۱ تا ۵)</label><input type="number" name="sleepQuality" min="1" max="5" value={formData.sleepQuality} onChange={handleChange} /></div>
                </div>
            </div>
        </div>
  );
}
