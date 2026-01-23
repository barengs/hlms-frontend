import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Toast, ToastContainer, type ToastType } from '@/components/ui/Toast';

interface ToastContextType {
    showToast: (message: string, type: ToastType, duration?: number, loop?: boolean) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType; duration?: number; loop?: boolean }>>([]);

    const showToast = useCallback((message: string, type: ToastType, duration?: number, loop?: boolean) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type, duration, loop }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <ToastContainer>
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        id={toast.id}
                        message={toast.message}
                        type={toast.type}
                        duration={toast.duration}
                        loop={toast.loop}
                        onClose={removeToast}
                    />
                ))}
            </ToastContainer>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
