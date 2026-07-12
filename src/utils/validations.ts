// src/utils/validations.ts

export const isValidIranianNationalId = (nationalId: string): boolean => {
    if (!/^\d{10}$/.test(nationalId)) return false;
    
    const check = parseInt(nationalId[9]);
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(nationalId[i]) * (10 - i);
    }
    
    const remainder = sum % 11;
    return (remainder < 2 && check === remainder) || (remainder >= 2 && check === 11 - remainder);
};

export const isValidIranianBankCard = (cardNumber: string): boolean => {
    if (!/^\d{16}$/.test(cardNumber)) return false;

    let sum = 0;
    for (let i = 0; i < 16; i++) {
        let digit = parseInt(cardNumber[i]);
        if (i % 2 === 0) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
    }
    
    return sum % 10 === 0;
};

export const isValidSheba = (sheba: string): boolean => {
    // Basic format: 24 digits (since IR is prepended usually, but we accept 24 digits)
    if (!/^\d{24}$/.test(sheba)) return false;
    
    // To validate IBAN, move the first 4 characters to the end.
    // IR = 18 27
    const iranCode = "182700"; // IR00
    const rearranged = sheba + iranCode;
    
    // Modulo 97 calculation on large string
    let remainder = 0;
    for (let i = 0; i < rearranged.length; i++) {
        remainder = (remainder * 10 + parseInt(rearranged[i])) % 97;
    }
    
    return remainder === 1;
};

// Passport format A12345678 (1 letter + 8 digits)
export const isValidPassportNumber = (passport: string): boolean => {
    return /^[A-Za-z]\d{8}$/.test(passport);
};
