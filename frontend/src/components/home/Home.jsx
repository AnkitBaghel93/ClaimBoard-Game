import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfettiExplosion from 'react-confetti-explosion';

const Home = () => {
  const navigate = useNavigate();

 
  const isLoggedIn = !!localStorage.getItem('token'); 

  const [exploding, setExploding] = useState(true);

  
  useEffect(() => {
    const interval = setInterval(() => {
      setExploding(false);
      setTimeout(() => setExploding(true), 300); 
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleProtectedNavigation = (path) => {
    if (!isLoggedIn) {
      alert('⚠️ Please log in to continue.');
      return;
    }
    navigate(path);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center p-6 overflow-hidden">
      {/* Looping Confetti */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
        {exploding && (
          <ConfettiExplosion
            force={0.5}
            duration={4000}
            particleCount={100}
            width={1600}
          />
        )}
      </div>

      {/* Card Content */}
      <div className="z-20 bg-white rounded-2xl shadow-2xl p-10 max-w-3xl text-center animate-fade-in">
        <h1 className="text-4xl font-extrabold text-yellow-700 mb-4">
          🚀 Welcome to ClaimBoard
        </h1>
        <p className="text-gray-700 text-lg mb-6">
          Compete with others, earn points, and rise through the leaderboard! Only the top survive 🏆
        </p>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6 mt-6">
          <button
            onClick={() => handleProtectedNavigation('/claim')}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full font-semibold text-lg shadow-md transition transform hover:scale-105"
          >
            🎯 Claim Points
          </button>
          <button
            onClick={() => handleProtectedNavigation('/leaderboard')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold text-lg shadow-md transition transform hover:scale-105"
          >
            🏆 View Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
