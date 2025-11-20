import React, { useState } from 'react';
import { X } from 'lucide-react';

// Componente Modal riutilizzabile
const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 h-full">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
      />
      
      {/* Modal Content */}
      <div className={`relative bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>
        
        {/* Body */}
        <div className="p-6 overflow-y-auto z-9">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;