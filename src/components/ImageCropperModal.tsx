import React, { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Cropper from 'react-easy-crop';

interface ImageCropperModalProps {
    isOpen: boolean;
    imageUrl: string;
    onClose: () => void;
    onConfirm: (croppedImageBase64: string) => void;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });

function getRadianAngle(degreeValue: number) {
    return (degreeValue * Math.PI) / 180;
}

export default function ImageCropperModal({ isOpen, imageUrl, onClose, onConfirm }: ImageCropperModalProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const showCroppedImage = useCallback(async () => {
        try {
            const image = await createImage(imageUrl);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                return null;
            }

            const safeArea = Math.max(image.width, image.height) * 2;

            canvas.width = safeArea;
            canvas.height = safeArea;

            ctx.translate(safeArea / 2, safeArea / 2);
            ctx.rotate(getRadianAngle(rotation));
            ctx.translate(-safeArea / 2, -safeArea / 2);

            ctx.drawImage(
                image,
                safeArea / 2 - image.width * 0.5,
                safeArea / 2 - image.height * 0.5
            );

            const data = ctx.getImageData(0, 0, safeArea, safeArea);

            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;

            ctx.putImageData(
                data,
                Math.round(0 - safeArea / 2 + image.width * 0.5 - croppedAreaPixels.x),
                Math.round(0 - safeArea / 2 + image.height * 0.5 - croppedAreaPixels.y)
            );

            // Compress to max 500x500 dimensions
            const MAX_SIZE = 500;
            let finalWidth = canvas.width;
            let finalHeight = canvas.height;
            if (finalWidth > MAX_SIZE || finalHeight > MAX_SIZE) {
                const ratio = Math.min(MAX_SIZE / finalWidth, MAX_SIZE / finalHeight);
                finalWidth = finalWidth * ratio;
                finalHeight = finalHeight * ratio;
            }

            const finalCanvas = document.createElement('canvas');
            finalCanvas.width = finalWidth;
            finalCanvas.height = finalHeight;
            const finalCtx = finalCanvas.getContext('2d');
            finalCtx?.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, finalWidth, finalHeight);

            // Export with 0.8 quality jpeg to ensure small size
            const base64Image = finalCanvas.toDataURL('image/jpeg', 0.8);
            onConfirm(base64Image);
        } catch (e) {
            console.error(e);
        }
    }, [imageUrl, croppedAreaPixels, rotation, onConfirm]);

    if (!isOpen) return null;

    return createPortal(
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex',
            justifyContent: 'center', alignItems: 'center'
        }}>
            <div className="modal-content" style={{
                background: 'var(--surface)', padding: '20px', borderRadius: '12px',
                width: '90%', maxWidth: '500px', boxShadow: 'var(--shadow-md)',
                display: 'flex', flexDirection: 'column'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0 }}>برش و تنظیم عکس</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text-dark)' }}>&times;</button>
                </div>
                
                <div style={{ position: 'relative', width: '100%', height: '300px', background: '#333', borderRadius: '8px', overflow: 'hidden' }}>
                    <Cropper
                        image={imageUrl}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspect={1}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                        onRotationChange={setRotation}
                    />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                    <div>
                        <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>بزرگنمایی: {Math.round(zoom * 100)}%</label>
                        <input
                            type="range"
                            min={1}
                            max={3}
                            step={0.1}
                            value={zoom}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--primary)' }}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                        <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>چرخش: {rotation}°</label>
                        <button 
                            type="button" 
                            className="btn-app-secondary" 
                            style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.9rem', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer' }}
                            onClick={() => setRotation((prev) => (prev + 90) % 360)}
                        >
                            <i className="fa fa-rotate-right" style={{ marginLeft: '6px' }}></i> چرخش ۹۰ درجه
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button type="button" onClick={showCroppedImage} className="btn-app-primary" style={{ flex: 1, padding: '12px', borderRadius: '10px' }}>تایید و ذخیره</button>
                    <button type="button" onClick={onClose} className="btn-app-secondary" style={{ flex: 1, padding: '12px', borderRadius: '10px' }}>انصراف</button>
                </div>
            </div>
        </div>,
        document.body
    );
}
