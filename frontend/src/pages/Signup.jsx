import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DividerWithText from '../components/DividerWithText';

export default function Signup() {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        email: "",
        password: "",
        name: "",
    });
    const navigate = useNavigate();

    const nextStep = () => {
        setStep((prev) => prev + 1);
    };





    return (
        <div className=" flex flex-col  items-center justify-center h-screen ">
            <div className='flex-col fixed top-60 left-1/2 transform -translate-x-1/2'>
                {form.email && <p className="text-green-900">Email : {form.email}</p>}
                {form.password && <p className="text-green-900">Password : {'*'.repeat(form.password.length)}</p>}
                {form.name && <p className="text-green-900">Name : {form.name}</p>}
            </div>
            <form className="flex flex-col  select-none  " >

                {step === 1 && (
                    <div>
                        <h2 className='py-1 '>Email</h2>
                        <input
                            className="p-2 border border-gray-300 rounded w-lg"
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                        <button
                            className="mt-4 flex  bg-black text-white p-2 ml-auto  border rounded disabled:opacity-50"
                            onClick={nextStep}
                            disabled={!form.email}
                        >
                            Next
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <h2 className='py-1'>Password</h2>
                        <input
                            className="p-2 border border-gray-300 rounded  w-lg"
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                        <div className='flex justify-between'>
                            <button
                                className="mt-4   bg-black text-white p-2  rounded "
                                onClick={() => setStep((prev) => prev - 1)}>
                                Back
                            </button>
                            <button
                                className="mt-4  bg-black text-white p-2  rounded disabled:opacity-50"
                                onClick={nextStep}
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
                                className="p-2 border border-gray-300 rounded  w-lg"
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
                                    className="mt-4   bg-black text-white p-2  rounded border"
                                    onClick={() => setStep((prev) => prev - 1)}>
                                    Back
                                </button>

                                <button
                                    className="mt-4  bg-green-900 text-white p-2  rounded disabled:opacity-50 "
                                    onClick={() => {
                                        // Handle final submission logic here
                                        console.log('Form submitted:', form);
                                        navigate('/');
                                    }}
                                    disabled={!form.name && !form.password && !form.email}
                                >
                                    Submit
                                </button>

                            </div>
                        </div>

                    )
                }
                {step === 4 && (
                    <div className='flex flex-col items-center'>

                    </div>
                )}
            </form >
        </div >
    );
}