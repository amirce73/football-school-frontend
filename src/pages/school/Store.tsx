import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Store() {
  const navigate = useNavigate();
  return (
    <div id="view-store" className="view-section fade-in">
            <div className="sticky-top-bar">
                <button className="btn-top-action btn-back-top" onClick={() => navigate('/dashboard')}><i className="fa fa-arrow-right"></i> بازگشت</button>
                <h3 className="sticky-title">فروشگاه باشگاه</h3>
                <div style={{"width":"80px"}}></div>
            </div>
            <div className="store-grid">
                <div className="product-card">
                    <img src="" alt="product" className="product-img" />
                    <div className="product-info">
                        <div className="product-title">پیراهن رسمی مسابقات (آستین کوتاه)</div>
                        <div className="product-price">۴۵۰,۰۰۰ تومان</div>
                        <button className="btn-buy" onClick={() => { alert('به سبد خرید اضافه شد.') }}><i className="fa fa-shopping-cart"></i> افزودن به سبد</button>
                    </div>
                </div>
                <div className="product-card">
                    <img src="" alt="product" className="product-img" />
                    <div className="product-info">
                        <div className="product-title">شورت ورزشی تمرینی (اورجینال)</div>
                        <div className="product-price">۲۸۰,۰۰۰ تومان</div>
                        <button className="btn-buy" onClick={() => { alert('به سبد خرید اضافه شد.') }}><i className="fa fa-shopping-cart"></i> افزودن به سبد</button>
                    </div>
                </div>
                <div className="product-card">
                    <img src="" alt="product" className="product-img" />
                    <div className="product-info">
                        <div className="product-title">جوراب ورزشی ساق بلند حرفه‌ای</div>
                        <div className="product-price">۱۲۰,۰۰۰ تومان</div>
                        <button className="btn-buy" onClick={() => { alert('به سبد خرید اضافه شد.') }}><i className="fa fa-shopping-cart"></i> افزودن به سبد</button>
                    </div>
                </div>
                <div className="product-card">
                    <img src="" alt="product" className="product-img" />
                    <div className="product-info">
                        <div className="product-title">کوله پشتی باشگاه با لوگو اختصاصی</div>
                        <div className="product-price">۸۵۰,۰۰۰ تومان</div>
                        <button className="btn-buy" onClick={() => { alert('به سبد خرید اضافه شد.') }}><i className="fa fa-shopping-cart"></i> افزودن به سبد</button>
                    </div>
                </div>
            </div>
        </div>
  );
}
