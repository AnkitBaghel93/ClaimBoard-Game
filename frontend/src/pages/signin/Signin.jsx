import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BACKEND_URL from '../../config';

const Signin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setClicked(true);
    setTimeout(() => setClicked(false), 300);

    try {
      const res = await fetch(`${BACKEND_URL}/api/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Login successful');
        login(data.token);
        localStorage.setItem('userId', data.userId);
        navigate('/');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch {
      alert('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

const handleGoogleLogin = () => {
  window.location.href = `${BACKEND_URL}/api/google`;
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-orange-100 p-4">
      <div className="w-3/4 max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Panel */}
        <div className="md:w-1/2 bg-gradient-to-br from-yellow-400 to-orange-400 text-white flex flex-col justify-center items-center p-10">
          <h2 className="text-4xl font-extrabold mb-3">Welcome Back!</h2>
          <p className="text-center text-lg mb-6">
            Sign in to ClaimBoard and boost your leaderboard score!
          </p>
          <p className="mt-4 text-sm">Don&apos;t have an account?</p>
          <button
            onClick={() => navigate('/signup')}
            className="mt-3 px-6 py-2 border-2 border-white rounded-full text-white hover:bg-white hover:text-orange-600 transition font-semibold"
          >
            Register
          </button>
        </div>

        {/* Right Panel - Sign In Form */}
        <div className="md:w-1/2 bg-white p-8 md:p-10">
          <h2 className="text-2xl font-bold mb-6 text-center text-yellow-700">Sign In</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full p-3 border border-gray-300 rounded bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />

            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-yellow-600 hover:underline">
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-full text-white font-semibold transition duration-200 transform ${
                loading
                  ? 'bg-yellow-300 cursor-not-allowed'
                  : 'bg-yellow-500 hover:bg-yellow-600 hover:scale-105'
              } ${clicked ? 'scale-95' : ''}`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="my-4 text-center text-gray-400 font-medium">or</div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-full py-2 hover:bg-gray-50 transition font-semibold text-sm"
          >
            <FcGoogle className="text-xl" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signin;
