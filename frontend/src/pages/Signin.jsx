import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DividerWithText from '../components/DividerWithText';

export default function Signin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };



    return (
        <div className="signin-container flex flex-col items-center justify-center h-screen pt-30">
            <form className="flex flex-col gap-10 select-none " onSubmit={handleSubmit}>
                {error && <p className="error">{error}</p>}
                <div>
                    <h2 className='py-1 '>Email</h2>
                    <input
                        className="p-2 border border-gray-300 rounded w-lg"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <h2 className='py-1'>Password</h2>
                    <input
                        className="p-2 border border-gray-300 rounded  w-lg"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button className="border rounded px-4 py-2 text-center  self-center bg-gray-500 hover:bg-gray-50" type="submit">Sign In</button>
            </form>
            <DividerWithText text={"Don't have an account?"} />
            <div className='flex flex-col gap-5'>
                <button className="border rounded-3xl px-10 py-2 text-center  self-center bg-gray-400 hover:bg-gray-50" >Sign Up</button>
                <button className="border rounded-3xl px-10 py-2 text-center  self-center bg-gray-400 hover:bg-gray-50" >Google</button>


            </div>


        </div>
    );
}