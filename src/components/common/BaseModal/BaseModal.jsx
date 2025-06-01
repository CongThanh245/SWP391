import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import  './BaseModal.css'

const BaseModal = ({
    isOpen,
    onClose,
    title,
    children,
    showCloseButton = true,
    className = '',
    contentClassName = '',
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('open');
            document.body.classList.remove('closed');
        } else {
            document.body.classList.add('closed');
            document.body.classList.remove('open');

            document.body.classList.add('closed');
            document.body.classList.remove('open');

            // Clean up classes after animation
            const timeout = setTimeout(() => {
                document.body.classList.remove('closed');
            }, 300);

            return () => clearTimeout(timeout);
        }
        // Cleanup on unmount
        return () => {
            document.body.classList.remove('open', 'closed');
        };
    }, [isOpen]);

    // Handle ESC key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    return (
        <div className="modal-background" onClick={handleBackgroundClick}>
            <div className={`modal ${className}`}>
                {(title || showCloseButton) && (
                    <div className="modal-header">
                        {title && <h2>{title}</h2>}
                        {showCloseButton && (
                            <button
                                className="close-btn"
                                onClick={onClose}
                                aria-label="Đóng modal"
                            >
                                <X size={24} />
                            </button>
                        )}
                    </div>
                )}
                <div className={`modal-content ${contentClassName}`}>
                    {children}
                </div>
            </div>
        </div>
    );
};
export default BaseModal;