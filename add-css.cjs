const fs = require('fs');
const path = require('path');

const cssToAdd = `
/* =========================================================
   OVERHAULED DATA TABLES & GRID DESIGNS
   ========================================================= */

/* Overriding .form-grid to have 2 columns on mobile and 3 on laptop */
.form-grid {
    display: grid;
    gap: 12px; /* reduced spacing as requested */
    grid-template-columns: repeat(2, 1fr); /* 2 columns on mobile */
    padding: 16px;
}

@media (min-width: 992px) {
    .form-grid {
        grid-template-columns: repeat(3, 1fr); /* 3 columns on desktop/laptop */
    }
}

/* Make inputs look more premium and compact */
.input-group label {
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--text-dark);
    margin-bottom: 2px;
}

.input-group input,
.input-group select,
.input-group textarea {
    padding: 10px 12px; /* compact padding */
    border: 1px solid #cbd5e1;
    border-radius: var(--radius-sm);
    font-size: 0.85rem;
    background: #f8fafc;
    transition: all 0.3s ease;
}

.input-group input:focus,
.input-group select:focus,
.input-group textarea:focus {
    border-color: var(--primary);
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(234, 179, 8, 0.15);
    outline: none;
}

/* Beautiful Premium Data Table */
.table-responsive {
    overflow-x: auto;
    width: 100%;
    border-radius: var(--radius-md);
    background: var(--surface);
    box-shadow: var(--shadow-sm);
}

.data-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 0.85rem;
    text-align: right;
    min-width: 600px;
}

.data-table th {
    background: #f1f5f9;
    color: var(--text-dark);
    font-weight: 800;
    padding: 14px 16px;
    border-bottom: 2px solid #e2e8f0;
    white-space: nowrap;
}

.data-table td {
    padding: 12px 16px;
    color: var(--text-muted);
    border-bottom: 1px solid #f1f5f9;
    vertical-align: middle;
    transition: background 0.2s;
}

.data-table tbody tr {
    transition: all 0.2s ease;
}

.data-table tbody tr:hover {
    background: #f8fafc;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.data-table tbody tr:last-child td {
    border-bottom: none;
}

/* Table Actions (Buttons) */
.btn-icon {
    background: #f1f5f9;
    border: none;
    border-radius: var(--radius-sm);
    width: 32px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-icon:hover {
    background: #e2e8f0;
    transform: scale(1.05);
}

/* Validation Error Text */
.error-text {
    color: var(--danger);
    font-size: 0.75rem;
    font-weight: 600;
    margin-top: 4px;
    display: block;
}

/* Custom buttons */
.btn-primary {
    background: linear-gradient(135deg, var(--primary), #ca8a04);
    color: #fff;
    border: none;
    border-radius: var(--radius-sm);
    padding: 10px 20px;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(234, 179, 8, 0.3);
}

.btn-secondary {
    background: #f1f5f9;
    color: var(--text-dark);
    border: 1px solid #e2e8f0;
    border-radius: var(--radius-sm);
    padding: 10px 20px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-secondary:hover {
    background: #e2e8f0;
}
`;

const filePath = path.join(__dirname, 'src', 'index.css');
if (fs.existsSync(filePath)) {
    fs.appendFileSync(filePath, cssToAdd);
    console.log('CSS appended successfully.');
} else {
    console.log('File not found: ' + filePath);
}
