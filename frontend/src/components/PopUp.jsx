import React from 'react';


function PopUp({ showPopUp, closePopUp, children }) {
    if (!showPopUp) { return null }
    return (
        <div className="PopUp" >
            <div className='flex justify-end w-full pr-4 pt-2'>
                <button onClick={closePopUp}>close</button>
            </div>
            <div>
                {children}
            </div>
        </div>
    );
};

export default PopUp;