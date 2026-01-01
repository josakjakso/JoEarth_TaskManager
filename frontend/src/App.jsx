import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TestApi from './pages/TestApi';
import Signin from './pages/Signin';
import NavBar from './components/NavBar.jsx';
import Signup from './pages/Signup.jsx';
import SignupSuccess from './pages/Signup_success.jsx';
import SignInSuccess from './pages/SignIN_success.jsx';
import Task from './pages/Task_Page/Task.jsx';
import Sidebar from './components/sideBar.jsx';
import MainLayout from './components/MainLayout.jsx';
import ProtectedRoute from './auth/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import SigninProtectedRoute from './auth/SigninProtectedRoute.jsx';
import Profile from './pages/Profile/Profile.jsx';

export default function App() {
    return (
        <AuthProvider> {/* 1. ครอบด้วย Provider */}
            <BrowserRouter>
                <NavBar />
                <Routes>
                    <Route element={<SigninProtectedRoute />}>
                        <Route path="/" element={<Signin />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/signup-success" element={<SignupSuccess />} />
                        <Route path="/signin-success" element={<SignInSuccess />} />
                    </Route>

                    <Route element={<MainLayout />}>
                        <Route element={<ProtectedRoute />}>
                            <Route path="/test" element={<TestApi />} />
                            <Route path="/task" element={<Task />} />
                            <Route path="/profile" element={<Profile />} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}