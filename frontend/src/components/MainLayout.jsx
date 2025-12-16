import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sideBar.jsx';
import { useState } from 'react';

export default function MainLayout({ children }) {
    const [isOpen, setIsOpen] = useState(false);


    return (
        <div className="min-h-screen">

            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

            {isOpen && (
                <div
                    className="fixed   inset-0 bg-black/50 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <main className="pt-16">
                <Outlet />
            </main>
        </div>
    );
}
