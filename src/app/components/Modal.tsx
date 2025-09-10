'use client';

import { useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes } from 'react-icons/fa';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose, isOpen]);

  if (!isOpen) return null;
 
  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md transition-all duration-300 p-1 sm:p-4"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-[95vw] sm:max-w-4xl relative transform transition-all duration-300 animate-in slide-in-from-bottom-4 fade-in-0"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 hover:shadow-lg z-10"
        >
          <FaTimes size={16} />
        </button>
        <div className="max-h-[100vh]">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}