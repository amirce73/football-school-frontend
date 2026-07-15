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
            setTimeout(() => el.dispatchEvent(new Event('change', { bubbles: true })), 0);
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
            
            const days = Array.from({length: maxDays}, (_, i) => i + 1);
            const months = Array.from({length: 12}, (_, i) => i + 1);
            const years = Array.from({length: 1450 - 1320 + 1}, (_, i) => 1450 - i);
            
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
                    if(items[idx]) {
                        const val = parseInt(items[idx].dataset.val);
                        if(type === 'day' && selectedDay !== val) { selectedDay = val; updateUI(); }
                        if(type === 'month' && selectedMonth !== val) { selectedMonth = val; updateUI(); }
                        if(type === 'year' && selectedYear !== val) { selectedYear = val; updateUI(); }
                    }
                }, 100);
            });
            
            col.addEventListener('click', (e) => {
                const item = e.target.closest('.dp-item');
                if(item) {
                    const val = parseInt(item.dataset.val);
                    if(type === 'day') selectedDay = val;
                    if(type === 'month') selectedMonth = val;
                    if(type === 'year') selectedYear = val;
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
                const faDateParts = new Intl.DateTimeFormat('fa-IR').formatToParts(new Date());
                const pYear = parseInt(faDateParts.find(p => p.type === 'year').value.replace(/[۰-۹]/g, w => String.fromCharCode(w.charCodeAt(0) - 1728)));
                const pMonth = parseInt(faDateParts.find(p => p.type === 'month').value.replace(/[۰-۹]/g, w => String.fromCharCode(w.charCodeAt(0) - 1728)));
                const pDay = parseInt(faDateParts.find(p => p.type === 'day').value.replace(/[۰-۹]/g, w => String.fromCharCode(w.charCodeAt(0) - 1728)));
                selectedYear = pYear; selectedMonth = pMonth; selectedDay = pDay;
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

    // 3. Map Modal Mock
    const mapTriggers = [];
    document.querySelectorAll('button').forEach(btn => {
        if (btn.innerHTML.includes('fa-map-marker') || btn.innerHTML.includes('انتخاب از روی نقشه')) {
            mapTriggers.push(btn);
        }
    });
    if (mapTriggers.length > 0) {
        const mapModal = document.createElement('div');
        mapModal.className = 'modal-overlay';
        mapModal.style.display = 'none';
        mapModal.innerHTML = `
            <div class="modal-content" style="background:var(--surface); padding:20px; border-radius:12px; width:90%; max-width:500px; display:flex; flex-direction:column; gap:15px; box-shadow:var(--shadow-lg);">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h3 style="margin:0;"><i class="fa fa-map-marker text-danger"></i> انتخاب موقعیت (دمو)</h3>
                    <button class="map-close" style="background:none; border:none; font-size:24px; cursor:pointer;">&times;</button>
                </div>
                <div style="height:300px; background:#e2e8f0; border-radius:10px; display:flex; justify-content:center; align-items:center; color:#64748b;">
                    نقشه در اینجا لود می‌شود
                </div>
                <button class="map-confirm btn-app-primary" style="padding:12px; border-radius:8px;"><i class="fa fa-check"></i> تایید آدرس پیش‌فرض</button>
            </div>
        `;
        document.body.appendChild(mapModal);
        
        mapTriggers.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                mapModal.style.display = 'flex';
            });
        });
        
        mapModal.querySelector('.map-close').addEventListener('click', () => mapModal.style.display = 'none');
        mapModal.querySelector('.map-confirm').addEventListener('click', () => {
            alert('آدرس تایید شد!');
            mapModal.style.display = 'none';
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
            if(e.target.closest('.btn-credit')) return;
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

    // Chart observation button (in Specialized Hub)
    const specChartBtn = document.querySelector('.specialized-top-grid .btn-primary');
    if (specChartBtn && specChartBtn.textContent.includes('مشاهده')) {
        specChartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('نمایش نمودار (نمایشی)');
        });
    }

    const chartBtns = document.querySelectorAll('button');
    chartBtns.forEach(btn => {
        if (btn.innerHTML.includes('fa-line-chart') || btn.innerHTML.includes('نمودار')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                alert('نمایش نمودار (نمایشی)');
            });
        }
    });

    // 6. Validations
    document.querySelectorAll('form').forEach(form => {
        const submitBtn = form.querySelector('button[type="submit"], .btn-submit-top');
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
            mobile: { required: 'شماره موبایل الزامی است', regex: /^09[0-9]{9}$/, msg: 'شماره موبایل معتبر نیست' },
            guardianMobile: { regex: /^09[0-9]{9}$/, msg: 'شماره موبایل معتبر نیست' },
            tel: { regex: /^0[1-9][0-9]{9}$/, msg: 'تلفن ثابت معتبر نیست' },
            emergencyPhone: { required: 'شماره اضطراری الزامی است', regex: /^0[0-9]{10}$/, msg: 'شماره اضطراری معتبر نیست' },
            email: { regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, msg: 'ایمیل معتبر نیست' },
            postalCode: { regex: /^[0-9]{10}$/, msg: 'کد پستی باید ۱۰ رقم باشد' },
            address: { required: 'آدرس الزامی است' },
            bankName: { required: 'نام بانک الزامی است', regex: /^[\u0600-\u06FF\s]+$/, msg: 'باید حروف فارسی باشد' },
            accountName: { required: 'نام صاحب حساب الزامی است', regex: /^[\u0600-\u06FF\s]+$/, msg: 'باید حروف فارسی باشد' },
            cardNumber: { required: 'شماره کارت الزامی است', customCheck: isValidIranianBankCard, msg: 'شماره کارت نامعتبر است' },
            sheba: { required: 'شماره شبا الزامی است', customCheck: isValidSheba, msg: 'شماره شبا نامعتبر است' },
            passportNumber: { required: 'شماره پاسپورت الزامی است', regex: /^[A-Za-z0-9]{9}$/, msg: 'شماره پاسپورت نامعتبر است' },
            issueDate: { required: 'تاریخ صدور الزامی است' },
            expiryDate: { required: 'تاریخ انقضا الزامی است' },
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
            religion: { required: 'دین الزامی است' }
        };

        const validateField = (inp, rule) => {
            let targetInput = inp;
            if (inp.tagName === 'SELECT') {
                targetInput = inp.closest('.custom-select-wrapper')?.querySelector('.custom-select-trigger') || inp;
            }
            targetInput.classList.remove('error');
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
                    hasError = true;
                    errorMsg = rule.msg;
                } else if (rule.regex && !rule.regex.test(cleanVal)) {
                    hasError = true;
                    errorMsg = rule.msg;
                } else if (rule.length && cleanVal.length !== rule.length) {
                    hasError = true;
                    errorMsg = rule.msg;
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
            }
            return true;
        };

        for (const [name, rule] of Object.entries(rules)) {
            form.querySelectorAll(`[name="${name}"], [id="${name}"]`).forEach(inp => {
                inp.addEventListener('blur', () => validateField(inp, rule));
                inp.addEventListener('change', () => validateField(inp, rule));
            });
        }

        const enforceNumericLength = (e, len) => {
            const pDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
            let val = e.target.value.replace(/[۰-۹]/g, w => pDigits.indexOf(w).toString());
            val = val.replace(/[^0-9]/g, '');
            if (val.length > len) val = val.slice(0, len);
            e.target.value = val;
        };

        form.querySelectorAll('input[name="nationalId"], input[name="birthCertificateNo"]').forEach(inp => {
            inp.addEventListener('input', (e) => enforceNumericLength(e, 10));
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
// Strict Input Filtering
document.addEventListener('input', (e) => {
    const target = e.target;
    if (!target.name) return;
    
    const digitFields = ['nationalId', 'mobile', 'guardianMobile', 'tel', 'emergencyPhone', 'postalCode', 'cardNumber', 'sheba'];
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
            reader.onload = function(e) {
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
                if(fileLabel) {
                    fileLabel.innerHTML = '<i class="fa fa-check text-success"></i> فایل انتخاب شد';
                }
            }
        });
    }

    // --- Neshan Map Logic ---
    let mapInstance = null;
    let mapMarker = null;

    // Bind Map Button
    const mapBtn = Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('انتخاب از نقشه'));
    if (mapBtn) {
        mapBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('mapModal').style.display = 'flex';
            
            if (!mapInstance && typeof L !== 'undefined') {
                // Initialize map using Leaflet
                mapInstance = L.map('leafletMap').setView([35.6997, 51.3380], 13);
                
                // Add Standard OSM Tile (or replace with Neshan later)
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '© OpenStreetMap'
                }).addTo(mapInstance);
                
                mapMarker = L.marker([35.6997, 51.3380], { draggable: true }).addTo(mapInstance);
                
                mapInstance.on('move', () => {
                    mapMarker.setLatLng(mapInstance.getCenter());
                });

                setTimeout(() => { mapInstance.invalidateSize(); }, 300);
            }
        });
    }

    window.closeMapModal = () => {
        document.getElementById('mapModal').style.display = 'none';
    };

    window.confirmMapSelection = () => {
        if (mapInstance) {
            const center = mapInstance.getCenter();
            // Fill an address field if exists
            const addressInput = document.querySelector('textarea[name="address"]') || document.querySelector('input[name="address"]');
            if (addressInput) {
                addressInput.value = `موقعیت ذخیره شد: ${center.lat.toFixed(4)}, ${center.lng.toFixed(4)}`;
                addressInput.dispatchEvent(new Event('change'));
            }
        }
        window.closeMapModal();
    };
});
