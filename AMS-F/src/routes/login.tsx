import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import joi from 'joi';
import axios from 'axios';
import cryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {

  const navigate = useNavigate();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const schema = joi.object({
      password: joi.string().min(8).messages({'string.min': 'Password must be at least 8 characters long'})
  })

    const mutation = useMutation({
        mutationFn: async (User: { email: string; password: string }) => {
          const response = await axios.post('http://localhost:5195/api//login', User);
          return response.data;
    },
    onSuccess: (data) => {
        localStorage.setItem('accessToken', data.accessToken);
        navigate('/');
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.message || 'An error occurred';
          alert(errorMessage);
      } else {
          alert('An unexpected error occurred');
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
        alert(errorMessages);
       }}

         return (
          <div >
            <div >
              <form onSubmit={handleLogin}>
                <div>
                  <label htmlFor="email" >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Email"
                  />
                </div>
                <div>
                  <label htmlFor="password" >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Password"
                  />
                </div>
                <button
                  type="submit"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        );
      };
      
      export default Login;