'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// A separate component to handle useSearchParams
function DashboardContent() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchUser = async () => {
      let token = searchParams.get('token') || localStorage.getItem('token');

      if (!token) {
        setMessage('No token found. Please log in.');
        router.push('/login');
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/me`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'omit',
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setUser(data.data);
          setMessage(data.message);
          if (searchParams.get('token')) {
            localStorage.setItem('token', token);
          }
        } else {
          setMessage(data.message || 'Failed to fetch user details.');
          if (searchParams.get('token') && localStorage.getItem('token')) {
            token = localStorage.getItem('token');
            const retryResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/me`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              credentials: 'omit',
            });

            const retryData = await retryResponse.json();
            if (retryResponse.ok && retryData.success) {
              setUser(retryData.data);
              setMessage(retryData.message);
            } else {
              setMessage(retryData.message || 'Failed to fetch user details with local storage token.');
              localStorage.removeItem('token');
              router.push('/login');
            }
          } else {
            localStorage.removeItem('token');
            router.push('/login');
          }
        }
      } catch (error) {
        setMessage('An error occurred: ' + error.message);
        localStorage.removeItem('token');
        router.push('/login');
      }
    };

    fetchUser();
  }, [searchParams, router]);

  const handleLogout = async () => {
    let token = searchParams.get('token') || localStorage.getItem('token');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      console.log('Logout response:', data);

      if (data.success) {
        localStorage.removeItem('token');
        router.push('/login');
        setMessage(data.message); // "Successfully logged out"
      } else {
        setMessage(data.message || 'Logout failed');
      }
    } catch (error) {
      setMessage('An error occurred during logout: ' + error.message);
      localStorage.removeItem('token');
      router.push('/login');
    }
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

// Main Dashboard component with Suspense boundary
export default function Dashboard() {
  return (
    <Suspense fallback={<p>Loading dashboard...</p>}>
      <DashboardContent />
    </Suspense>
  );
}