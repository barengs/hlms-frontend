import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { createPortal } from 'react-dom';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
    loop?: boolean;
    onClose: (id: string) => void;
}

export function Toast({ id, message, type, duration = 3000, loop = false, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [animateIn, setAnimateIn] = useState(false);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        if (isVisible) {
            // Show toast -> Wait duration -> Hide
            timer = setTimeout(() => {
                setIsVisible(false);
            }, duration);
        } else {
            // Hidden toast
            if (loop) {
                // Wait 1s -> Show again
                timer = setTimeout(() => {
                    setIsVisible(true);
                }, 1000);
            } else {
                // Wait animation time -> Unmount
                timer = setTimeout(() => {
                    onClose(id);
                }, 300);
            }
        }

        return () => clearTimeout(timer);
    }, [isVisible, duration, loop, id, onClose]);

    useEffect(() => {
        const timer = setTimeout(() => setAnimateIn(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'error':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'warning':
                return <AlertCircle className="w-5 h-5 text-yellow-500" />;
            case 'info':
                return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const getStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200 text-green-800';
            case 'error':
                return 'bg-red-50 border-red-200 text-red-800';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            case 'info':
                return 'bg-blue-50 border-blue-200 text-blue-800';
        }
    };

    const getProgressColor = () => {
        switch (type) {
            case 'success': return 'bg-green-500';
            case 'error': return 'bg-red-500';
            case 'warning': return 'bg-yellow-500';
            case 'info': return 'bg-blue-500';
        }
    };

    return (
        <div
            className={`
                relative flex items-center gap-3 p-4 rounded-lg shadow-lg border w-full max-w-sm overflow-hidden
                transition-all duration-300 ease-in-out transform
                ${isVisible && animateIn ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
                ${getStyles()}
            `}
        >
            <div className="shrink-0">{getIcon()}</div>
            <p className="text-sm font-medium flex-1">{message}</p>
            <button
                onClick={() => setIsVisible(false)} // Manual close triggers exit animation
                className="shrink-0 p-1 hover:bg-black/5 rounded-full transition-colors z-10"
            >
                <X className="w-4 h-4 opacity-50" />
            </button>

            {/* Progress Bar */}
            {isVisible && (
                <div className="absolute bottom-0 left-0 h-1 w-full bg-black/10">
                    <div
                        className={`h-full ${getProgressColor()}`}
                        style={{
                            animation: `shrink ${duration}ms linear forwards`
                        }}
                    />
                </div>
            )}

            <style>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </div>
    );
}

export function ToastContainer({ children }: { children: React.ReactNode }) {
    return createPortal(
        <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2 pointer-events-none p-4">
            <div className="pointer-events-auto flex flex-col items-end gap-2 w-full">
                {children}
            </div>
        </div>,
        document.body
    );
}
