const fs = require('fs');
const path = require('path');

const cssToAdd = `
/* =========================================================
   FLOATING LABELS & ERROR STATES (MATERIAL UI STYLE)
   ========================================================= */

/* Make room for floating label */
.input-group {
    position: relative;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 0;
}

/* Floating Label on the border */
.input-group label {
    position: absolute;
    top: -10px;
    right: 12px;
    background: var(--surface); /* Match card background */
    padding: 0 6px;
    font-size: 0.75rem;
    font-weight: 800;
    color: var(--primary);
    z-index: 10;
    pointer-events: none;
}

/* Input Styles adjusting for floating label */
.input-group input,
.input-group select,
.input-group textarea {
    padding: 12px 14px;
    border: 1px solid #cbd5e1;
    border-radius: var(--radius-sm);
    font-size: 0.9rem;
    background: transparent;
    transition: all 0.3s ease;
    z-index: 5;
    position: relative;
}

.input-group input:focus,
.input-group select:focus,
.input-group textarea:focus {
    border-color: var(--primary);
    background: transparent;
    box-shadow: 0 0 0 3px rgba(234, 179, 8, 0.15);
    outline: none;
}

/* Error States */
.input-group input.error,
.input-group select.error,
.input-group textarea.error {
    border-color: var(--danger) !important;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15) !important;
}

.input-group label.error-label {
    color: var(--danger) !important;
}

.error-text {
    color: var(--danger);
    font-size: 0.75rem;
    font-weight: 700;
    margin-top: 6px;
    display: flex;
    align-items: center;
    gap: 4px;
}
`;

const filePath = path.join(__dirname, 'src', 'index.css');
if (fs.existsSync(filePath)) {
    fs.appendFileSync(filePath, cssToAdd);
    console.log('Floating labels CSS appended successfully.');
} else {
    console.log('File not found: ' + filePath);
}
