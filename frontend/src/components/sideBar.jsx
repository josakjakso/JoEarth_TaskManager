import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Sidebar({ isOpen, setIsOpen }) {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));



    return (
        <aside
            className={`fixed top-0 left-0 h-screen bg-gray-500 text-white
        transition-all duration-300 z-50
        ${isOpen ? 'w-64' : 'w-0'}
      `}
        >
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-500 select-none">
                {isOpen && <span className="font-bold"></span>}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-gray-300 hover:text-white"
                >
                    ☰
                </button>
            </div>

            {/* User */}
            {isOpen && user && (
                <div className="px-4 py-3 border-b border-gray-700 text-sm">
                    <div className="text-gray-400">Signed in as</div>
                    <div className="font-medium truncate">{user.name}</div>
                </div>
            )}

            {/* Menu */}
            <nav className="mt-4 space-y-1 px-2">
                <SideItem to="/tasks/table" label="Tasks" isOpen={isOpen} />
                <SideItem to="/profile" label="Profile" isOpen={isOpen} />
            </nav>

            {/* Footer */}
            <div className="absolute bottom-0 w-full p-2 border-t border-gray-700">

            </div>
        </aside>
    );
}

function SideItem({ to, label, isOpen }) {
    return (
        isOpen &&
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded text-sm
        ${isActive
                    ? 'bg-gray-700 text-white'
                    : ''
                }`
            }
        >
            {isOpen && <span>{label}</span>}
        </NavLink>
    );
}
