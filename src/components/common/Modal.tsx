import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode; 
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps): React.ReactElement | null {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full">
        <h3 className="text-center text-lg font-medium mb-6">{title}</h3>
        <div className="mb-4">{children}</div> {/* 추가: children 렌더링 */}
        <div className="flex justify-center">
          <button 
            onClick={onClose} 
            className="bg-[#4B5EED] text-white px-8 py-2 rounded w-full"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}