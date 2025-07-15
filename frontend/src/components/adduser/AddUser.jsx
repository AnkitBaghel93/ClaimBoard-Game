import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import BACKEND_URL from '../../config';

const AddUser = () => {
  const userId = localStorage.getItem('userId');
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/recent/${userId}`);
      const data = await res.json();
      setUsers(data);
    } catch {
      alert('Failed to fetch users.');
    }
  };

  useEffect(() => {
    if (userId) fetchUsers();
  }, [userId]);

  const handleAddUser = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, userId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add user');

      alert(`User "${data.name}" created successfully!`);
      setName('');
      fetchUsers();
    } catch (err) {
      alert( err.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/users/delete/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete');

      alert('User deleted');
      fetchUsers();
    } catch (err) {
      alert( err.message);
    }
  };

  const capitalizeName = (name) => {
    return name ? name.charAt(0).toUpperCase() + name.slice(1) : '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-100 p-6">
      <h2 className="text-3xl font-bold text-center text-yellow-700 mb-8">👤 Add New User</h2>

      {/* Add User Form */}
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mb-10">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Enter user name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 px-4 py-2 rounded-md border border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            onClick={handleAddUser}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-md font-semibold transition duration-300 shadow-md"
          >
            Add
          </button>
        </div>
      </div>

      {/* All Users */}
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-yellow-700">👥 All Users</h3>
          {users.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No user is created yet.</p>
          ) : (
            <ul className="divide-y divide-yellow-200">
              {users.map((user, index) => (
                <li
                  key={user._id}
                  className="flex items-center justify-between py-3 px-2 hover:bg-yellow-50 transition"
                >
                  <div className="text-gray-800 font-medium">
                    {index + 1}. {capitalizeName(user.name)}
                  </div>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-500 hover:text-red-700 transition text-xl"
                    title="Delete user"
                  >
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>
          )}

      </div>
    </div>
  );
};

export default AddUser;
