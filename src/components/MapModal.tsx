import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet default icon issue in React
import icon from '../assets/marker-icon.png';
import iconShadow from '../assets/marker-shadow.png';

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

const parseOSMAddress = (osmData: any) => {
    if (osmData && osmData.address) {
        const ad = osmData.address;
        const parts = [];
        if (ad.city || ad.town || ad.village) parts.push(ad.city || ad.town || ad.village);
        if (ad.suburb || ad.district) parts.push(ad.suburb || ad.district);
        if (ad.road || ad.street || ad.pedestrian) parts.push(ad.road || ad.street || ad.pedestrian);
        if (ad.neighbourhood) parts.push(ad.neighbourhood);
        if (parts.length > 0) return [...new Set(parts)].join('، ');
        return osmData.display_name;
    }
    return null;
};

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
                // Neshan failed (e.g. domain restricted). Fallback to OSM Nominatim
                console.warn("Neshan API failed, falling back to OSM Nominatim. Error:", data.message);
                const osmResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fa`);
                const osmData = await osmResponse.json();
                const fallbackAddress = parseOSMAddress(osmData);
                setAddress(fallbackAddress || `خطای کلید API نشان: ${data.message}`);
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
            // Network error (CORS block etc). Fallback to OSM
            try {
                const osmResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fa`);
                const osmData = await osmResponse.json();
                const fallbackAddress = parseOSMAddress(osmData);
                setAddress(fallbackAddress || 'آدرس یافت نشد');
            } catch (fallbackError) {
                setAddress('خطای ارتباط با سرور نقشه');
            }
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
                const osmResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fa`);
                const osmData = await osmResponse.json();
                const fallbackAddress = parseOSMAddress(osmData);
                setAddress(fallbackAddress || `خطای کلید API: ${data.message} (محدودیت دامنه/آی‌پی)`);
            } else if (data) {
                var addr = data.formatted_address
                    || data.route_name
                    || data.neighbourhood
                    || data.city
                    || data.state
                    || "آدرس یافت نشد";
                setAddress(addr);
            }
        } catch (e) {
            try {
                const osmResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fa`);
                const osmData = await osmResponse.json();
                const fallbackAddress = parseOSMAddress(osmData);
                if (fallbackAddress) setAddress(fallbackAddress);
            } catch (fallbackError) { }
        } finally { setLoading(false); }
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
                    <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--text-dark)' }}>&times;</button>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="جستجوی شهر، خیابان (مثلا: Isfahan)"
                        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSearch();
                            }
                        }}
                    />
                    <button type="button" onClick={handleSearch} className="btn-app-secondary" style={{ padding: '0 15px', borderRadius: '8px' }}>
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
                    <button
                        type="button"
                        title="موقعیت من"
                        onClick={(e) => {
                            e.preventDefault();
                            if (navigator.geolocation) {
                                navigator.geolocation.getCurrentPosition(
                                    (pos) => {
                                        const lat = pos.coords.latitude;
                                        const lng = pos.coords.longitude;
                                        setPosition([lat, lng]);
                                        fetchAddressDirectly(lat, lng);
                                    },
                                    (err) => {
                                        alert('دسترسی به موقعیت یاب امکان‌پذیر نیست.');
                                    }
                                );
                            } else {
                                alert('مرورگر شما از موقعیت یاب پشتیبانی نمی‌کند.');
                            }
                        }}
                        style={{
                            position: 'absolute',
                            bottom: '15px',
                            right: '15px',
                            zIndex: 1000,
                            background: '#eef4ff',
                            color: '#1e293b',
                            border: 'none',
                            borderRadius: '50%',
                            width: '44px',
                            height: '44px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="6" />
                            <circle cx="12" cy="12" r="2" fill="#1e293b" />
                            <line x1="12" y1="2" x2="12" y2="6" />
                            <line x1="12" y1="18" x2="12" y2="22" />
                            <line x1="2" y1="12" x2="6" y2="12" />
                            <line x1="18" y1="12" x2="22" y2="12" />
                        </svg>
                    </button>
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

                <div style={{ display: 'flex', gap: '12px', marginTop: '20px', width: '100%' }}>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{ flex: 1, padding: '12px', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 'bold', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer' }}
                    >
                        انصراف
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={!address || loading}
                        style={{ flex: 1, padding: '12px', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 'bold', background: '#3b82f6', color: '#fff', border: 'none', opacity: (!address || loading) ? 0.6 : 1, cursor: (!address || loading) ? 'not-allowed' : 'pointer' }}
                    >
                        تایید موقعیت
                    </button>
                </div>
            </div>
        </div>
    );
}
