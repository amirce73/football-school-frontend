import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { useAuth } from '../../contexts/AuthContext';
import CustomSelect from '../../components/CustomSelect';

export default function ClothingInfo() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
      shirtSize: 'M',
      shortsSize: 'M',
      shoeSize: ''
  });

  useEffect(() => {
      if (user) {
          setFormData({
              shirtSize: user.shirtSize || 'M',
              shortsSize: user.shortsSize || 'M',
              shoeSize: user.shoeSize?.toString() || ''
          });
      }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
      setLoading(true);
      try {
          await api.put('/users/clothing', {
              ...formData,
              shoeSize: formData.shoeSize ? parseInt(formData.shoeSize) : null
          });
          await refreshUser();
          alert('سایز پوشاک با موفقیت ذخیره شد!');
      } catch (error) {
          console.error(error);
          alert('خطا در ذخیره اطلاعات');
      } finally {
          setLoading(false);
      }
  };

  return (
    <div id="view-clothing-info" className="view-section fade-in">
            <div className="sticky-top-bar"><button className="btn-top-action btn-back-top" onClick={() => navigate('/profile-hub')}><i className="fa fa-arrow-right"></i> بازگشت</button>
                <h3 className="sticky-title">سایز پوشاک</h3><button className="btn-top-action btn-submit-top" onClick={handleSubmit} disabled={loading}><i className="fa fa-check"></i> {loading ? '...' : 'ثبت'}</button>
            </div>
            <div className="card">
                <div className="form-grid">
                    <div className="input-group"><label>سایز پیراهن <span className="text-danger">*</span></label><CustomSelect name="shirtSize" value={formData.shirtSize} onChange={handleChange}>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                            <option value="XXL">XXL</option>
                        </CustomSelect></div>
                    <div className="input-group"><label>سایز شورت ورزشی <span className="text-danger">*</span></label><CustomSelect name="shortsSize" value={formData.shortsSize} onChange={handleChange}>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                            <option value="XXL">XXL</option>
                        </CustomSelect></div>
                    <div className="input-group"><label>سایز کفش (شماره)</label><input type="number" name="shoeSize" value={formData.shoeSize} onChange={handleChange} placeholder="مثال: 42" />
                    </div>
                </div>
            </div>
        </div>
  );
}
