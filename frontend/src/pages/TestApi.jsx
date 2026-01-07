import { useState } from 'react';



export default function TestApi() {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const handleFetchMessage = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_BASE_URL}/testlogin`);
            const data = await response.json();
            setMessage(data.message);
        } catch (err) {
            setError('Failed to fetch message: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1>Test API</h1>
            <button className=" border rounded-2xl py-1 px-2 bg-green-300" onClick={handleFetchMessage} disabled={loading}>
                {loading ? 'Loading...' : 'Fetch Message'}
            </button>
            {message && <p><strong>Message:</strong> {message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}