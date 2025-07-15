import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BACKEND_URL from '../../config';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setClicked(true);
    setTimeout(() => setClicked(false), 300);

    try {
      const res = await fetch(`${BACKEND_URL}/api/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok) {
        setDone(true);
        setTimeout(() => navigate('/signin'), 2000);
      } else {
        alert(data.message || 'Failed to reset');
      }
    } catch {
      alert('Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-orange-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-10 animate-fade-in text-center">
        <h2 className="text-3xl font-bold text-yellow-700 mb-4">Reset Your Password</h2>

        {done ? (
          <p className="text-green-600 font-semibold text-lg">
            Password reset! Redirecting...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              {loading ? 'Updating...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
