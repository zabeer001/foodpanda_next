'use client';

import { useRouter } from 'next/navigation';

function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center px-4">
      <div className="bg-white p-10 rounded-2xl shadow-2xl text-center max-w-md w-full">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">🚀 The Ecommerce App</h1>
        <p className="text-gray-600 mb-8">Your one-stop shop for everything cool. Log in to explore products, deals, and more!</p>
        <button
          onClick={() => router.push('/login')}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Home;
