import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import joi from 'joi';
import axios from 'axios';
import cryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';
import { handleLoginResult } from '../util/errorMessage';

const Register: React.FC = () => {

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [dateOfBirth, setDateOfBirth] = useState<string>('');

  const navigate = useNavigate();

  const schema = joi.object({
    password: joi.string().min(8).messages({ 'string.min': 'Password must be at least 8 characters long' }),
    confirmPassword: joi.any().equal(joi.ref('password')).required().messages({ 'any.only': 'Passwords do not match' }),
    dateOfBirth: joi.date()
      .max('now')
      .min(new Date(new Date().setFullYear(new Date().getFullYear() - 18)))
      .messages({
        'date.max': 'Date of Birth cannot be in the future',
        'date.min': 'You must be at least 18 years old to register',
      })
  })

  const mutation = useMutation({
    mutationFn: (newUser: { name: string; email: string; password: string; dateOfBirth: string }) => {
      return axios.post('http://localhost:5195/api/register', newUser);
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'An error occurred';
        handleLoginResult(errorMessage);
      } else {
        handleLoginResult('An unexpected error occurred');
      }
    },
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = schema.validate({ password, confirmPassword, dateOfBirth });
    if (!error) {
      const hashedPassword = cryptoJS.SHA256(password).toString();
      mutation.mutate({ name, email, password: hashedPassword, dateOfBirth });
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setDateOfBirth('');
      navigate('/login');
    } else {
      const errorMessages = error.details.map(detail => detail.message).join('\n');
      handleLoginResult(errorMessages);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#10a37f] focus:border-[#10a37f] sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#10a37f] focus:border-[#10a37f] sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#10a37f] focus:border-[#10a37f] sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm Password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#10a37f] focus:border-[#10a37f] sm:text-sm"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              id="dateOfBirth"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#10a37f] focus:border-[#10a37f] sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#10a37f] text-white py-2 px-4 rounded-md hover:bg-[#2d8f76] focus:outline-none focus:ring-2 focus:ring-[#10a37f] focus:ring-offset-2"
          >
            Register
          </button>
        </form>
      </div>
    </div>

  )
};

export default Register;