import React from 'react';

function PopUp({ showPopUp, closePopUp, children }) {
    if (!showPopUp) return null;

    return (
        // ส่วนของพื้นหลังมืด (Overlay)
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            {/* ส่วนของตัวกล่อง PopUp */}
            <div className="relative bg-white rounded-lg shadow-lg   w-auto ">
                <div className='flex justify-end w-full pr-4 pt-2 select-none'>
                    <button
                        className="text-gray-500 hover:text-black font-bold text-xl"
                        onClick={closePopUp}
                    >
                        &times;
                    </button>
                </div>
                <div className="pb-6 px-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default PopUp;