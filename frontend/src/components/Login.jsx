import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/authSlice";
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Login = ({ onBack, onSignupSwitch, onLoginSuccess }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post('/auth/login', { email, password });

      // Axios data is stored in res.data
      const data = res.data;

      dispatch(
        setCredentials({
          user: data.user,
          token: data.token,
        })
      );

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // This is used so App.jsx knows the user is a seller before it navigates
      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      }

      // Redirect based on role
      if (data.user.role === 'admin') {
        navigate('/admin-dashboard');
      }
      else if (data.user.role === 'seller') {
        navigate('/dashboard');
      } else {
        navigate('/'); // Regular customers go home
      }

      onBack(); // Close login modal
    } catch (err) {
      const message = err.response?.data?.message || 'An error occurred. Please try again.';
      setError(message);
      console.error('Login Error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Login Card */}
      <div className="bg-white rounded-lg p-8 w-full max-w-[400px] shadow-lg relative">

        {/* Close/Back Button */}
        <button
          onClick={onBack}
          className="absolute top-4 right-4 text-gray-400 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-center mb-8">Login</h2>

        <form className="space-y-4" onSubmit={handleLogin}>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-md outline-none focus:border-[#009273]"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-md outline-none focus:border-[#009273]"
            />
          </div>

          <div className="text-right">
            <button type="button" className="text-[#f25a2b] text-[10px] font-bold tracking-widest uppercase hover:underline">Forgot password?</button>
          </div>

          <button className="w-full bg-[#f25a2b] text-white py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-black transition-all duration-300">
            Login
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?
            <span onClick={onSignupSwitch} className="text-[#f25a2b] font-bold cursor-pointer hover:underline ml-1">Signup</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;