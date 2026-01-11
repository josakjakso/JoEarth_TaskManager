import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DividerWithText from '../components/DividerWithText';
import { signIn } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { googleOauth, signInGuest } from '../api/auth';






export default function Signin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await signIn(email, password);
            const { token, refresh_token, ...userData } = response
            console.log('Sign In Successful from signin :', userData);
            setUser(userData);
            navigate('/Task');
        } catch (err) {
            setError(err.message);
        }
    };

    const handlegoogleOauth = async () => {
        googleOauth();
    };

    const handleGuestLogin = async () => {
        signInGuest();
        try {
            const response = await signInGuest();;
            const { token, refresh_token, ...userData } = response
            console.log('Sign In Successful from signin :', userData);
            setUser(userData);
            navigate('/Task');
        } catch (err) {
            setError(err.message);
        }
    };




    return (
        <div className="signin-container flex flex-col items-center justify-center h-screen w-screen pt-30 select-none">
            <form className="flex flex-col gap-10 select-none " onSubmit={handleSubmit}>
                {error && <p className="error">{error}</p>}
                <div>
                    <h2 className='py-1 '>Email</h2>
                    <input
                        className="p-2 border border-gray-300 rounded w-full lg:w-lg"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <h2 className='py-1'>Password</h2>
                    <input
                        className="p-2 border border-gray-300 rounded w-full lg:w-lg"
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
                <button className="border rounded-3xl px-10 py-2 text-center  self-center bg-gray-400 hover:bg-gray-50" type="submit" onClick={handleGuestLogin} >Guest </button>
                <button
                    className="border rounded-3xl px-10 py-2 text-center self-center bg-gray-400 hover:bg-gray-50"
                    onClick={() => navigate('/signup')}
                >
                    Sign Up
                </button>
                <button className="border rounded-3xl px-10 py-2 text-center  self-center bg-gray-400 hover:bg-gray-50" onClick={handlegoogleOauth}>Google</button>


            </div>


        </div>
    );
}