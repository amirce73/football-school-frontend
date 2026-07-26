import './premiumAlert.css';

// Translation map
const alertTranslations: Record<string, string> = {};

const currentLang = 'fa'; // Default

export function showPremiumAlert(msg: string, title?: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') {
    let overlay = document.getElementById('fi-alert-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'fi-alert-overlay';
        overlay.className = 'fi-alert-overlay';

        const modal = document.createElement('div');
        modal.id = 'fi-alert-modal';

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    const modal = document.getElementById('fi-alert-modal');
    if (!modal) return;

    modal.className = `fi-alert-modal fi-alert-${type}`;
    modal.style.direction = currentLang === 'en' ? 'ltr' : 'rtl';

    let icon = '<i class="fa fa-info"></i>';
    let defaultTitle = currentLang === 'en' ? 'Message' : 'پیام';

    if (type === 'success') { icon = '<i class="fa fa-check"></i>'; defaultTitle = currentLang === 'en' ? 'Success' : 'موفق'; }
    else if (type === 'error') { icon = '<i class="fa fa-times"></i>'; defaultTitle = currentLang === 'en' ? 'Error' : 'خطا'; }
    else if (type === 'warning') { icon = '<i class="fa fa-exclamation-triangle"></i>'; defaultTitle = currentLang === 'en' ? 'Warning' : 'هشدار'; }

    let displayTitle = title ? title : defaultTitle;
    let displayMsg = msg;

    if (currentLang === 'en') {
        if (alertTranslations[displayTitle]) displayTitle = alertTranslations[displayTitle];
        if (alertTranslations[displayMsg]) displayMsg = alertTranslations[displayMsg];
    }

    const btnText = currentLang === 'en' ? 'OK' : 'متوجه شدم';

    modal.innerHTML = `
        <div class="fi-alert-icon-wrapper">
            <span class="fi-alert-icon">${icon}</span>
        </div>
        <div class="fi-alert-title">${displayTitle}</div>
        <div class="fi-alert-msg">${displayMsg}</div>
        <button class="fi-alert-btn" id="fi-alert-btn-close">${btnText}</button>
    `;

    document.getElementById('fi-alert-btn-close')?.addEventListener('click', closePremiumAlert);

    overlay.style.visibility = 'visible';
    requestAnimationFrame(() => {
        overlay?.classList.add('show');
    });

    // Set 4 seconds timer
    if ((window as any).premiumAlertTimeout) {
        clearTimeout((window as any).premiumAlertTimeout);
    }
    (window as any).premiumAlertTimeout = setTimeout(() => {
        closePremiumAlert();
    }, 4000);
}

export function closePremiumAlert() {
    if ((window as any).premiumAlertTimeout) {
        clearTimeout((window as any).premiumAlertTimeout);
        (window as any).premiumAlertTimeout = null;
    }
    const overlay = document.getElementById('fi-alert-overlay');
    if (overlay) {
        overlay.classList.remove('show');
        setTimeout(() => {
            overlay.style.visibility = 'hidden';
        }, 300);
    }
}

(window as any).DisplayModal = function (msg: string, title: string, p3?: any, p4?: any) {
    let typeCode = (typeof p4 !== 'undefined') ? p4 : (typeof p3 === 'number' ? p3 : null);
    let type: 'info' | 'success' | 'error' | 'warning' = 'info';
    if (typeCode === 4 || typeCode === 0 || title === "خطا" || title === "Error") type = 'error';
    else if (typeCode === 1 || title === "موفق") type = 'success';
    else if (typeCode === 2 || title === "هشدار") type = 'warning';

    // Auto-detect based on msg if still info
    if (type === 'info') {
        if (msg.includes('موفق')) type = 'success';
        else if (msg.includes('خطا') || msg.includes('اشتباه')) type = 'error';
    }

    showPremiumAlert(msg, title || 'پیام سیستم', type);
};
(window as any).display_alarm2 = (window as any).DisplayModal;

const originalAlert = window.alert;
window.alert = function (msg: string) {
    if (msg === '1' || msg === '2' || msg === '3' || msg === '4') return;

    let type: 'info' | 'success' | 'error' | 'warning' = 'info';
    let title = 'پیام سیستم';

    if (msg.includes('موفق') || msg.includes('ثبت‌نام با موفقیت')) {
        type = 'success';
        title = 'موفق';
    } else if (msg.includes('خطا') || msg.includes('اشتباه') || msg.includes('نامعتبر') || msg.includes('وجود ندارد')) {
        type = 'error';
        title = 'خطا';
    } else if (msg.includes('هشدار')) {
        type = 'warning';
        title = 'هشدار';
    }

    showPremiumAlert(msg, title, type);
};
