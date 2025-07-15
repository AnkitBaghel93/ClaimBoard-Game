import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import BACKEND_URL from '../../config';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [claimedPoints, setClaimedPoints] = useState(null);
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/all/${userId}`);
      const data = await res.json();
      setUsers(data);
    } catch {
      alert('Failed to fetch users.');
    }
  };

  useEffect(() => {
    if (userId) fetchUsers();
  }, [userId]);

  const handleClaim = async () => {
    if (!selectedId) return alert('Please select a user first.');
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/users/claim/${selectedId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Claim failed');

      const { user, pointsEarned } = data;
      setClaimedPoints({ name: user.name, points: pointsEarned });

      fetchUsers();

      confetti({
        particleCount: 250,
        spread: 200,
        origin: { y: 0.6 },
      });

      setTimeout(() => navigate('/leaderboard'), 2000);
    } catch (err) {
      alert(err.message || 'Something went wrong during claiming.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-100 p-6">
      <h2 className="text-3xl font-bold text-center text-yellow-700 mb-8">🎯 Claim Points</h2>

      {/* Dropdown */}
      <div className="max-w-md mx-auto mb-8">
        <select
          className="w-full p-3 rounded-md border border-yellow-300 bg-white text-yellow-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          onChange={(e) => setSelectedId(e.target.value)}
          value={selectedId}
        >
          <option value="">Select user</option>
          {users.length === 0 ? (
            <option disabled>No users found</option>
          ) : (
            users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} (Points: {user.points}, Rank: {user.rank})
              </option>
            ))
          )}
        </select>
      </div>

      {/* Claim Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={handleClaim}
          disabled={loading}
          className={`w-32 h-32 rounded-full bg-green-500 text-white text-lg font-bold shadow-lg transition-transform duration-300 border-4 border-white ring-4 ring-green-300 ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 animate-pulse'
          }`}
        >
          {loading ? 'Claiming...' : 'Claim'}
        </button>
      </div>

      {/* Claimed Message */}
      {claimedPoints && (
        <div className="text-center text-green-700 font-semibold text-xl mt-6">
          🎉 {claimedPoints.name} earned {claimedPoints.points} points!
        </div>
      )}
    </div>
  );
};

export default UserList;
