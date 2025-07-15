import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Home from './components/home/Home';
import Signin from './pages/signin/Signin';
import Signup from './pages/signup/Signup';
import ForgotPassword from './pages/forgotPassword/ForgotPassword';
import ResetPassword from './pages/resetPassword/ResetPassword';
import AddUser from './components/adduser/AddUser';
import ClaimPoint from './components/claimPoint/ClaimPoint';
import Leaderboard from './components/leaderboard/Leaderboard';
import GoogleAuthSuccess from './pages/signin/GoogleAuthSuccess';


function App() {
  return (
    <>
      <Navbar />
      <div > 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route path="/addUser" element={<AddUser />} />
          <Route path="/claim" element={<ClaimPoint />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/google-auth-success" element={<GoogleAuthSuccess/>} />
        </Routes>
      </div>
    </>
  );
}

export default App;
