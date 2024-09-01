import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import joi from 'joi';
import axios from 'axios';
import cryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';
import { handleLoginResult } from '../util/errorMessage';

const Login: React.FC = () => {

  const navigate = useNavigate();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const schema = joi.object({
      password: joi.string().min(8).messages({'string.min': 'Password must be at least 8 characters long'})
  })

    const mutation = useMutation({
        mutationFn: async (User: { email: string; password: string }) => {
          const response = await axios.post('http://localhost:5195/api/login', User);
          return response.data;
    },
    onSuccess: (data) => {
        localStorage.setItem('accessToken', data.accessToken);
        navigate('/');
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

    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      const { error } = schema.validate({password});
      if(!error){
          const hashedPassword = cryptoJS.SHA256(password).toString();
          mutation.mutate({ email, password: hashedPassword });
          setEmail('');
          setPassword('');
       }else{
        const errorMessages = error.details.map(detail => detail.message).join('\n');
        handleLoginResult(errorMessages);
       }}

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="py-12 px-12 bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className=" text-3xl font-semibold mb-6 text-center">Login</h2>
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
              className="py-3 px-3 text-xs font-normal text-gray-100 mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#10a37e81]"
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
              className="py-3 px-3 text-xs font-normal text-gray-100 mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#10a37e81]"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#10a37f] text-white py-2 px-4 rounded-lg hover:bg-[#2d8f76] transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
        );
      };
      
      export default Login;