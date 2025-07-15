import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BACKEND_URL from '../../config';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setClicked(true);
    setTimeout(() => setClicked(false), 300);

    try {
      const res = await fetch(`${BACKEND_URL}/api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setSent(true);
      } else {
        alert(data.message || 'Something went wrong');
      }
    } catch {
      alert('Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-orange-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-10 animate-fade-in">
        <h2 className="text-3xl font-bold text-yellow-700 text-center mb-4">Forgot Password?</h2>
        <p className="text-gray-600 text-center mb-6">
          Enter your registered email and we’ll send you a reset link.
        </p>

        {sent ? (
          <p className="text-green-600 text-center font-semibold text-lg">
             Reset link sent! Check your inbox.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-full text-white font-semibold transition duration-200 transform ${
                loading
                  ? 'bg-yellow-300 cursor-not-allowed'
                  : 'bg-yellow-500 hover:bg-yellow-600 hover:scale-105'
              } ${clicked ? 'scale-95' : ''}`}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <p
              onClick={() => navigate('/signin')}
              className="text-sm text-yellow-600 hover:underline cursor-pointer text-center"
            >
              Back to Sign In
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
