import React from 'react';
import bread from '../assets/pic/bread.png';
import { signOut } from '../api/auth';
import { useNavigate } from 'react-router-dom';


export default function NavBar() {
    const data = JSON.parse(localStorage.getItem('user'));
    const name = data ? data.name : null;
    const navigate = useNavigate();


    const handleLogout = () => {
        signOut();
        navigate('/');
    };
    return (
        <nav className="fixed top-0 left-0 w-full bg-gray-500">
            <div className=" px-12 sm:px-6 lg:px-40    ">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex shrink-0 items-center">
                            <img src={bread} className="h-8 w-auto" />
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">someting1</a>
                                <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">someting2</a>
                                <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">someting3</a>
                                <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">someting4</a>
                            </div>

                        </div>
                        <div>
                        </div>
                    </div>
                    {name && (

                        <div className="flex items-end">
                            <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">{name}</a>
                            <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white" onClick={handleLogout}>signOut</a>

                        </div>

                    )}
                    {!name && (
                        <div className="flex items-end">
                            <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">signIn</a>

                        </div>
                    )}

                </div>
            </div>

        </nav >
    );
}