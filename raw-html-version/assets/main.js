// =====================================================
// STATIC ROUTING LAYER
// Maps React Router paths → static .html files
// =====================================================
(function () {
    const ROUTE_MAP = {
        '/': './index.html',
        '/dashboard': './dashboard.html',
        '/profile-hub': './profile-hub.html',
        '/financial-hub': './financial-hub.html',
        '/specialized-hub': './specialized-hub.html',
        '/registration': './registration.html',
        '/store': './store.html',
        '/gallery': './gallery.html',
        '/training-backpack': './training-backpack.html',
        '/financial-timeline': './financial-timeline.html',
        '/verification': './verification.html',
        '/registration-history': './registration-history.html',
        '/personal-info': './personal-info.html',
        '/contact-info': './contact-info.html',
        '/passport-info': './passport-info.html',
        '/bank-info': './bank-info.html',
        '/sports-info': './sports-info.html',
        '/club-info': './club-info.html',
        '/clothing-info': './clothing-info.html',
        '/documents': './documents.html',
        '/password': './password.html',
        '/attendance': './attendance.html',
        '/talent': './talent.html',
        '/insurance': './insurance.html',
        '/insurance-status': './insurance-status.html',
        '/certificate': './certificate.html',
        '/bulletin': './bulletin.html',
    };

    // Back-button destinations per page (derived from React source navigate() calls)
    const BACK_MAP = {
        'dashboard': './index.html',
        'profile-hub': './dashboard.html',
        'financial-hub': './dashboard.html',
        'specialized-hub': './dashboard.html',
        'registration': './dashboard.html',
        'store': './dashboard.html',
        'gallery': './dashboard.html',
        'training-backpack': './dashboard.html',
        'financial-timeline': './financial-hub.html',
        'verification': './profile-hub.html',
        'registration-history': './specialized-hub.html',
        'personal-info': './profile-hub.html',
        'contact-info': './profile-hub.html',
        'passport-info': './profile-hub.html',
        'bank-info': './financial-hub.html',
        'sports-info': './profile-hub.html',
        'club-info': './specialized-hub.html',
        'clothing-info': './profile-hub.html',
        'documents': './profile-hub.html',
        'password': './profile-hub.html',
        'attendance': './specialized-hub.html',
        'talent': './specialized-hub.html',
        'insurance': './specialized-hub.html',
        'insurance-status': './specialized-hub.html',
        'certificate': './specialized-hub.html',
        'bulletin': './dashboard.html',
    };

    function resolveRoute(path) {
        return ROUTE_MAP[path] || null;
    }

    function getCurrentPage() {
        const parts = window.location.pathname.split('/');
        const file = parts[parts.length - 1].replace('.html', '');
        return file || 'index';
    }

    function fixLinks() {
        // Fix all <a href="/route"> links
        document.querySelectorAll('a[href]').forEach(a => {
            const href = a.getAttribute('href');
            if (href && href.startsWith('/') && !href.startsWith('//') && !href.startsWith('/assets')) {
                const mapped = resolveRoute(href);
                if (mapped) a.setAttribute('href', mapped);
            }
        });

        // Fix back buttons
        const page = getCurrentPage();
        const backDest = BACK_MAP[page];
        document.querySelectorAll('.btn-back-top').forEach(btn => {
            btn.addEventListener('click', () => {
                if (backDest) window.location.href = backDest;
                else history.back();
            });
        });

        // Fix clickable divs: frame-item, spec-item, hub-btn, dash-action-card, stat-card, news-card, registration-card
        // These are identified by their text label (فارسی)
        const TEXT_ROUTE_MAP = {
            // ProfileHub frame-items
            'اطلاعات شخصی': './personal-info.html',
            'اطلاعات تماس': './contact-info.html',
            'گذرنامه': './passport-info.html',
            'مشخصات ورزشی': './sports-info.html',
            'اطلاعات باشگاهی': './club-info.html',
            'اطلاعات پوشاک': './clothing-info.html',
            'کارت ملی': './documents.html',
            'شناسنامه': './documents.html',
            'مجوز ورزشی': './documents.html',
            'مدارک و سایر': './documents.html',
            'تغییر رمز عبور': './password.html',
            // SpecializedHub spec-items (text from spec-title divs)
            'گزارش حضور': './attendance.html',
            'حضور و غیاب': './attendance.html',
            'تاریخچه\nثبت‌نام': './registration-history.html',
            'سوابق ثبت‌نام': './registration-history.html',
            'استعداد': './talent.html',
            'وضعیت\nبیمه': './insurance-status.html',
            'بیمه ورزشی': './insurance-status.html',
            'گواهی\nپایان': './certificate.html',
            'گواهینامه': './certificate.html',
            'گواهی': './certificate.html',
            // FinancialHub hub-btns
            'تاریخچه مالی': './financial-timeline.html',
            'تایم‌لاین مالی': './financial-timeline.html',
            'تایم لاین مالی': './financial-timeline.html',
            'پرداخت آنلاین': './bank-info.html',
            'حساب بانکی': './bank-info.html',
            'اطلاعات بانکی': './bank-info.html',
            // SpecializedHub spec-items with partial text match
            'تاریخچه': './registration-history.html',
        };


        const clickableSelectors = [
            '.frame-item', '.spec-item', '.hub-btn',
            '.dash-action-card', '.stat-card', '.news-card',
            '.registration-card', '.club-list-item'
        ];

        clickableSelectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                const text = (el.textContent || '').trim();
                let dest = null;

                // Check text-based routing first
                for (const [label, url] of Object.entries(TEXT_ROUTE_MAP)) {
                    if (text.includes(label)) { dest = url; break; }
                }

                // Class-based routing for dash-action-cards
                if (!dest && sel === '.dash-action-card') {
                    if (el.classList.contains('card-store')) dest = './store.html';
                    else if (el.classList.contains('card-gallery')) dest = './gallery.html';
                    else if (el.classList.contains('card-backpack')) dest = './training-backpack.html';
                }
                // news-card → bulletin
                if (!dest && sel === '.news-card') dest = './bulletin.html';
                // registration-card → registration
                if (!dest && sel === '.registration-card') dest = './registration.html';

                if (dest) {
                    el.style.cursor = 'pointer';
                    el.addEventListener('click', () => { window.location.href = dest; });
                }
            });
        });


        // Fix buttons with navigate() equivalents identified by text/class
        // "تکمیل هویت" → verification
        document.querySelectorAll('.btn-verify-action').forEach(btn => {
            if (btn.textContent.includes('تکمیل هویت')) {
                btn.addEventListener('click', () => { window.location.href = './verification.html'; });
            }
        });

        // "بازگشت به پروفایل"
        document.querySelectorAll('.btn-app-primary').forEach(btn => {
            if (btn.textContent.includes('بازگشت به پروفایل')) {
                btn.addEventListener('click', () => { window.location.href = './profile-hub.html'; });
            }
        });

        // "تکمیل اطلاعات" (btn-mini)
        document.querySelectorAll('.btn-mini').forEach(btn => {
            if (btn.textContent.includes('تکمیل اطلاعات')) {
                btn.addEventListener('click', (e) => { e.stopPropagation(); window.location.href = './profile-hub.html'; });
            }
        });

        // "مشاهده" attendance btn (in charts/grades section of specialized-hub)
        document.querySelectorAll('.btn-primary, button').forEach(btn => {
            const t = (btn.textContent || '').trim();
            if (t === 'مشاهده') {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    window.location.href = './attendance.html';
                });
            }
        });

        // financial-timeline btn (registration page large button)
        document.querySelectorAll('button').forEach(btn => {
            const t = (btn.textContent || '').trim();
            if (t.includes('تاریخچه مالی') || t.includes('سوابق مالی') || t.includes('تایم‌لاین مالی') || t.includes('تایم لاین مالی')) {
                btn.addEventListener('click', () => { window.location.href = './financial-timeline.html'; });
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixLinks);
    } else {
        fixLinks();
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    // Topbar Dropdown Toggle
    const profileToggle = document.querySelector('.header-profile');
    const profileMenu = document.getElementById('profileMenu');
    if (profileToggle && profileMenu) {
        profileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            profileMenu.classList.toggle('show');
        });
        document.addEventListener('click', (e) => {
            if (!profileToggle.contains(e.target)) {
                profileMenu.classList.remove('show');
            }
        });
    }

    // Modal Toggles
    const clubModalBtn = document.querySelector('.beautiful-modal-btn');
    if (clubModalBtn) {
        clubModalBtn.addEventListener('click', () => {
            const modal = document.querySelector('.modal-overlay');
            if (modal) {
                modal.style.display = 'flex';
                // Remove inline onclick just in case
                modal.removeAttribute('onclick');
            }
        });
    }

    // Profile Hub image cropper trigger
    const cameraBtn = document.querySelector('.profile-header-card button');
    if (cameraBtn) {
        cameraBtn.addEventListener('click', () => {
            // just show modal for demo
            const cropperModal = document.querySelector('.modal-overlay');
            if (cropperModal) {
                cropperModal.style.display = 'flex';
            }
        });
    }

    // Close Modals
    document.querySelectorAll('.modal-close-btn, .btn-modal-close-large, .btn-modal-cancel').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal-overlay');
            if (modal) modal.style.display = 'none';
        });
    });

    // Close Modal on clicking outside
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.style.display = 'none';
            }
        });
    });

    // 1. Custom Selects
    document.querySelectorAll('.custom-select-wrapper').forEach(wrapper => {
        const trigger = wrapper.querySelector('.custom-select-trigger');
        const nativeSelect = wrapper.querySelector('select');

        if (!trigger || !nativeSelect) return;

        // Create dropdown
        let dropdown = wrapper.querySelector('.custom-select-dropdown');
        if (!dropdown) {
            dropdown = document.createElement('div');
            dropdown.className = 'custom-select-dropdown';
            dropdown.style.display = 'none';
            wrapper.appendChild(dropdown);
        }

        // Populate options
        Array.from(nativeSelect.options).forEach(opt => {
            if (opt.disabled || opt.hidden) return; // Skip placeholder

            const optionDiv = document.createElement('div');
            optionDiv.className = 'custom-select-option';
            if (nativeSelect.value === opt.value) {
                optionDiv.classList.add('selected');
            }
            optionDiv.textContent = opt.textContent;
            optionDiv.dataset.value = opt.value;

            optionDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                // Update native select
                nativeSelect.value = opt.value;
                // Update trigger text
                trigger.textContent = opt.textContent;
                // Trigger change event just in case
                nativeSelect.dispatchEvent(new Event('change'));

                // Update selected classes
                dropdown.querySelectorAll('.custom-select-option').forEach(el => el.classList.remove('selected'));
                optionDiv.classList.add('selected');

                // Close wrapper
                wrapper.classList.remove('open');
                dropdown.style.display = 'none';
            });

            dropdown.appendChild(optionDiv);
        });

        // Listen for programmatic changes (like from localStorage restoration)
        nativeSelect.addEventListener('change', () => {
            const selectedOpt = Array.from(nativeSelect.options).find(o => o.value === nativeSelect.value);
            if (selectedOpt) {
                trigger.textContent = selectedOpt.textContent;
                dropdown.querySelectorAll('.custom-select-option').forEach(el => {
                    if (el.dataset.value === nativeSelect.value) el.classList.add('selected');
                    else el.classList.remove('selected');
                });
            }
        });

        // Toggle dropdown on trigger click
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            // Close other open selects
            document.querySelectorAll('.custom-select-wrapper.open').forEach(w => {
                if (w !== wrapper) {
                    w.classList.remove('open');
                    const d = w.querySelector('.custom-select-dropdown');
                    if (d) d.style.display = 'none';
                }
            });
            wrapper.classList.toggle('open');
            dropdown.style.display = wrapper.classList.contains('open') ? 'block' : 'none';
        });
    });

    // Close custom selects when clicking outside
    document.addEventListener('click', () => {
        document.querySelectorAll('.custom-select-wrapper.open').forEach(w => {
            w.classList.remove('open');
            const d = w.querySelector('.custom-select-dropdown');
            if (d) d.style.display = 'none';
        });
    });

    // 1.5 Form State Persistence
    const formElements = document.querySelectorAll('input:not([type="password"]):not([type="hidden"]):not([type="file"]), select, textarea');
    formElements.forEach(el => {
        const key = 'form_state_' + (el.name || el.id);
        if (!key || key === 'form_state_') return;

        const savedVal = localStorage.getItem(key);
        if (savedVal !== null) {
            if (el.type === 'checkbox' || el.type === 'radio') {
                el.checked = savedVal === 'true';
            } else {
                el.value = savedVal;
            }
            setTimeout(() => {
                el.dispatchEvent(new Event('change', { bubbles: true }));
                el.dispatchEvent(new Event('input', { bubbles: true }));
            }, 0);
        }

        el.addEventListener('change', () => {
            localStorage.setItem(key, (el.type === 'checkbox' || el.type === 'radio') ? el.checked : el.value);
        });
        el.addEventListener('input', () => {
            if (el.type !== 'checkbox' && el.type !== 'radio') localStorage.setItem(key, el.value);
        });
    });

    document.querySelectorAll('.date-picker-input').forEach((el, index) => {
        const key = 'form_state_dp_' + index;
        const savedVal = localStorage.getItem(key);
        if (savedVal !== null) {
            const span = el.querySelector('span');
            if (span) {
                span.textContent = savedVal;
                span.style.color = 'inherit';
            } else {
                el.textContent = savedVal;
            }
            setTimeout(() => el.dispatchEvent(new Event('change', { bubbles: true })), 0);
        }

        el.addEventListener('change', () => {
            const span = el.querySelector('span');
            const val = span ? span.textContent : el.textContent;
            localStorage.setItem(key, val);
        });
    });

    // 2. Custom Scroll DatePicker
    const PERSIAN_MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
    const pDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const toPersianDigits = (num) => num.toString().replace(/\d/g, x => pDigits[parseInt(x)]);

    const datePickerInputs = document.querySelectorAll('.date-picker-input');
    if (datePickerInputs.length > 0) {
        let currentActiveInput = null;
        let selectedYear = 1403, selectedMonth = 1, selectedDay = 1;

        const dpOverlay = document.createElement('div');
        dpOverlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); z-index: 9999; display: none; flex-direction: column; justify-content: flex-end; align-items: center; opacity: 0; transition: opacity 0.3s ease;';

        const dpModal = document.createElement('div');
        dpModal.style.cssText = 'background: #fff; border-top-left-radius: 28px; border-top-right-radius: 28px; padding: 24px 20px; padding-bottom: max(24px, env(safe-area-inset-bottom)); box-shadow: 0 -10px 40px rgba(0,0,0,0.15); width: 100%; max-width: 400px; transform: translateY(100%); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);';

        dpModal.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <button type="button" id="dp-cancel-btn" style="background: rgba(239, 68, 68, 0.1); border: none; color: var(--danger); font-weight: bold; font-size: 0.95rem; cursor: pointer; padding: 8px 16px; border-radius: 12px;">لغو</button>
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <h4 style="margin: 0; font-size: 1.2rem; font-weight: 800;">انتخاب تاریخ</h4>
                    <button type="button" id="dp-today-btn" style="font-size: 0.8rem; color: var(--primary); background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(0, 0, 0, 0.2); padding: 4px 16px; border-radius: 20px; margin-top: 8px; font-weight: 700; cursor: pointer; outline: none; display: flex; align-items: center; gap: 6px; box-shadow: 0 2px 6px rgba(245, 158, 11, 0.15);">
                        امروز
                    </button>
                </div>
                <button type="button" id="dp-confirm-btn" style="background: var(--primary); border: none; color: #fff; font-weight: bold; font-size: 0.95rem; cursor: pointer; padding: 8px 16px; border-radius: 12px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);">تایید</button>
            </div>
            
            <div style="position: relative; display: flex; flex-direction: column; background: #f8fafc; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0;">
                <div style="display: flex; direction: rtl; padding: 12px 0; border-bottom: 1px solid #e2e8f0; background: #f1f5f9;">
                    <div style="flex: 1; display: flex; justify-content: center; align-items: center; gap: 12px;">
                        <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted);">روز</span>
                    </div>
                    <div style="width: 1px; background: #000; opacity: 0.3;"></div>
                    <div style="flex: 1; display: flex; justify-content: center; align-items: center; gap: 12px;">
                        <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted);">ماه</span>
                    </div>
                    <div style="width: 1px; background: #000; opacity: 0.3;"></div>
                    <div style="flex: 1; display: flex; justify-content: center; align-items: center; gap: 12px;">
                        <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted);">سال</span>
                    </div>
                </div>

                <div style="position: relative; display: flex; direction: rtl;">
                    <div style="position: absolute; top: 88px; left: 10px; right: 10px; height: 44px; background: #fff; border: 2px solid var(--primary); border-radius: 12px; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15); pointer-events: none; z-index: 1;"></div>
                    
                    <div id="dp-col-day" class="dp-scroll-container" style="flex: 1; height: 220px; position: relative; z-index: 2; overflow-y: auto; scroll-snap-type: y mandatory; scroll-behavior: smooth; -ms-overflow-style: none; scrollbar-width: none;"></div>
                    <div style="width: 1px; background: #000; opacity: 0.3; z-index: 2; margin: 10px 0;"></div>
                    <div id="dp-col-month" class="dp-scroll-container" style="flex: 1; height: 220px; position: relative; z-index: 2; overflow-y: auto; scroll-snap-type: y mandatory; scroll-behavior: smooth; -ms-overflow-style: none; scrollbar-width: none;"></div>
                    <div style="width: 1px; background: #000; opacity: 0.3; z-index: 2; margin: 10px 0;"></div>
                    <div id="dp-col-year" class="dp-scroll-container" style="flex: 1; height: 220px; position: relative; z-index: 2; overflow-y: auto; scroll-snap-type: y mandatory; scroll-behavior: smooth; -ms-overflow-style: none; scrollbar-width: none;"></div>
                </div>
            </div>
            <style>
                .dp-scroll-container::-webkit-scrollbar { display: none; }
                .dp-item {
                    height: 44px; display: flex; align-items: center; justify-content: center;
                    scroll-snap-align: center; cursor: pointer; user-select: none;
                    transition: all 0.2s ease;
                }
            </style>
        `;

        dpOverlay.appendChild(dpModal);
        document.body.appendChild(dpOverlay);

        const colDay = document.getElementById('dp-col-day');
        const colMonth = document.getElementById('dp-col-month');
        const colYear = document.getElementById('dp-col-year');

        function renderCol(col, items, selected, isMonth = false) {
            let html = '<div style="height: 88px; scroll-snap-align: center;"></div>';
            items.forEach(val => {
                const label = isMonth ? PERSIAN_MONTHS[val - 1] : toPersianDigits(val);
                const isSel = val === selected;
                const fs = isSel ? (isMonth ? '1.1rem' : '1.3rem') : (isMonth ? '0.9rem' : '1.1rem');
                const fw = isSel ? '800' : '500';
                const colr = isSel ? 'var(--primary)' : 'var(--text-muted)';
                html += `<div class="dp-item" data-val="${val}" style="font-size: ${fs}; font-weight: ${fw}; color: ${colr};">${label}</div>`;
            });
            html += '<div style="height: 88px; scroll-snap-align: center;"></div>';
            col.innerHTML = html;
        }

        function updateUI() {
            let maxDays = 31;
            if (selectedMonth > 6) maxDays = 30;
            if (selectedMonth === 12) maxDays = 29;
            if (selectedDay > maxDays) selectedDay = maxDays;

            const days = Array.from({ length: maxDays }, (_, i) => i + 1);
            const months = Array.from({ length: 12 }, (_, i) => i + 1);
            const years = Array.from({ length: 1450 - 1320 + 1 }, (_, i) => 1450 - i);

            renderCol(colDay, days, selectedDay);
            renderCol(colMonth, months, selectedMonth, true);
            renderCol(colYear, years, selectedYear);

            setTimeout(() => {
                colDay.scrollTop = days.indexOf(selectedDay) * 44;
                colMonth.scrollTop = months.indexOf(selectedMonth) * 44;
                colYear.scrollTop = years.indexOf(selectedYear) * 44;
            }, 10);
        }

        function setupScrollListener(col, type) {
            let timeout;
            col.addEventListener('scroll', () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    const idx = Math.round(col.scrollTop / 44);
                    const items = Array.from(col.querySelectorAll('.dp-item'));
                    if (items[idx]) {
                        const val = parseInt(items[idx].dataset.val);
                        if (type === 'day' && selectedDay !== val) { selectedDay = val; updateUI(); }
                        if (type === 'month' && selectedMonth !== val) { selectedMonth = val; updateUI(); }
                        if (type === 'year' && selectedYear !== val) { selectedYear = val; updateUI(); }
                    }
                }, 100);
            });

            col.addEventListener('click', (e) => {
                const item = e.target.closest('.dp-item');
                if (item) {
                    const val = parseInt(item.dataset.val);
                    if (type === 'day') selectedDay = val;
                    if (type === 'month') selectedMonth = val;
                    if (type === 'year') selectedYear = val;
                    updateUI();
                }
            });
        }

        setupScrollListener(colDay, 'day');
        setupScrollListener(colMonth, 'month');
        setupScrollListener(colYear, 'year');

        function openModal(input) {
            currentActiveInput = input;
            dpOverlay.style.display = 'flex';
            setTimeout(() => {
                dpOverlay.style.opacity = '1';
                dpModal.style.transform = 'translateY(0)';
            }, 10);
            updateUI();
        }

        function closeModal() {
            dpOverlay.style.opacity = '0';
            dpModal.style.transform = 'translateY(100%)';
            setTimeout(() => {
                dpOverlay.style.display = 'none';
            }, 300);
        }

        datePickerInputs.forEach(input => {
            input.addEventListener('click', () => {
                const span = input.querySelector('span');
                const val = span ? span.textContent.trim() : input.textContent.trim();
                const cleanVal = val.replace(/[۰-۹]/g, w => String.fromCharCode(w.charCodeAt(0) - 1728));

                let setDate = false;
                if (cleanVal && cleanVal !== 'انتخاب تاریخ' && cleanVal.includes('/')) {
                    const parts = cleanVal.split('/');
                    if (parts.length === 3) {
                        selectedYear = parseInt(parts[0]);
                        selectedMonth = parseInt(parts[1]);
                        selectedDay = parseInt(parts[2]);
                        setDate = true;
                    }
                }

                if (!setDate) {
                    const faDateParts = new Intl.DateTimeFormat('fa-IR').formatToParts(new Date());
                    selectedYear = parseInt(faDateParts.find(p => p.type === 'year').value.replace(/[۰-۹]/g, w => String.fromCharCode(w.charCodeAt(0) - 1728)));
                    selectedMonth = parseInt(faDateParts.find(p => p.type === 'month').value.replace(/[۰-۹]/g, w => String.fromCharCode(w.charCodeAt(0) - 1728)));
                    selectedDay = parseInt(faDateParts.find(p => p.type === 'day').value.replace(/[۰-۹]/g, w => String.fromCharCode(w.charCodeAt(0) - 1728)));
                }
                openModal(input);
            });
        });

        document.getElementById('dp-cancel-btn').addEventListener('click', closeModal);
        dpOverlay.addEventListener('click', (e) => {
            if (e.target === dpOverlay) closeModal();
        });

        document.getElementById('dp-today-btn').addEventListener('click', () => {
            const faDateParts = new Intl.DateTimeFormat('fa-IR').formatToParts(new Date());
            const pYear = parseInt(faDateParts.find(p => p.type === 'year').value.replace(/[۰-۹]/g, w => String.fromCharCode(w.charCodeAt(0) - 1728)));
            const pMonth = parseInt(faDateParts.find(p => p.type === 'month').value.replace(/[۰-۹]/g, w => String.fromCharCode(w.charCodeAt(0) - 1728)));
            const pDay = parseInt(faDateParts.find(p => p.type === 'day').value.replace(/[۰-۹]/g, w => String.fromCharCode(w.charCodeAt(0) - 1728)));

            selectedYear = pYear; selectedMonth = pMonth; selectedDay = pDay;
            updateUI();
        });

        document.getElementById('dp-confirm-btn').addEventListener('click', () => {
            if (currentActiveInput) {
                const m = selectedMonth.toString().padStart(2, '0');
                const d = selectedDay.toString().padStart(2, '0');
                const pDate = `${selectedYear}/${m}/${d}`.replace(/[0-9]/g, w => pDigits[w]);

                const span = currentActiveInput.querySelector('span');
                if (span) {
                    span.textContent = pDate;
                    span.style.color = 'inherit';
                } else {
                    currentActiveInput.value = pDate;
                    currentActiveInput.textContent = pDate;
                }
                currentActiveInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
            closeModal();
        });
    }


    // 4. Image Upload / Cropper Mock
    document.querySelectorAll('.upload-area, .profile-header-card button, button i.fa-camera').forEach(el => {
        const trigger = el.tagName === 'BUTTON' ? el : el.closest('button') || el;
        if (!trigger || trigger.classList.contains('cropper-handled')) return;
        trigger.classList.add('cropper-handled');

        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            let fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';

            fileInput.addEventListener('change', () => {
                if (fileInput.files && fileInput.files.length > 0) {
                    alert('عکس انتخاب شد: ' + fileInput.files[0].name);
                    if (trigger.classList.contains('upload-area')) {
                        const icon = trigger.querySelector('i');
                        const p = trigger.querySelector('p');
                        if (icon) { icon.className = 'fa fa-check-circle text-success'; }
                        if (p) { p.textContent = 'آپلود شد'; p.style.color = 'var(--success)'; }
                        trigger.style.borderColor = 'var(--success)';
                        trigger.style.backgroundColor = '#f0fdf4';
                    }
                }
            });

            document.body.appendChild(fileInput);
            fileInput.click();
            setTimeout(() => document.body.removeChild(fileInput), 1000);
        });
    });

    // 5. Financial Hub Blocks & Chart
    const debtCards = document.querySelectorAll('.school-debt-card');
    debtCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.btn-credit')) return;
            const amountSpan = card.querySelector('.amount');
            const icon = card.querySelector('.debt-icon i');
            if (card.classList.contains('status-clear')) {
                card.classList.remove('status-clear');
                card.classList.add('status-due');
                if (amountSpan) amountSpan.textContent = '۱.۵M بدهی';
                if (icon) {
                    icon.classList.remove('fa-check');
                    icon.classList.add('fa-exclamation-triangle');
                }
            } else {
                card.classList.remove('status-due');
                card.classList.add('status-clear');
                if (amountSpan) amountSpan.textContent = 'بدون بدهی';
                if (icon) {
                    icon.classList.remove('fa-exclamation-triangle');
                    icon.classList.add('fa-check');
                }
            }
        });
    });

    document.querySelectorAll('.hub-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const text = btn.textContent.trim();
            if (text.includes('حساب‌های بانکی')) window.location.href = 'bank-info.html';
            if (text.includes('پرداخت شهریه')) alert('انتقال به درگاه پرداخت (دمو)');
            if (text.includes('گزارشات و تایم‌لاین مالی')) window.location.href = 'financial-timeline.html';
        });
    });


    // 5.5 Global Input Validation (Prevent invalid characters in real-time)
    document.addEventListener('input', (e) => {
        const target = e.target;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') return;

        const name = target.name || '';
        const type = target.type || '';
        const inputMode = target.getAttribute('inputmode');
        const isNumericMode = inputMode === 'numeric';

        // Exclude specific fields where letters and numbers can mix
        if (name === 'passportNumber' || type === 'email' || type === 'password' || name.toLowerCase().includes('password')) return;

        // Fields that MUST NOT contain numbers
        const strictStringFields = [
            'firstName', 'lastName', 'fatherName', 'englishName', 'englishSurname',
            'bankName', 'accountName', 'occupation', 'religion', 'sect'
        ];

        // Fields that MUST NOT contain letters (only digits)
        const strictNumericFields = [
            'nationalId', 'birthCertificateNo', 'height', 'weight', 'mobile',
            'guardianMobile', 'tel', 'emergencyPhone', 'postalCode', 'cardNumber', 'sheba'
        ];

        // Ensure real-time character stripping
        if (strictStringFields.includes(name)) {
            // Remove any Persian/English digits
            target.value = target.value.replace(/[0-9۰-۹]/g, '');
        } else if (strictNumericFields.includes(name) || isNumericMode) {
            // Remove any non-digits
            target.value = target.value.replace(/[^0-9۰-۹]/g, '');
        }

        // Real-time custom validations
        if (name === 'nationalId' || name === 'birthCertificateNo') {
            const group = target.closest('.input-group');
            if (!group) return;
            const label = group.querySelector('label');
            target.classList.remove('error', 'success');
            if (label) label.classList.remove('error-label');
            const existingErr = group.querySelector('.error-text');
            if (existingErr) existingErr.remove();

            const cleanVal = target.value.replace(/[۰-۹]/g, w => String.fromCharCode(w.charCodeAt(0) - 1728));
            if (cleanVal.length === 0) return; // Don't show error if empty

            let hasError = false;
            let errorMsg = '';

            const fieldTitle = name === 'nationalId' ? 'کد ملی' : 'شماره شناسنامه';

            if (cleanVal.length < 10) {
                hasError = true;
                errorMsg = `${fieldTitle} باید ۱۰ رقم باشد`;
            } else if (name === 'nationalId' && cleanVal.length === 10) {
                const isValidIranianNationalId = (val) => {
                    if (!/^\d{10}$/.test(val)) return false;
                    const check = parseInt(val[9]);
                    let sum = 0;
                    for (let i = 0; i < 9; i++) sum += parseInt(val[i]) * (10 - i);
                    const remainder = sum % 11;
                    return (remainder < 2 && check === remainder) || (remainder >= 2 && check === 11 - remainder);
                };
                if (!isValidIranianNationalId(cleanVal)) {
                    hasError = true;
                    errorMsg = 'کد ملی نامعتبر است';
                }
            } else if (name === 'birthCertificateNo' && cleanVal.length === 10) {
                if (parseInt(cleanVal) === 0) {
                    hasError = true;
                    errorMsg = 'شماره شناسنامه نامعتبر است (نمی‌تواند صفر باشد)';
                }
            }

            if (hasError) {
                target.classList.add('error');
                if (label) label.classList.add('error-label');
                const errSpan = document.createElement('span');
                errSpan.className = 'error-text';
                errSpan.style = 'color: var(--danger); font-size: 0.75rem; margin-top: 4px; display: block;';
                errSpan.textContent = errorMsg;
                group.appendChild(errSpan);
            }
        }
    });

    // Global change event for real-time validation of dates
    document.addEventListener('change', (e) => {
        const target = e.target;
        if (target.classList && target.classList.contains('date-picker-input')) {
            const group = target.closest('.input-group');
            if (!group) return;
            const label = group.querySelector('label');
            if (!label) return;

            const labelText = label.textContent.trim();
            if (labelText.includes('تاریخ تولد') || labelText.includes('تاریخ صدور')) {
                target.classList.remove('error', 'success');
                label.classList.remove('error-label');
                const existingErr = group.querySelector('.error-text');
                if (existingErr) existingErr.remove();

                const span = target.querySelector('span');
                const val = span ? span.textContent.trim() : target.textContent.trim();
                const cleanVal = val.replace(/[۰-۹]/g, w => String.fromCharCode(w.charCodeAt(0) - 1728));

                if (cleanVal !== 'انتخاب تاریخ' && cleanVal !== '') {
                    const faDateParts = new Intl.DateTimeFormat('fa-IR').formatToParts(new Date());
                    const pYear = parseInt(faDateParts.find(p => p.type === 'year').value.replace(/[۰-۹]/g, w => String.fromCharCode(w.charCodeAt(0) - 1728)));
                    const pMonth = parseInt(faDateParts.find(p => p.type === 'month').value.replace(/[۰-۹]/g, w => String.fromCharCode(w.charCodeAt(0) - 1728)));
                    const pDay = parseInt(faDateParts.find(p => p.type === 'day').value.replace(/[۰-۹]/g, w => String.fromCharCode(w.charCodeAt(0) - 1728)));

                    const [vy, vm, vd] = cleanVal.split('/').map(n => parseInt(n));
                    let isFuture = false;
                    if (vy > pYear) isFuture = true;
                    if (vy === pYear && vm > pMonth) isFuture = true;
                    if (vy === pYear && vm === pMonth && vd > pDay) isFuture = true;

                    if (isFuture) {
                        target.classList.add('error');
                        label.classList.add('error-label');
                        const errSpan = document.createElement('span');
                        errSpan.className = 'error-text';
                        errSpan.style = 'color: var(--danger); font-size: 0.75rem; margin-top: 4px; display: block;';
                        errSpan.textContent = 'این تاریخ نمی‌تواند در آینده باشد';
                        group.appendChild(errSpan);
                    }
                }
            }
        }
    });

    // 6. Validations
    document.querySelectorAll('form').forEach(form => {
        const submitBtn = form.querySelector('button[type="submit"]') || document.querySelector('.btn-submit-top');
        if (!submitBtn) return;

        // Complex validations
        const isValidIranianNationalId = (val) => {
            if (!/^\d{10}$/.test(val)) return false;
            const check = parseInt(val[9]);
            let sum = 0;
            for (let i = 0; i < 9; i++) sum += parseInt(val[i]) * (10 - i);
            const remainder = sum % 11;
            return (remainder < 2 && check === remainder) || (remainder >= 2 && check === 11 - remainder);
        };
        const isValidIranianBankCard = (val) => {
            if (!/^\d{16}$/.test(val)) return false;
            let sum = 0;
            for (let i = 0; i < 16; i++) {
                let digit = parseInt(val[i]);
                if (i % 2 === 0) { digit *= 2; if (digit > 9) digit -= 9; }
                sum += digit;
            }
            return sum % 10 === 0;
        };
        const isValidSheba = (val) => {
            if (!/^\d{24}$/.test(val)) return false;
            const rearranged = val + "182700";
            let remainder = 0;
            for (let i = 0; i < rearranged.length; i++) remainder = (remainder * 10 + parseInt(rearranged[i])) % 97;
            return remainder === 1;
        };

        const rules = {
            firstName: { required: 'نام الزامی است', regex: /^[\u0600-\u06FF\s]+$/, msg: 'نام باید حروف فارسی باشد' },
            lastName: { required: 'نام خانوادگی الزامی است', regex: /^[\u0600-\u06FF\s]+$/, msg: 'نام خانوادگی باید حروف فارسی باشد' },
            fatherName: { regex: /^[\u0600-\u06FF\s]*$/, msg: 'نام پدر باید حروف فارسی باشد' },
            englishName: { required: 'نام انگلیسی الزامی است', regex: /^[A-Za-z\s]+$/, msg: 'باید حروف انگلیسی باشد' },
            englishSurname: { required: 'نام خانوادگی انگلیسی الزامی است', regex: /^[A-Za-z\s]+$/, msg: 'باید حروف انگلیسی باشد' },
            nationalId: { required: 'کد ملی الزامی است', customCheck: isValidIranianNationalId, msg: 'کد ملی نامعتبر است' },
            birthCertificateNo: {
                required: 'شماره شناسنامه الزامی است',
                regex: /^[0-9]{10}$/,
                msg: (val) => {
                    if (val.length < 10) return 'شماره شناسنامه باید ۱۰ رقم باشد';
                    return 'شماره شناسنامه نامعتبر است';
                }
            },
            mobile: {
                required: 'شماره موبایل الزامی است',
                regex: /^09[0-9]{9}$/,
                msg: (val) => {
                    if (val.length >= 2 && !val.startsWith('09')) return 'شماره موبایل باید با 09 شروع شود';
                    if (val.length === 1 && val !== '0') return 'شماره موبایل باید با 09 شروع شود';
                    if (val.length < 11) return 'شماره موبایل باید ۱۱ رقم باشد';
                }
            },
            guardianMobile: {
                regex: /^09[0-9]{9}$/,
                msg: (val) => {
                    if (val.length >= 2 && !val.startsWith('09')) return 'شماره ولی باید با 09 شروع شود';
                    if (val.length === 1 && val !== '0') return 'شماره ولی باید با 09 شروع شود';
                    if (val.length < 11) return 'شماره ولی باید ۱۱ رقم باشد';
                }
            },
            tel: {
                regex: /^0[1-9][0-9]{9}$/,
                msg: (val) => {
                    if (val.startsWith('09')) return '09 برای تلفن ثابت مجاز نیست';
                    if (val.length >= 1 && val[0] !== '0') return 'تلفن ثابت باید با 0 شروع شود';
                    if (val.length < 11) return 'تلفن ثابت باید ۱۱ رقم باشد';
                }
            },
            emergencyPhone: {
                required: 'شماره اضطراری الزامی است',
                regex: /^0[0-9]{10}$/,
                msg: (val) => {
                    if (val.length >= 1 && val[0] !== '0') return 'شماره اضطراری باید با 0 شروع شود';
                    if (val.length < 11) return 'شماره اضطراری باید ۱۱ رقم باشد';
                }
            },
            email: { regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, msg: 'ایمیل معتبر نیست' },
            website: { regex: /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/, msg: 'آدرس سایت معتبر نیست' },
            postalCode: {
                regex: /^[0-9]{10}$/,
                msg: (val) => {
                    if (val.length < 10) return 'کد پستی باید ۱۰ رقم باشد';
                }
            },
            address: { required: 'آدرس الزامی است' },
            bankName: { required: 'نام بانک الزامی است', regex: /^[\u0600-\u06FF\s]+$/, msg: 'باید حروف فارسی باشد' },
            accountName: { required: 'نام صاحب حساب الزامی است', regex: /^[\u0600-\u06FF\s]+$/, msg: 'باید حروف فارسی باشد' },
            cardNumber: { required: 'شماره کارت الزامی است', customCheck: isValidIranianBankCard, msg: 'شماره کارت نامعتبر است' },
            sheba: { required: 'شماره شبا الزامی است', customCheck: isValidSheba, msg: 'شماره شبا نامعتبر است' },
            passportNumber: { required: 'شماره پاسپورت الزامی است', regex: /^[A-Za-z0-9]{9}$/, msg: 'شماره پاسپورت نامعتبر است' },
            issueDate: {
                required: 'تاریخ صدور الزامی است',
                customCheck: (val) => {
                    const faDateParts = new Intl.DateTimeFormat('fa-IR').formatToParts(new Date());
                    const pYear = parseInt(faDateParts.find(p => p.type === 'year').value.replace(/[۰-۹]/g, w => String.fromCharCode(w.charCodeAt(0) - 1728)));
                    const pMonth = parseInt(faDateParts.find(p => p.type === 'month').value.replace(/[۰-۹]/g, w => String.fromCharCode(w.charCodeAt(0) - 1728)));
                    const pDay = parseInt(faDateParts.find(p => p.type === 'day').value.replace(/[۰-۹]/g, w => String.fromCharCode(w.charCodeAt(0) - 1728)));
                    const [vy, vm, vd] = val.split('/').map(n => parseInt(n));
                    if (vy > pYear) return false;
                    if (vy === pYear && vm > pMonth) return false;
                    if (vy === pYear && vm === pMonth && vd > pDay) return false;
                    return true;
                },
                msg: 'تاریخ صدور نمی‌تواند بعد از امروز باشد'
            },
            expiryDate: {
                required: 'تاریخ انقضا الزامی است',
                customCheck: (val) => {
                    const faDateParts = new Intl.DateTimeFormat('fa-IR').formatToParts(new Date());
                    const pYear = parseInt(faDateParts.find(p => p.type === 'year').value.replace(/[۰-۹]/g, w => String.fromCharCode(w.charCodeAt(0) - 1728)));
                    const pMonth = parseInt(faDateParts.find(p => p.type === 'month').value.replace(/[۰-۹]/g, w => String.fromCharCode(w.charCodeAt(0) - 1728)));
                    const pDay = parseInt(faDateParts.find(p => p.type === 'day').value.replace(/[۰-۹]/g, w => String.fromCharCode(w.charCodeAt(0) - 1728)));
                    const [vy, vm, vd] = val.split('/').map(n => parseInt(n));
                    if (vy < pYear) return false;
                    if (vy === pYear && vm < pMonth) return false;
                    if (vy === pYear && vm === pMonth && vd < pDay) return false;
                    return true;
                },
                msg: 'تاریخ انقضا نمی‌تواند قبل از امروز باشد'
            },
            birthDate: {
                required: 'تاریخ تولد الزامی است',
                customCheck: (val) => {
                    const faDateParts = new Intl.DateTimeFormat('fa-IR').formatToParts(new Date());
                    const pYear = parseInt(faDateParts.find(p => p.type === 'year').value.replace(/[۰-۹]/g, w => String.fromCharCode(w.charCodeAt(0) - 1728)));
                    const pMonth = parseInt(faDateParts.find(p => p.type === 'month').value.replace(/[۰-۹]/g, w => String.fromCharCode(w.charCodeAt(0) - 1728)));
                    const pDay = parseInt(faDateParts.find(p => p.type === 'day').value.replace(/[۰-۹]/g, w => String.fromCharCode(w.charCodeAt(0) - 1728)));

                    const [vy, vm, vd] = val.split('/').map(n => parseInt(n));
                    if (vy > pYear) return false;
                    if (vy === pYear && vm > pMonth) return false;
                    if (vy === pYear && vm === pMonth && vd > pDay) return false;
                    return true;
                },
                msg: 'تاریخ تولد نمیتواند در آینده باشد'
            },
            gender: { required: 'جنسیت الزامی است' },
            religion: { required: 'دین الزامی است' },
            sportsInsuranceNumber: { required: 'شماره بیمه ورزشی الزامی است', regex: /^[0-9]+$/, msg: 'شماره بیمه باید فقط شامل اعداد باشد' },
            footballShoeSize: {
                regex: /^[0-9]{2}$/,
                msg: (val) => {
                    if (val.length < 2) return 'سایز کفش باید ۲ رقم باشد';
                }
            },
            slipperSize: {
                regex: /^[0-9]{2}$/,
                msg: (val) => {
                    if (val.length < 2) return 'سایز کفش باید ۲ رقم باشد';
                }
            },
            playingAbility: { regex: /^[^0-9۰-۹]*$/, msg: 'توانایی بازی نباید شامل عدد باشد' }
        };

        const validateField = (inp, rule) => {
            let targetInput = inp;
            if (inp.tagName === 'SELECT') {
                targetInput = inp.closest('.custom-select-wrapper')?.querySelector('.custom-select-trigger') || inp;
            }
            targetInput.classList.remove('error', 'success');
            const group = targetInput.closest('.input-group');
            if (group) {
                const label = group.querySelector('label');
                if (label) label.classList.remove('error-label');
                const existingErr = group.querySelector('.error-text');
                if (existingErr) existingErr.remove();
            }

            let val = '';
            if (inp.tagName === 'SELECT') val = inp.value;
            else if (inp.tagName === 'INPUT' || inp.tagName === 'TEXTAREA') val = inp.value.trim();
            else if (inp.classList.contains('date-picker-input')) {
                const span = inp.querySelector('span');
                val = span ? span.textContent.trim() : inp.textContent.trim();
            }

            const cleanVal = val.replace(/[۰-۹]/g, w => String.fromCharCode(w.charCodeAt(0) - 1728));
            const isPlaceholder = val === 'انتخاب تاریخ' || val === '' || val === null || val === 'انتخاب کنید...';

            let hasError = false;
            let errorMsg = '';

            if (rule.required && isPlaceholder) {
                hasError = true;
                errorMsg = rule.required;
            } else if (!isPlaceholder && cleanVal) {
                if (rule.customCheck && !rule.customCheck(cleanVal)) {
                    errorMsg = typeof rule.msg === 'function' ? rule.msg(cleanVal) : rule.msg;
                    if (errorMsg) hasError = true;
                } else if (rule.regex && !rule.regex.test(cleanVal)) {
                    errorMsg = typeof rule.msg === 'function' ? rule.msg(cleanVal) : rule.msg;
                    if (errorMsg) hasError = true;
                } else if (rule.length && cleanVal.length !== rule.length) {
                    errorMsg = rule.msg;
                    if (errorMsg) hasError = true;
                }
            }

            if (hasError) {
                targetInput.classList.add('error');
                if (group) {
                    const label = group.querySelector('label');
                    if (label) label.classList.add('error-label');

                    const errSpan = document.createElement('span');
                    errSpan.className = 'error-text';
                    errSpan.style.color = 'var(--danger)';
                    errSpan.style.fontSize = '0.8rem';
                    errSpan.style.marginTop = '4px';
                    errSpan.innerHTML = `<i class="fa fa-exclamation-triangle"></i> ${errorMsg}`;
                    group.appendChild(errSpan);
                }
                return false;
            } else if (!isPlaceholder && cleanVal) {
                targetInput.classList.add('success');
            }
            return true;
        };

        for (const [name, rule] of Object.entries(rules)) {
            form.querySelectorAll(`[name="${name}"], [id="${name}"]`).forEach(inp => {
                inp.addEventListener('blur', () => validateField(inp, rule));
                inp.addEventListener('change', () => validateField(inp, rule));
                inp.addEventListener('input', () => validateField(inp, rule));
            });
        }

        const enforceNumericLength = (e, len) => {
            const pDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
            let val = e.target.value.replace(/[۰-۹]/g, w => pDigits.indexOf(w).toString());
            val = val.replace(/[^0-9]/g, '');
            if (val.length > len) val = val.slice(0, len);
            e.target.value = val;
        };



        form.querySelectorAll('input[name="nationalId"], input[name="birthCertificateNo"], input[name="postalCode"]').forEach(inp => {
            inp.addEventListener('input', (e) => enforceNumericLength(e, 10));
        });

        form.querySelectorAll('input[name="mobile"], input[name="guardianMobile"], input[name="tel"], input[name="emergencyPhone"]').forEach(inp => {
            inp.addEventListener('input', (e) => enforceNumericLength(e, 11));
        });

        form.querySelectorAll('input[name="sportsInsuranceNumber"]').forEach(inp => {
            inp.addEventListener('input', (e) => enforceNumericLength(e, 20));
        });

        form.querySelectorAll('input[name="footballShoeSize"], input[name="slipperSize"]').forEach(inp => {
            inp.addEventListener('input', (e) => enforceNumericLength(e, 2));
        });

        submitBtn.addEventListener('click', (e) => {
            let isValid = true;

            for (const [name, rule] of Object.entries(rules)) {
                form.querySelectorAll(`[name="${name}"], [id="${name}"]`).forEach(inp => {
                    const fieldValid = validateField(inp, rule);
                    if (!fieldValid) isValid = false;
                });
            }

            if (!isValid) {
                e.preventDefault();
                const firstError = form.querySelector('.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else {
                e.preventDefault();
                const originalHtml = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> در حال ثبت...';
                setTimeout(() => {
                    submitBtn.innerHTML = originalHtml;
                    alert('اطلاعات با موفقیت ذخیره شد! (دمو)');
                }, 1000);
            }
        });
    });
});

// --- Map Modal Logic (Neshan API) ---
window.mapInstance = null;
window.mapMarker = null;
window.selectedMapAddress = '';
window.mapAddressTarget = null;
const NESHAN_API_KEY = 'service.ec711af1d62c4f72b2d0b33a31a65cc1';

function setMapLoading(isLoading) {
    const addrText = document.getElementById('mapAddressText');
    const confirmBtn = document.querySelector('#mapModal .btn-app-primary');
    if (isLoading) {
        if (addrText) addrText.innerHTML = '<span style="color:var(--text-muted);"><i class="fa fa-spinner fa-spin"></i> در حال دریافت آدرس...</span>';
        if (confirmBtn) {
            confirmBtn.disabled = true;
            confirmBtn.style.opacity = '0.6';
        }
    } else {
        if (addrText) {
            if (window.selectedMapAddress && !window.selectedMapAddress.includes('خطا')) {
                addrText.innerHTML = `<span style="font-weight:bold; color:var(--text-dark);">${window.selectedMapAddress}</span>`;
                if (confirmBtn) {
                    confirmBtn.disabled = false;
                    confirmBtn.style.opacity = '1';
                }
            } else {
                addrText.innerHTML = `<span style="color:var(--danger);">${window.selectedMapAddress || 'آدرس یافت نشد'}</span>`;
                if (confirmBtn) {
                    confirmBtn.disabled = true;
                    confirmBtn.style.opacity = '0.6';
                }
            }
        }
    }
}

window.fetchMapAddress = async (lat, lng) => {
    setMapLoading(true);

    const parseOSMAddress = (osmData) => {
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

    try {
        const response = await fetch(`https://api.neshan.org/v5/reverse?lat=${lat}&lng=${lng}`, {
            headers: { 'Api-Key': NESHAN_API_KEY }
        });
        const data = await response.json();

        if (data && data.status === 'ERROR') {
            console.warn("Neshan API failed, falling back to OSM Nominatim. Error:", data.message);
            const osmResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fa`);
            const osmData = await osmResponse.json();
            window.selectedMapAddress = parseOSMAddress(osmData) || `خطای کلید API نشان: ${data.message}`;
        } else if (data) {
            window.selectedMapAddress = data.formatted_address || data.route_name || data.neighbourhood || data.city || data.state || "آدرس یافت نشد";
        }
    } catch (e) {
        // Network error (CORS block etc). Fallback to OSM
        try {
            const osmResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fa`);
            const osmData = await osmResponse.json();
            window.selectedMapAddress = parseOSMAddress(osmData) || 'آدرس یافت نشد';
        } catch (fallbackError) {
            window.selectedMapAddress = 'خطای ارتباط با سرور نقشه';
        }
    } finally {
        setMapLoading(false);
    }
};

