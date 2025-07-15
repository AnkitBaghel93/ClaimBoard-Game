import React, { useState } from 'react';
import { NavLink, useNavigate ,useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const isResetPage = location.pathname.startsWith('/reset-password');
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleLogout = () => {
    logout();
    alert('Logout successful');
    navigate('/signin');
  };

  const linkClasses = ({ isActive }) =>
    isActive
      ? 'text-yellow-600 font-semibold border-b-2 border-yellow-600 pb-1'
      : 'text-gray-700 hover:text-yellow-600 transition duration-300';

const links = isResetPage
  ? [
      { to: '/', label: 'Home' },
      { to: '/signup', label: 'Register' },
      { to: '/signin', label: 'Sign In' },
    ]
  : isLoggedIn
  ? [
      { to: '/', label: 'Home' },
      { to: '/addUser', label: 'Add User' },
      { to: '/claim', label: 'Claim Points' },
      { to: '/leaderboard', label: 'Leaderboard' },
    ]
  : [
      { to: '/', label: 'Home' },
      { to: '/signup', label: 'Register' },
      { to: '/signin', label: 'Sign In' },
    ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="text-2xl font-extrabold text-yellow-600 tracking-tight">
            <NavLink to="/">ClaimBoard</NavLink>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-6 items-center text-base">
            {links.map(({ to, label }) => (
              <NavLink key={to} to={to} className={linkClasses}>
                {label}
              </NavLink>
            ))}
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 font-medium transition duration-300"
              >
                Logout
              </button>
            )}
          </div>

          {/* Hamburger */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-yellow-600">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-64 shadow-inner' : 'max-h-0'
        }`}
      >
        <div className="flex flex-col items-center px-4 py-3 space-y-3 text-sm font-medium">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={linkClasses}
              onClick={toggleMenu}
            >
              {label}
            </NavLink>
          ))}
          {isLoggedIn && (
            <button
              onClick={() => {
                handleLogout();
                toggleMenu();
              }}
              className="text-red-500 hover:text-red-700 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
