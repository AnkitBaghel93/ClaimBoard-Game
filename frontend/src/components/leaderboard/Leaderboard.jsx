import React, { useEffect, useState, Fragment } from 'react';
import { io } from 'socket.io-client';
import { Dialog, Transition } from '@headlessui/react';
import BACKEND_URL from '../../config';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const userId = localStorage.getItem('userId');
  const socket = io(BACKEND_URL, { autoConnect: false });

  useEffect(() => {
    if (!userId) return;

    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/users/all/${userId}`);
        const data = await res.json();
        setUsers(data);
      } catch {}
    };

    fetchLeaderboard();
    socket.connect();
    socket.on('leaderboardUpdated', fetchLeaderboard);

    return () => {
      socket.off('leaderboardUpdated');
      socket.disconnect();
    };
  }, [userId]);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/history/${userId}`);
      const data = await res.json();
      setHistory(data);
    } catch {}
  };

  const capitalize = (name) =>
    name ? name.charAt(0).toUpperCase() + name.slice(1) : '';

  const topThree = users.slice(0, 3);
  const others = users.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-100 p-6 relative">
      <h2 className="text-3xl font-bold text-center text-yellow-700 mb-6">🏆 Wealth Ranking</h2>

      {/* Top 3 */}
      <div className="flex justify-center items-end gap-6 mb-10">
        {topThree.map((user, index) => {
          const colors = ['bg-yellow-400', 'bg-gray-400', 'bg-orange-400'];
          const heights = ['h-36', 'h-28', 'h-24'];
          const order = index === 1 ? 'order-1' : index === 0 ? 'order-2' : 'order-3';

          return (
            <div key={user._id} className={`flex flex-col items-center ${order} relative`}>
              <div className="absolute -top-6 text-3xl">👑</div>
              <div className="w-20 h-20 bg-white border-4 border-yellow-500 rounded-full shadow-lg mb-2 flex items-center justify-center">
                <span className="text-yellow-700 text-3xl font-extrabold">{index + 1}</span>
              </div>
              <div
                className={`w-28 ${heights[index]} ${colors[index]} rounded-t-md shadow-md flex flex-col items-center justify-center text-white font-semibold`}
              >
                <span>{capitalize(user.name)}</span>
                <span className="text-sm mt-1">{user.points} pts</span>
              </div>
            </div>
          );
        })}
      </div>

      {/*  Others */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-yellow-800">Top Participants</h3>
          <button
            onClick={() => {
              setIsModalOpen(true);
              fetchHistory();
            }}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-md font-semibold text-sm shadow-md flex items-center gap-1"
          >
            <span className="hidden sm:inline">📜 Point Claim History</span>
            <span className="sm:hidden text-lg">📜</span>
          </button>
        </div>
        <ul className="divide-y divide-yellow-200">
          {others.length === 0 ? (
            <p className="text-sm text-gray-500 pl-2">No more users found.</p>
          ) : (
            others.map((user, idx) => (
              <li key={user._id} className="py-3 flex items-center justify-between">
                <span className="text-gray-700 font-medium">
                  {idx + 4}. {capitalize(user.name)}
                </span>
                <span className="text-yellow-600 font-bold">{user.points} pts</span>
              </li>
            ))
          )}
        </ul>
      </div>

      {/*  Modal for History */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            leave="ease-in duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl">
              <Dialog.Title className="text-xl font-bold text-yellow-600 mb-4">
                📜 Recent Point Claims
              </Dialog.Title>
              <ul className="space-y-2 max-h-80 overflow-y-auto">
                {history.length === 0 ? (
                  <p className="text-sm text-gray-500">No history available.</p>
                ) : (
                  history.map((entry, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between items-center text-sm text-gray-800"
                    >
                      <span>{capitalize(entry.userName)}</span>
                      <span className="text-yellow-600 font-semibold">+{entry.pointsEarned} pts</span>
                    </li>
                  ))
                )}
              </ul>
              <button
                className="mt-4 w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Leaderboard;
