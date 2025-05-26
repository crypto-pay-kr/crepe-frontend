import React from "react";

interface AddMoreItemsButtonProps {
    onClick: () => void;
}

const AddMoreItemsButton: React.FC<AddMoreItemsButtonProps> = ({ onClick }) => {
    return (
        <button
            className="flex items-center justify-center w-full py-3 rounded-lg bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 transition-colors"
            onClick={onClick}
        >
            <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
            >
                <path
                    d="M12 5V19M5 12H19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            <span>더 담으러 가기</span>
        </button>
    );
};

export default AddMoreItemsButton;
