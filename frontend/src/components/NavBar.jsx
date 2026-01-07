import React from 'react';
import bread from '../assets/pic/bread.png';
import { signOut } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


export default function NavBar() {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();
    const isUserLoggedIn = user && user.id !== "00000000-0000-0000-0000-000000000000";
    const handleLogout = async () => {
        try {
            const response = await signOut();
            console.log("Logout response:", response);
        } catch (err) {
            console.error("Logout error:", err);
        } finally {


            localStorage.removeItem('ref_token');

            setUser(null);
            navigate('/');
        }
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
                                <a href="/task" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">Tasks</a>
                                {/* <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">someting2</a>
                                <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">someting3</a>
                                <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">someting4</a> */}
                            </div>

                        </div>
                        <div>
                        </div>
                    </div>
                    {isUserLoggedIn && user.id && (

                        <div className="flex items-end">
                            <a href="/profile" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">{user.name}</a>
                            <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white" onClick={handleLogout}>signOut</a>

                        </div>

                    )}
                    {!isUserLoggedIn && (
                        <div className="flex items-end">
                            <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">signIn</a>

                        </div>
                    )}

                </div>
            </div>

        </nav >
    );
}