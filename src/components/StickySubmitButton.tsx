import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface StickySubmitButtonProps {
    loading: boolean;
    loadingText?: string;
    text?: string;
    onClick?: () => void;
    type?: 'submit' | 'button';
}

export default function StickySubmitButton({
    loading,
    loadingText = 'در حال ثبت...',
    text = 'ثبت اطلاعات',
    onClick,
    type = 'submit'
}: StickySubmitButtonProps) {
    const [bottomOffset, setBottomOffset] = useState(65);

    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
    const [topBarElement, setTopBarElement] = useState<Element | null>(null);

    const wrapperRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const vv = window.visualViewport;
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768);
            if (!vv) return;
            const keyboardHeight = window.innerHeight - vv.height - vv.offsetTop;
            if (keyboardHeight > 150) {
                setBottomOffset(keyboardHeight + 4);
            } else {
                setBottomOffset(65);
            }
        };

        if (vv) {
            vv.addEventListener('resize', handleResize);
            vv.addEventListener('scroll', handleResize);
        }
        window.addEventListener('resize', handleResize);

        // Find the sticky top bar ON THE CURRENT PAGE using the ref
        // We use setTimeout to ensure DOM is fully painted after page transition
        const findTopBar = () => {
            if (wrapperRef.current) {
                const viewSection = wrapperRef.current.closest('.view-section');
                if (viewSection) {
                    const topBar = viewSection.querySelector('.sticky-top-bar');
                    if (topBar) {
                        setTopBarElement(topBar);
                        return;
                    }
                }
            }
            // Fallback
            const topBar = document.querySelector('.sticky-top-bar');
            if (topBar) setTopBarElement(topBar);
        };

        setTimeout(findTopBar, 10);

        return () => {
            if (vv) {
                vv.removeEventListener('resize', handleResize);
                vv.removeEventListener('scroll', handleResize);
            }
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // 1. DESKTOP RENDER: Portal the button into the top bar
    if (isDesktop && topBarElement) {
        const desktopButton = (
            <button
                type={type}
                className="btn-top-action btn-submit-top"
                disabled={loading}
                onClick={onClick}
            >
                <i className="fa fa-check" style={{ marginLeft: '8px' }}></i>
                {loading ? loadingText : text}
            </button>
        );
        return (
            <div ref={wrapperRef} className="desktop-anchor" style={{ display: 'none' }}>
                {createPortal(desktopButton, topBarElement)}
            </div>
        );
    }

    // 2. MOBILE RENDER: Portal the button to document.body
    const mobileButton = (
        <div
            className="sticky-submit-wrapper"
            style={{ bottom: `${bottomOffset}px`, transition: 'bottom 0.2s ease' }}
        >
            <button
                type={type}
                className="sticky-submit-btn btn-app-primary"
                disabled={loading}
                onClick={onClick}
            >
                <i className="fa fa-check" style={{ marginLeft: '8px' }}></i>
                {loading ? loadingText : text}
            </button>
        </div>
    );

    return (
        <div ref={wrapperRef} className="mobile-anchor">
            {/* Spacer so the last form field isn't hidden behind the fixed button */}
            <div style={{ height: '80px', flexShrink: 0 }} className="mobile-only-spacer" />
            {createPortal(mobileButton, document.body)}
        </div>
    );
}
