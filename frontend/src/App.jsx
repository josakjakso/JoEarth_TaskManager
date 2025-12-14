import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TestApi from './pages/TestApi';
import Signin from './pages/Signin';
import NavBar from './components/NavBar.jsx';
import Signup from './pages/Signup.jsx';

export default function App() {
    return (
        <BrowserRouter>
            <NavBar />
            <Routes>
                <Route path="/test" element={<TestApi />} />
                <Route path="/" element={<Signin />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </BrowserRouter>
    );
}