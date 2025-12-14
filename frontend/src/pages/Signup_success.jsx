import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignupSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center h-screen select-none">
            <h1>Success!</h1>
            <p>Redirecting to home page...</p>
        </div>
    );
}