window.searchMap = async () => {
    const input = document.getElementById('mapSearchInput');
    if (!input) return;
    const query = input.value.trim();
    if (!query) {
        alert('نام مکان را وارد کنید');
        return;
    }
    setMapLoading(true);
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=ir&accept-language=fa`);
        const data = await response.json();
        if (data.length === 0) {
            alert('مکان پیدا نشد');
            setMapLoading(false);
            return;
        }
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        if (window.mapInstance) {
            window.mapInstance.flyTo([lat, lon], 16);
            if (window.mapMarker) window.mapMarker.setLatLng([lat, lon]);
        }
        await window.fetchMapAddress(lat, lon);
    } catch (e) {
        alert('خطا در جستجو');
        setMapLoading(false);
    }
};

window.closeMapModal = () => {
    const modal = document.getElementById('mapModal');
    if (modal) modal.style.display = 'none';
};

window.confirmMapSelection = () => {
    if (window.mapAddressTarget && window.selectedMapAddress && !window.selectedMapAddress.includes('خطا')) {
        window.mapAddressTarget.value = window.selectedMapAddress;
        window.mapAddressTarget.dispatchEvent(new Event('input', { bubbles: true }));
        window.mapAddressTarget.dispatchEvent(new Event('change', { bubbles: true }));
    }
    window.closeMapModal();
};

window.openMapModal = (textareaTarget) => {
    window.mapAddressTarget = textareaTarget;
    const modal = document.getElementById('mapModal');
    if (!modal) {
        alert('ماژول نقشه در این صفحه یافت نشد.');
        return;
    }
    modal.style.display = 'flex';

    if (typeof L === 'undefined') {
        alert('کتابخانه نقشه بارگذاری نشده است.');
        return;
    }

    if (!window.mapInstance) {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: './assets/images/marker-icon-2x.png',
            iconUrl: './assets/images/marker-icon.png',
            shadowUrl: './assets/images/marker-shadow.png',
        });

        const defaultCenter = [32.6546, 51.6680];
        window.mapInstance = L.map('map').setView(defaultCenter, 16);

        L.tileLayer('https://raster.snappmaps.ir/styles/snapp-style/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© <a href="https://snapp.ir">Snapp Maps</a> | Neshan API'
        }).addTo(window.mapInstance);

        window.mapMarker = L.marker(defaultCenter, { draggable: true }).addTo(window.mapInstance);

        window.mapMarker.on('dragend', (e) => {
            const pos = e.target.getLatLng();
            window.fetchMapAddress(pos.lat, pos.lng);
        });

        window.mapInstance.on('click', (e) => {
            window.mapMarker.setLatLng(e.latlng);
            window.fetchMapAddress(e.latlng.lat, e.latlng.lng);
        });

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    window.mapInstance.setView([lat, lng], 16);
                    window.mapMarker.setLatLng([lat, lng]);
                    window.fetchMapAddress(lat, lng);
                },
                (err) => {
                    console.log('Location access denied.', err);
                    window.fetchMapAddress(defaultCenter[0], defaultCenter[1]);
                }
            );
        } else {
            window.fetchMapAddress(defaultCenter[0], defaultCenter[1]);
        }
    }

    setTimeout(() => {
        if (window.mapInstance) window.mapInstance.invalidateSize();
    }, 300);
};

document.addEventListener('DOMContentLoaded', () => {
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(btn => {
        if (btn.textContent.includes('انتخاب از روی نقشه') || (btn.querySelector('i') && btn.querySelector('i').classList.contains('fa-map-marker'))) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const group = btn.closest('.input-group');
                let targetTextarea = null;
                if (group) {
                    targetTextarea = group.querySelector('textarea') || group.querySelector('input[type="text"]');
                }
                window.openMapModal(targetTextarea);
            });
        }
    });
});
// Strict Input Filtering
document.addEventListener('input', (e) => {
    const target = e.target;
    if (!target.name) return;

    const digitFields = ['nationalId', 'birthCertificateNo', 'height', 'weight', 'shoeSize', 'clothingSize', 'shirtNumber', 'mobile', 'guardianMobile', 'tel', 'emergencyPhone', 'postalCode', 'cardNumber', 'sheba'];
    if (digitFields.includes(target.name)) {
        target.value = target.value.replace(/[^0-9]/g, '');
    }

    const persianFields = ['firstName', 'lastName', 'fatherName', 'bankName', 'accountName'];
    if (persianFields.includes(target.name)) {
        target.value = target.value.replace(/[^\u0600-\u06FF\s]/g, '');
    }

    const englishFields = ['englishName', 'englishSurname'];
    if (englishFields.includes(target.name)) {
        target.value = target.value.replace(/[^A-Za-z\s]/g, '');
    }
});

// ----------------------------------------------------
// Cropper & Neshan Map Logic
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // --- Cropper Logic ---
    let cropperInstance = null;
    let currentAvatarImg = null;

    // Create a hidden file input for profile
    let profileInput = document.getElementById('globalProfileUpload');
    if (!profileInput) {
        profileInput = document.createElement('input');
        profileInput.type = 'file';
        profileInput.id = 'globalProfileUpload';
        profileInput.accept = 'image/*';
        profileInput.style.display = 'none';
        document.body.appendChild(profileInput);
    }

    // Bind camera button
    const cameraBtns = document.querySelectorAll('.camera-btn');
    cameraBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentAvatarImg = btn.previousElementSibling; // Usually the .profile-avatar img
            profileInput.click();
        });
    });

    profileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = document.getElementById('cropperImage');
                if (img) {
                    img.src = e.target.result;
                    document.getElementById('imageCropperModal').style.display = 'flex';
                    if (cropperInstance) cropperInstance.destroy();
                    if (typeof Cropper !== 'undefined') {
                        cropperInstance = new Cropper(img, {
                            aspectRatio: 1,
                            viewMode: 1,
                            background: false,
                        });
                    }
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    window.closeCropperModal = () => {
        document.getElementById('imageCropperModal').style.display = 'none';
        if (cropperInstance) {
            cropperInstance.destroy();
            cropperInstance = null;
        }
        profileInput.value = '';
    };

    window.rotateCropper = () => {
        if (cropperInstance) cropperInstance.rotate(90);
    };

    window.applyCrop = () => {
        if (cropperInstance) {
            const canvas = cropperInstance.getCroppedCanvas({ width: 500, height: 500 });
            if (canvas && currentAvatarImg) {
                currentAvatarImg.src = canvas.toDataURL('image/jpeg', 0.8);
            }
        }
        window.closeCropperModal();
    };

    // Passport Upload Fix
    const passportUpload = document.getElementById('passportUpload');
    if (passportUpload) {
        passportUpload.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                const fileLabel = document.querySelector('label:contains("تصویر گذرنامه")');
                if (fileLabel) {
                    fileLabel.innerHTML = '<i class="fa fa-check text-success"></i> فایل انتخاب شد';
                }
            }
        });
    }

    // --- Old Map logic removed because a new dynamic one was added ---

    // Mobile sticky submit button logic
    const btnSubmitTop = document.querySelector('.btn-submit-top');
    if (btnSubmitTop) {
        const createMobileStickyButton = () => {
            if (window.innerWidth <= 768 && !document.querySelector('.sticky-submit-wrapper')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'sticky-submit-wrapper';

                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'sticky-submit-btn btn-app-primary';
                btn.innerHTML = btnSubmitTop.innerHTML;

                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    btnSubmitTop.click();
                });

                wrapper.appendChild(btn);
                document.body.appendChild(wrapper);

                const mainWrapper = document.querySelector('.main-wrapper');
                if (mainWrapper) {
                    mainWrapper.style.paddingBottom = '80px';
                }
            } else if (window.innerWidth > 768) {
                const wrapper = document.querySelector('.sticky-submit-wrapper');
                if (wrapper) wrapper.remove();
                const mainWrapper = document.querySelector('.main-wrapper');
                if (mainWrapper) {
                    mainWrapper.style.paddingBottom = '';
                }
            }
        };

        // Change Mobile Modal Logic
        const mobileInput = document.querySelector('input[name="mobile"]');
        if (mobileInput) {
            mobileInput.style.pointerEvents = 'none';
            const editBtn = mobileInput.closest('.input-group').querySelector('button');
            if (editBtn) {
                const cmOverlay = document.createElement('div');
                cmOverlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); z-index: 9999; display: none; justify-content: center; align-items: center; opacity: 0; transition: opacity 0.3s ease; padding: 15px;';

                const cmModal = document.createElement('div');
                cmModal.style.cssText = 'background: #fff; border-radius: 20px; padding: 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); width: 100%; max-width: 400px; transform: scale(0.95); transition: transform 0.3s ease; position: relative;';

                cmOverlay.appendChild(cmModal);
                document.body.appendChild(cmOverlay);

                const renderOtpStep = (error = '') => {
                    cmModal.innerHTML = `
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 800; color: var(--text-dark);">تغییر شماره موبایل</h3>
                            <button type="button" class="cm-close-btn" style="background: none; border: none; font-size: 1.5rem; color: var(--text-muted); cursor: pointer;">&times;</button>
                        </div>
                        <div style="margin-bottom: 24px; text-align: center;">
                            <div style="width: 48px; height: 48px; background: rgba(59, 130, 246, 0.1); color: var(--primary); border-radius: 50%; display: flex; justify-content: center; align-items: center; margin: 0 auto 16px;">
                                <i class="fa fa-lock" style="font-size: 1.5rem;"></i>
                            </div>
                            <h4 style="margin: 0 0 8px 0; font-size: 1.1rem; color: var(--text-dark);">تایید شماره فعلی</h4>
                            <p style="margin: 0; font-size: 0.85rem; color: var(--text-muted);">کد ارسال شده به شماره فعلی (${mobileInput.value || '...'}) را وارد کنید.</p>
                        </div>
                        <div style="margin-bottom: 24px;">
                            <input type="text" id="cm-otp-input" placeholder="کد ۴ رقمی (مثال: ۱۲۳۴)" style="width: 100%; padding: 12px; border: 1px solid ${error ? 'var(--danger)' : '#cbd5e1'}; border-radius: 8px; text-align: center; font-size: 1.2rem; letter-spacing: 4px; direction: ltr;" maxlength="4" inputmode="numeric">
                            ${error ? `<span style="color: var(--danger); font-size: 0.75rem; margin-top: 8px; display: block; text-align: center;"><i class="fa fa-exclamation-triangle"></i> ${error}</span>` : ''}
                        </div>
                        <button type="button" id="cm-verify-btn" style="width: 100%; padding: 14px; background: var(--primary); color: #fff; border: none; border-radius: 12px; font-weight: bold; font-size: 1rem; cursor: pointer; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">تایید و ادامه</button>
                    `;

                    cmModal.querySelector('.cm-close-btn').addEventListener('click', closeCmModal);
                    const input = cmModal.querySelector('#cm-otp-input');
                    input.addEventListener('input', (e) => {
                        let val = e.target.value.replace(/[۰-۹]/g, w => String.fromCharCode(w.charCodeAt(0) - 1728));
                        val = val.replace(/[^0-9]/g, '');
                        e.target.value = val;
                    });
                    cmModal.querySelector('#cm-verify-btn').addEventListener('click', () => {
                        if (input.value !== '1234') {
                            renderOtpStep('کد وارد شده اشتباه است. (راهنما: ۱۲۳۴)');
                        } else {
                            renderNewNumberStep();
                        }
                    });
                };

                const renderNewNumberStep = (error = '', loading = false) => {
                    cmModal.innerHTML = `
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 800; color: var(--text-dark);">تغییر شماره موبایل</h3>
                            <button type="button" class="cm-close-btn" style="background: none; border: none; font-size: 1.5rem; color: var(--text-muted); cursor: pointer;" ${loading ? 'disabled' : ''}>&times;</button>
                        </div>
                        <div style="margin-bottom: 24px; text-align: center;">
                            <div style="width: 48px; height: 48px; background: rgba(34, 197, 94, 0.1); color: var(--success); border-radius: 50%; display: flex; justify-content: center; align-items: center; margin: 0 auto 16px;">
                                <i class="fa fa-phone" style="font-size: 1.5rem;"></i>
                            </div>
                            <h4 style="margin: 0 0 8px 0; font-size: 1.1rem; color: var(--text-dark);">شماره جدید</h4>
                            <p style="margin: 0; font-size: 0.85rem; color: var(--text-muted);">شماره موبایل جدید خود را وارد کنید.</p>
                        </div>
                        <div style="margin-bottom: 24px;">
                            <input type="text" id="cm-new-mobile" placeholder="09..." style="width: 100%; padding: 12px; border: 1px solid ${error ? 'var(--danger)' : '#cbd5e1'}; border-radius: 8px; text-align: left; direction: ltr; font-size: 1rem;" maxlength="11" inputmode="numeric" ${loading ? 'disabled' : ''}>
                            <span id="cm-new-mobile-err" style="color: var(--danger); font-size: 0.75rem; margin-top: 8px; display: ${error ? 'block' : 'none'}; text-align: right;"><i class="fa fa-exclamation-triangle"></i> <span class="err-text">${error}</span></span>
                        </div>
                        <button type="button" id="cm-submit-btn" style="width: 100%; padding: 14px; background: var(--success); color: #fff; border: none; border-radius: 12px; font-weight: bold; font-size: 1rem; cursor: pointer; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);" ${loading ? 'disabled' : ''}>
                            ${loading ? '<i class="fa fa-spinner fa-spin"></i> در حال ثبت...' : 'ثبت شماره جدید'}
                        </button>
                    `;

                    cmModal.querySelector('.cm-close-btn').addEventListener('click', closeCmModal);
                    const input = cmModal.querySelector('#cm-new-mobile');
                    const errSpan = cmModal.querySelector('#cm-new-mobile-err');
                    const errText = cmModal.querySelector('.err-text');

                    input.addEventListener('input', (e) => {
                        let val = e.target.value.replace(/[۰-۹]/g, w => String.fromCharCode(w.charCodeAt(0) - 1728));
                        val = val.replace(/[^0-9]/g, '');
                        e.target.value = val;

                        if (val) {
                            if (val.length >= 2 && !val.startsWith('09')) {
                                input.style.borderColor = 'var(--danger)';
                                errSpan.style.display = 'block';
                                errText.textContent = 'شماره موبایل باید با 09 شروع شود';
                            } else if (val.length === 1 && val !== '0') {
                                input.style.borderColor = 'var(--danger)';
                                errSpan.style.display = 'block';
                                errText.textContent = 'شماره موبایل باید با 09 شروع شود';
                            } else if (val.length !== 11) {
                                input.style.borderColor = 'var(--danger)';
                                errSpan.style.display = 'block';
                                errText.textContent = 'شماره موبایل باید ۱۱ رقم باشد';
                            } else {
                                input.style.borderColor = '#cbd5e1';
                                errSpan.style.display = 'none';
                            }
                        } else {
                            input.style.borderColor = '#cbd5e1';
                            errSpan.style.display = 'none';
                        }
                    });

                    cmModal.querySelector('#cm-submit-btn').addEventListener('click', () => {
                        if (!/^09[0-9]{9}$/.test(input.value)) {
                            input.style.borderColor = 'var(--danger)';
                            errSpan.style.display = 'block';
                            errText.textContent = 'شماره موبایل جدید نامعتبر است';
                            return;
                        }
                        const newMobile = input.value;
                        renderNewNumberStep('', true);
                        setTimeout(() => {
                            mobileInput.value = newMobile;
                            mobileInput.dispatchEvent(new Event('input', { bubbles: true }));
                            mobileInput.dispatchEvent(new Event('change', { bubbles: true }));
                            closeCmModal();
                        }, 1500);
                    });
                };

                const closeCmModal = () => {
                    cmOverlay.style.opacity = '0';
                    cmModal.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        cmOverlay.style.display = 'none';
                    }, 300);
                };

                editBtn.addEventListener('click', () => {
                    renderOtpStep();
                    cmOverlay.style.display = 'flex';
                    setTimeout(() => {
                        cmOverlay.style.opacity = '1';
                        cmModal.style.transform = 'scale(1)';
                    }, 10);
                });
            }
        }

        createMobileStickyButton();
        window.addEventListener('resize', createMobileStickyButton);
    }
});
