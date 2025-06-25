'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, []);

  const handleSubmit = async (e, endpoint = '/api/login', extraData = {}) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          ...extraData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setMessage('Login successful!');
        router.push('/dashboard');
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (error) {
      setMessage('An error occurred: ' + error.message);
    }
  };

  const handleFoodpandaLogin = () => {
    const redirectUrl = encodeURIComponent('https://ecommerce-next-zabeer-steadfast.vercel.app/auth/callback');
    window.location.href = `https://ecommerce-next-zabeer-steadfast.vercel.app/auth/callback?redirect=${redirectUrl}`;
  
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login to foodpanda</h2>

        {message && <p className="text-center text-sm text-red-600 mb-4">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            Log In
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={handleFoodpandaLogin}
            className="bg-pink-500 hover:bg-pink-600 text-white font-medium px-4 py-2 rounded-lg"
          >
            Login with ecommerce
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
