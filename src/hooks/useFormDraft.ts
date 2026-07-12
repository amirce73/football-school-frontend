import { useEffect, useCallback, useRef } from 'react';

/**
 * useFormDraft - Auto-saves form state to localStorage on every change.
 * Restores draft AFTER the form is populated from the server (via reset).
 * 
 * Usage: call AFTER you call reset() from server data in useEffect.
 * The draft restore is debounced to run after the server reset settles.
 */
export function useFormDraft(formId: string, methods: any) {
    const { watch, reset, getValues } = methods;
    const draftKey = `form-draft-${formId}`;
    const isMountedRef = useRef(false);
    const isRestoringRef = useRef(false);

    // On mount: try to restore draft after a short delay
    // (so any server-reset that happens on mount can finish first)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const savedDraft = localStorage.getItem(draftKey);
            if (!savedDraft) return;
            try {
                const parsed = JSON.parse(savedDraft);
                if (parsed && Object.keys(parsed).length > 0) {
                    isRestoringRef.current = true;
                    reset(parsed, { keepDefaultValues: true });
                    // Release the lock after watch fires
                    setTimeout(() => {
                        isRestoringRef.current = false;
                    }, 100);
                }
            } catch (e) {
                console.error('[useFormDraft] Failed to parse draft:', e);
            }
        }, 300); // wait 300ms for any server reset to complete

        isMountedRef.current = true;
        return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [draftKey]);

    // Continuously save on every field change
    useEffect(() => {
        const subscription = watch((value: Record<string, unknown>) => {
            if (isRestoringRef.current) return; // don't save during restore
            if (!isMountedRef.current) return;
            if (value && Object.keys(value).length > 0) {
                localStorage.setItem(draftKey, JSON.stringify(value));
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, draftKey]);

    const clearDraft = useCallback(() => {
        localStorage.removeItem(draftKey);
    }, [draftKey]);

    return { clearDraft };
}
