'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('No token found, please login.');
        router.push('/login');
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'omit', // Explicitly set to not include credentials (support_credentials: false)
        });

        if (response.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }

        const data = await response.json();

        if (response.ok && data.success) {
          setUser(data.data);
          setMessage(data.message);
        } else {
          setMessage(data.message || 'Failed to fetch user details.');
        }
      } catch (error) {
        setMessage('An error occurred: ' + error.message);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (!user) {
    return <p>{message || 'Loading...'}</p>;
  }

  return (
    <div className="Dashboard">
      <h1>Foodpanda</h1>
      <h2>Welcome, {user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;