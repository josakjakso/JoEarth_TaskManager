import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../api/auth';

export default function Signup() {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        email: "",
        password: "",
        name: "",
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const emailInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    const nameInputRef = useRef(null);

    React.useEffect(() => {
        if (step === 1 && emailInputRef.current) {
            emailInputRef.current.focus();
        } else if (step === 2 && passwordInputRef.current) {
            passwordInputRef.current.focus();
        } else if (step === 3 && nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, [step]);

    const isEmailValid = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const nextStep = () => {
        setStep((prev) => prev + 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (step === 1) {
            if (!form.email) return;
            setStep(2);
            return;
        }

        if (step === 2) {
            if (!form.password) return;
            setStep(3);
            return;
        }



        if (step === 3) {
            if (!form.name) return;

            try {
                const data = await signUp(form.email, form.password, form.name);
                console.log('Form submitted:', form);
                console.log(data);
                navigate("/signup/success");
            } catch (err) {
                setError(err.message);
                console.log(err);
            }
        }
    };




    return (
        <div className=" flex flex-col  items-center justify-center h-screen select-none">
            <div className='flex-col fixed top-60 left-1/2 transform -translate-x-1/2'>
                {form.email && <p className="text-green-900">Email : {form.email}</p>}
                {form.password && <p className="text-green-900">Password : {'*'.repeat(form.password.length)}</p>}
                {form.name && <p className="text-green-900">Name : {form.name}</p>}
            </div>
            <form className="flex flex-col  select-none  " onSubmit={handleSubmit}>

                {step === 1 && (
                    <div>
                        <h2 className='py-1 '>Email</h2>
                        <input
                            ref={emailInputRef}
                            className="p-2 border border-gray-300 rounded w-lg "
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                        <button
                            className="mt-4 flex  bg-black text-white p-2 ml-auto  border rounded disabled:opacity-50"
                            onClick={nextStep}
                            disabled={!form.email || !isEmailValid(form.email)}
                        >
                            Next
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <h2 className='py-1'>Password</h2>
                        <input
                            ref={passwordInputRef}
                            className="p-2 border border-gray-300 rounded  w-lg select-auto"
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                        <div className='flex justify-between'>
                            <button
                                type='button'
                                className="mt-4   bg-black text-white p-2  rounded "
                                onClick={() => setStep((prev) => prev - 1)}>
                                Back
                            </button>
                            <button
                                type='submit'
                                className="mt-4  bg-black text-white p-2  rounded disabled:opacity-50"

                                disabled={!form.password}
                            >
                                Next
                            </button>

                        </div>

                    </div>
                )
                }
                {
                    step === 3 && (
                        <div>
                            <h2 className='py-1'>Name</h2>
                            <input
                                ref={nameInputRef}
                                className="p-2 border border-gray-300 rounded  w-lg select-auto"
                                type="text"
                                value={form.name}
                                onChange={(e) => {
                                    if (e.target.value.length <= 15) {
                                        setForm({ ...form, name: e.target.value });
                                    }
                                }}
                                required
                            />
                            <div className='flex justify-between'>
                                <button
                                    type='button'
                                    className="mt-4   bg-black text-white p-2  rounded border"
                                    onClick={() => setStep((prev) => prev - 1)}>
                                    Back
                                </button>

                                <button
                                    className="mt-4  bg-green-900 text-white p-2  rounded disabled:opacity-50 "
                                    type="submit"
                                    disabled={!form.name || !form.password || !form.email}
                                >
                                    Submit
                                </button>

                            </div>
                        </div>

                    )
                }

            </form >
        </div >
    );
}