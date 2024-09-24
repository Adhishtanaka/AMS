import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import joi from 'joi';
import axios from 'axios';
import cryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/navbar';
import Footer from '../components/Footer';
import { handleErrorResult } from '../util/TostMessage';

const Register: React.FC = () => {

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [role, setRole] = useState<string>('');

  const navigate = useNavigate();

  const schema = joi.object({
    password: joi.string().min(8).messages({ 'string.min': 'Password must be at least 8 characters long' }),
    confirmPassword: joi.any().equal(joi.ref('password')).required().messages({ 'any.only': 'Passwords do not match' }),
    role: joi.string().valid('Buyer', 'Seller')
  })

  const mutation = useMutation({
    mutationFn: (newUser: { name: string; email: string; password: string; address: string; role: string, telephone: string }) => {
      return axios.post('http://localhost:5000/api/auth/register', newUser);
    }
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = schema.validate({password, confirmPassword,  role }, { abortEarly: false });
    if (!error) {
      const hashedPassword = cryptoJS.SHA256(password).toString();
      mutation.mutate({ name, email, password: hashedPassword, address, role , telephone:phoneNumber });
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setPhoneNumber('');
      setAddress('');
      setRole('');
      navigate('/login');
    } else {
      const errorMessages = error.details.map(detail => detail.message).join('\n');
      handleErrorResult(errorMessages);
    }
  };
  return (
    <>
    <Nav />
    <div className="flex items-center justify-center min-h-screen py-10">
      <div className="bg-white px-8 py-7 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Create Account</h2>
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1D2945] focus:border-[#1D2945] sm:text-sm"

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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1D2945] focus:border-[#1D2945] sm:text-sm"

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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1D2945] focus:border-[#1D2945] sm:text-sm"

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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1D2945] focus:border-[#1D2945] sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phonNumber" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              id="phonNumber"
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              placeholder="Phone Number"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1D2945] focus:border-[#1D2945] sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              rows={3}
              placeholder="Address"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1D2945] focus:border-[#1D2945] sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              title='Select a role'
              name="role"
              value={role}
              required
              onChange={(e) => setRole(e.target.value)}
              className="row-start-1 col-start-1 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1D2945] focus:border-[#1D2945] sm:text-sm"
            >
              <option value="" disabled>Select a role</option>
              <option value="Buyer" className="hover:bg-[#1D2945] hover:text-white">Buyer</option>
              <option value="Seller" className="hover:bg-[#1D2945] hover:text-white">Seller</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-[#1D2945] text-white py-2 px-4 rounded-md hover:bg-[#2b3a5c] focus:outline-none focus:ring-2 focus:ring-[#1D2945] focus:ring-offset-2"
          >
            Register
          </button>
        </form>
        <div className="mt-2 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-[#13244d] hover:text-[#516187]">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
    <Footer />
</>
  )
};

export default Register;