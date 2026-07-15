const fs = require('fs');

let js = fs.readFileSync('raw-html-version/assets/main.js', 'utf8');

// 1. Task 10: DatePicker today default
const oldDpClick = `        datePickerInputs.forEach(input => {
            input.addEventListener('click', () => {
                selectedYear = 1403; selectedMonth = 1; selectedDay = 1;
                openModal(input);
            });
        });`;
const newDpClick = `        datePickerInputs.forEach(input => {
            input.addEventListener('click', () => {
                const faDateParts = new Intl.DateTimeFormat('fa-IR').formatToParts(new Date());
                const pYear = parseInt(faDateParts.find(p => p.type === 'year').value.replace(/[۰-۹]/g, w => String.fromCharCode(w.charCodeAt(0) - 1728)));
                const pMonth = parseInt(faDateParts.find(p => p.type === 'month').value.replace(/[۰-۹]/g, w => String.fromCharCode(w.charCodeAt(0) - 1728)));
                const pDay = parseInt(faDateParts.find(p => p.type === 'day').value.replace(/[۰-۹]/g, w => String.fromCharCode(w.charCodeAt(0) - 1728)));
                selectedYear = pYear; selectedMonth = pMonth; selectedDay = pDay;
                openModal(input);
            });
        });`;
if(js.includes(oldDpClick)) {
    js = js.replace(oldDpClick, newDpClick);
}

// 2. Task 9: Birthdate future date constraint
const oldBirth = `birthDate: { required: 'تاریخ تولد الزامی است' },`;
const newBirth = `birthDate: { 
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
            },`;
if(js.includes(oldBirth)) {
    js = js.replace(oldBirth, newBirth);
}

// 3. Task 8: National ID green border
const oldValid = `                input.style.borderBottomColor = '#cbd5e1';
                if (existingErr) existingErr.remove();
            }`;
const newValid = `                input.style.borderBottomColor = '#cbd5e1';
                if (input.name === 'nationalId' && cleanVal) {
                    input.classList.add('valid-input');
                }
                if (existingErr) existingErr.remove();
            }`;
if(js.includes(oldValid)) {
    js = js.replace(oldValid, newValid);
}

// 4. Also remove the valid-input class if error
const oldError = `                input.style.borderBottomColor = '#ef4444';`;
const newError = `            input.classList.remove('valid-input');
            if (hasError) {
                input.style.borderBottomColor = '#ef4444';`;
if(js.includes(oldError)) {
    js = js.replace(oldError, newError);
}


// 5. Task 7: Strict input filtering globally
const globalInputCode = `
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
        target.value = target.value.replace(/[^\\u0600-\\u06FF\\s]/g, '');
    }
    
    const englishFields = ['englishName', 'englishSurname'];
    if (englishFields.includes(target.name)) {
        target.value = target.value.replace(/[^A-Za-z\\s]/g, '');
    }
});
`;
js += globalInputCode;

fs.writeFileSync('raw-html-version/assets/main.js', js, 'utf8');
console.log('main.js updated with tasks 7, 8, 9, 10');
