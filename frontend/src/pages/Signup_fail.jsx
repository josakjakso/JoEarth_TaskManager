import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignupFail() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/signup');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center h-screen select-none">
            <h1>Fail</h1>

        </div>
    );
}