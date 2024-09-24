import React, { useState } from 'react';
import joi from 'joi';
import axios from 'axios';
import cryptoJS from 'crypto-js';
import Navbar from '../components/navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { handleErrorResult } from '../util/TostMessage';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const schema = joi.object({
    password: joi.string().min(8).messages({'string.min': 'Password must be at least 8 characters long'}),
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = schema.validate({ password });
    if (!error) {
      const hashedPassword = cryptoJS.SHA256(password).toString();
      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          email,
          password: hashedPassword,
        });
        localStorage.setItem('accessToken', response.data.accessToken);
        navigate('/');
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.message || 'An error occurred';
          handleErrorResult(errorMessage);
        } else {
          handleErrorResult('An unexpected error occurred');
        }
      }
      setEmail('');
      setPassword('');
    } else {
      const errorMessages = error.details.map((detail) => detail.message).join('\n');
      handleErrorResult(errorMessages);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 py-6">
        <div className="w-full max-w-md p-8 px-12 py-12 bg-white rounded-lg shadow-lg">
          <h2 className="mb-6 text-3xl font-semibold text-center ">Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter Your Email Addresss."
                className="py-3 px-3 text-xs font-normal text-gray-700 mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1D2945]"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Type Your Password."
                className="py-3 px-3 text-xs font-normal text-gray-700 mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1D2945]"
              />
            </div>
            <div className="mb-4">
              <a href="" className="block text-sm font-medium text-[#1D2945]">
                Forgot Password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-[#1D2945] text-white py-2 px-4 rounded-lg hover:bg-[#1D2945] transition duration-200 mb-4"
            >
              Login
            </button>
            <div>
              <span className="block text-sm font-medium text-center text-gray-600">
                Don't have an account?{' '}
                <a href="./register" className="text-[#13244d] hover:text-[#516187]">
                  Sign up
                </a>
              </span>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
