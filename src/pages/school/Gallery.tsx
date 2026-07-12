import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Gallery() {
  const navigate = useNavigate();
  return (
    <div id="view-gallery" className="view-section fade-in">
            <div className="sticky-top-bar">
                <button className="btn-top-action btn-back-top" onClick={() => navigate('/dashboard')}><i className="fa fa-arrow-right"></i> بازگشت</button>
                <h3 className="sticky-title">گالری تصاویر</h3>
                <div style={{"width":"80px"}}></div>
            </div>
            <div className="gallery-grid">
                <div className="gallery-item"><img src="" alt="gallery" /></div>
                <div className="gallery-item"><img src="" alt="gallery" /></div>
                <div className="gallery-item"><img src="" alt="gallery" /></div>
                <div className="gallery-item"><img src="" alt="gallery" /></div>
                <div className="gallery-item"><img src="" alt="gallery" /></div>
                <div className="gallery-item"><img src="" alt="gallery" /></div>
            </div>
        </div>
  );
}
