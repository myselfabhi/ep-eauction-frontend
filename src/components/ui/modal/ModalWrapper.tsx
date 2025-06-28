'use client';

import { ReactNode } from 'react';

interface ModalWrapperProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function ModalWrapper({ open, onClose, title, children }: ModalWrapperProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
        {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
        {children}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-red-500"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
