import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet default icon issue in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (address: string) => void;
}

// Isfahan coordinates as default (from your code)
const DEFAULT_CENTER: [number, number] = [32.6546, 51.6680];

function LocationSelector({ position, setPosition, setAddress, setLoading }: any) {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.flyTo(position, map.getZoom(), { animate: true });
        }
    }, [position, map]);

    const fetchAddress = async (lat: number, lng: number) => {
        setLoading(true);
        try {
            // Using Neshan Reverse Geocoding API with the provided key
            const apiKey = 'service.ec711af1d62c4f72b2d0b33a31a65cc1'; 
            
            const response = await fetch(`https://api.neshan.org/v5/reverse?lat=${lat}&lng=${lng}`, {
                headers: {
                    'Api-Key': apiKey
                }
            });
            const data = await response.json();
            
            if (data && data.status === 'ERROR') {
                setAddress(`خطای کلید API: ${data.message} (محدودیت دامنه/آی‌پی)`);
            } else if (data) {
                var addr = data.formatted_address
                    || data.route_name
                    || data.neighbourhood
                    || data.city
                    || data.state
                    || "آدرس یافت نشد";
                setAddress(addr);
            } else {
                setAddress('آدرس یافت نشد. می‌توانید موقعیت را تغییر دهید.');
            }
        } catch (err) {
            setAddress('خطا در ارتباط با سرور نشان. لطفا دوباره تلاش کنید.');
        } finally {
            setLoading(false);
        }
    };

    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]);
            fetchAddress(lat, lng);
        },
    });

    return position === null ? null : (
        <Marker 
            position={position}
            draggable={true}
            eventHandlers={{
                dragend: (e) => {
                    const marker = e.target;
                    const pos = marker.getLatLng();
                    setPosition([pos.lat, pos.lng]);
                    fetchAddress(pos.lat, pos.lng);
                }
            }}
        ></Marker>
    );
}

export default function MapModal({ isOpen, onClose, onConfirm }: MapModalProps) {
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [address, setAddress] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchAddressDirectly = async (lat: number, lng: number) => {
        setLoading(true);
        try {
            const response = await fetch(`https://api.neshan.org/v5/reverse?lat=${lat}&lng=${lng}`, {
                headers: { 'Api-Key': 'service.ec711af1d62c4f72b2d0b33a31a65cc1' }
            });
            const data = await response.json();
            if (data && data.status === 'ERROR') {
                setAddress(`خطای کلید API: ${data.message} (محدودیت دامنه/آی‌پی)`);
            } else if (data) {
                var addr = data.formatted_address
                    || data.route_name
                    || data.neighbourhood
                    || data.city
                    || data.state
                    || "آدرس یافت نشد";
                setAddress(addr);
            }
        } catch (e) {} finally { setLoading(false); }
    };

    // Try to get user's current location on open
    useEffect(() => {
        if (isOpen && !position) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        setPosition([pos.coords.latitude, pos.coords.longitude]);
                        fetchAddressDirectly(pos.coords.latitude, pos.coords.longitude);
                    },
                    (err) => {
                        console.log('Location access denied or failed.', err);
                        setPosition(DEFAULT_CENTER);
                    }
                );
            } else {
                setPosition(DEFAULT_CENTER);
            }
        }
    }, [isOpen, position]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (address && !loading) {
            onConfirm(address);
            onClose();
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            alert('نام مکان را وارد کنید');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            if (data.length === 0) {
                alert('مکان پیدا نشد');
                return;
            }
            const result = data[0];
            const lat = parseFloat(result.lat);
            const lon = parseFloat(result.lon);
            setPosition([lat, lon]);
            fetchAddressDirectly(lat, lon);
        } catch (e) {
            alert('خطا در جستجو');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex',
            justifyContent: 'center', alignItems: 'center', padding: '15px'
        }} onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{
                background: 'var(--surface)', padding: '20px', borderRadius: '12px',
                width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '15px',
                boxShadow: 'var(--shadow-lg)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}><i className="fa fa-map-marker text-danger"></i> انتخاب موقعیت روی نقشه</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--text-dark)' }}>&times;</button>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="جستجوی شهر، خیابان (مثلا: Isfahan)" 
                        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    />
                    <button onClick={handleSearch} className="btn-app-secondary" style={{ padding: '0 15px', borderRadius: '8px' }}>
                        <i className="fa fa-search"></i>
                    </button>
                </div>

                <div style={{ height: '300px', width: '100%', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
                    <MapContainer center={position || DEFAULT_CENTER} zoom={16} style={{ height: '100%', width: '100%', zIndex: 1 }}>
                        <TileLayer
                            url="https://raster.snappmaps.ir/styles/snapp-style/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://snapp.ir">Snapp Maps</a> | Neshan API'
                        />
                        <LocationSelector position={position} setPosition={setPosition} setAddress={setAddress} setLoading={setLoading} />
                    </MapContainer>
                </div>

                <div style={{
                    padding: '12px', background: 'var(--background)', borderRadius: '8px',
                    border: '1px solid var(--border-color)', fontSize: '0.9rem', minHeight: '60px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center'
                }}>
                    {loading ? (
                        <span style={{ color: 'var(--text-muted)' }}><i className="fa fa-spinner fa-spin"></i> در حال دریافت آدرس...</span>
                    ) : address ? (
                        <span style={{ fontWeight: 'bold' }}>{address}</span>
                    ) : (
                        <span style={{ color: 'var(--text-muted)' }}>نقشه را کلیک کنید یا نشانگر را جابجا کنید</span>
                    )}
                </div>

                <button 
                    onClick={handleConfirm} 
                    disabled={!address || loading}
                    className="btn-app-primary" 
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', fontWeight: 'bold', opacity: (!address || loading) ? 0.6 : 1 }}
                >
                    <i className="fa fa-check"></i> تایید و استفاده از این آدرس
                </button>
            </div>
        </div>
    );
}
