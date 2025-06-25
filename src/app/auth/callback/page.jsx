'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

function AuthCallback() {
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setMessage('No token found');
                console.log('No token found');
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                console.log('Response:', data);

                if (response.ok) {
                    setUser(data);
                    setMessage('Authenticated successfully');

                    // Redirect to dashboard with token
                    const redirectUrl = `https://ecommerce-next-zabeer-steadfast.vercel.app/dashboard?token=${encodeURIComponent(token)}`;
                  
                    window.location.href = redirectUrl;
                } else {
                    setMessage(data.message || 'Authentication failed');
                }
            } catch (error) {
                console.error('Error:', error);
                setMessage('Error: ' + error.message);
            }
        };

        fetchUser();
    }, []);

    return (
        <div className="p-4">
            <h1>Login...</h1>
            {message && <p>{message}</p>}
            {user && (
                <pre>{JSON.stringify(user, null, 2)}</pre>
            )}
        </div>
    );
}

export default AuthCallback;
