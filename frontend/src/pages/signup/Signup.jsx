import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BACKEND_URL from '../../config';

const Signup = () => {
  const navigate = useNavigate();
  const [clicked, setClicked] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setClicked(true);
    setTimeout(() => setClicked(false), 300);

    try {
      const res = await fetch(`${BACKEND_URL}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Signup successful!');
        navigate('/signin');
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch {
      alert('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-orange-100 px-4 py-6">
      <div className="w-3/4 max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-yellow-400 to-orange-500 text-white flex flex-col justify-center items-center p-10 text-center">
          <h2 className="text-4xl font-extrabold mb-3 leading-tight">
            Welcome to ClaimBoard!
          </h2>
          <p className="text-lg font-medium mb-6">
            Join now to start earning points and climb the leaderboard!
          </p>
          <p className="mt-4 text-sm text-white/80">Already have an account?</p>
          <button
            onClick={() => navigate('/signin')}
            className="mt-3 px-6 py-2 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-orange-600 transition"
          >
            Sign In
          </button>
        </div>

        {/* Right Panel - Sign Up Form */}
        <div className="w-full md:w-1/2 bg-white p-8 md:p-10">
          <h2 className="text-3xl font-bold text-center text-yellow-700 mb-8">
            Create an Account
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />

            <button
              type="submit"
              className={`w-full py-3 rounded-full font-semibold text-white transition-transform duration-200 ${
                clicked ? 'scale-95' : ''
              } bg-yellow-500 hover:bg-yellow-600`}
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
