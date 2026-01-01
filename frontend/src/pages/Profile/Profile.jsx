import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
    const { user } = useAuth();
    return (
        <div className="flex items-center justify-center min-h-screen flex-col text-center -mt-16 gap-20">
            <div className='flex items-end'>
                <h1 className=' font-semibold px-5'>name: </h1>
                <h1 className="text-3xl font-semibold">{user?.name}</h1>
                <h1 className=' font-semibold invisible px-5'>name: </h1>

            </div>
            <div className='flex items-end'>
                <h1 className=' font-semibold px-5'>email: </h1>
                <h1 className="text-3xl font-semibold">{user?.email}</h1>
                <h1 className='font-semibold invisible px-5'>email: </h1>

            </div>
        </div>
    );
}

export default Profile;
