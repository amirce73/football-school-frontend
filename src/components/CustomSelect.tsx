import React, { useState, useRef, useEffect, forwardRef, Children, isValidElement } from 'react';

export interface SelectOption {
    value: string;
    label: React.ReactNode;
}

interface CustomSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    // We can still pass options directly, or just pass <option> as children
    options?: SelectOption[];
}

const CustomSelect = forwardRef<HTMLSelectElement, CustomSelectProps>(
    ({ options: propOptions, className, value, onChange, name, children, ...props }, ref) => {
        const [isOpen, setIsOpen] = useState(false);
        const [internalValue, setInternalValue] = useState<string | number | readonly string[] | undefined>(value || '');
        const wrapperRef = useRef<HTMLDivElement>(null);
        
        // Extract options from children if propOptions is not provided
        const options: SelectOption[] = propOptions || [];
        if (!propOptions && children) {
            Children.forEach(children, child => {
                if (isValidElement(child) && child.type === 'option') {
                    const p = child.props as { value?: unknown; children?: React.ReactNode };
                    options.push({
                        value: p.value !== undefined ? String(p.value) : String(p.children),
                        label: p.children as React.ReactNode
                    });
                }
            });
        }

        // Handle clicking outside to close
        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                    setIsOpen(false);
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, []);

        // Sync internal value if prop value changes (for controlled components)
        useEffect(() => {
            if (value !== undefined) {
                setInternalValue(value);
            }
        }, [value]);

        const handleOptionClick = (val: string) => {
            if (value === undefined) {
                setInternalValue(val);
            }
            setIsOpen(false);
            
            // Trigger onChange to mimic native select event for libraries like react-hook-form
            if (onChange) {
                const event = {
                    target: { name, value: val },
                    currentTarget: { name, value: val },
                    preventDefault: () => {},
                    stopPropagation: () => {}
                } as unknown as React.ChangeEvent<HTMLSelectElement>;
                onChange(event);
            }
        };

        const currentVal = value !== undefined ? value : internalValue;
        const selectedOption = options.find(opt => String(opt.value) === String(currentVal));

        return (
            <div ref={wrapperRef} className={`custom-select-wrapper ${isOpen ? 'open' : ''} ${className || ''}`}>
                {/* Hidden native select for form submission and react-hook-form integration */}
                <select 
                    ref={ref}
                    name={name}
                    value={currentVal}
                    onChange={onChange}
                    className="hidden-native-select"
                    style={{ display: 'none' }}
                    {...props}
                >
                    {/* Render children as-is for the native select, or render from options array */}
                    {children ? children : (
                        <>
                            <option value="" disabled hidden></option>
                            {options.map(opt => (
                                <option key={String(opt.value)} value={opt.value}>{opt.label}</option>
                            ))}
                        </>
                    )}
                </select>

                <div 
                    className={`custom-select-trigger ${className?.includes('error') ? 'error' : ''}`} 
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {selectedOption ? selectedOption.label : 'انتخاب کنید'}
                </div>
                
                {isOpen && (
                    <div className="custom-select-dropdown">
                        {options.map(option => (
                            <div 
                                key={String(option.value)}
                                className={`custom-select-option ${String(option.value) === String(currentVal) ? 'selected' : ''}`}
                                onClick={() => handleOptionClick(String(option.value))}
                            >
                                {option.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
);

CustomSelect.displayName = 'CustomSelect';

export default CustomSelect;
