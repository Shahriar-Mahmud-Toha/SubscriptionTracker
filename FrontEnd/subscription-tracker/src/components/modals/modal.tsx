'use client';

import { useEffect, useRef } from 'react';

export default function Modal({ isOpen, onClose, children, title }: { isOpen: boolean, onClose: () => void, children: React.ReactNode, title?: string }) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-background bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div ref={modalRef} className="bg-secondary-background rounded-xl shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
                <div className="px-6 py-4 border-b-4 border-secondary-foreground flex-shrink-0 flex items-center justify-between">
                    {title && (
                        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
                    )}
                    <button
                        onClick={onClose}
                        className="px-2 bg-background rounded-sm cursor-pointer group relative transition-all duration-300 hover:bg-custom-violet/10"
                    >
                        <span className="text-xl font-semibold text-foreground group-hover:text-custom-violet transition-colors duration-300">×</span>
                        <div className="absolute -top-8 right-0 bg-tooltip-background text-foreground text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap transform translate-y-1 group-hover:translate-y-0">
                            Close
                        </div>
                    </button>
                </div>
                <div className="p-6 overflow-y-auto scrollbar-custom">
                    {children}
                </div>
            </div>
        </div>
    );
} 