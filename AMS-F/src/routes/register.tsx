import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import joi from 'joi';
import axios from 'axios';
import cryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';


const Register: React.FC = () => {

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [dateOfBirth, setDateOfBirth] = useState<string>('');

  const navigate = useNavigate();
  
  const schema = joi.object({
    password: joi.string().min(8).messages({'string.min': 'Password must be at least 8 characters long'}),
    confirmPassword: joi.any().equal(joi.ref('password')).required().messages({'any.only': 'Passwords do not match'}),
    dateOfBirth: joi.date()
    .max('now')
    .min(new Date(new Date().setFullYear(new Date().getFullYear() - 18)))
    .messages({
      'date.max': 'Date of Birth cannot be in the future',
      'date.min': 'You must be at least 18 years old to register',
    })})

    const mutation = useMutation({
      mutationFn: (newUser: { name: string; email: string; password: string; dateOfBirth: string }) => {
        return axios.post(`${process.env.REACT_APP_API_URL}/register`, newUser);
    }});

    const handleRegister = (e: React.FormEvent) => {
      e.preventDefault();
      const { error } = schema.validate({ password, confirmPassword, dateOfBirth});
      if(!error){
          const hashedPassword = cryptoJS.SHA256(password).toString();
          mutation.mutate({ name, email, password: hashedPassword, dateOfBirth });
          setName('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setDateOfBirth('');
          navigate('/login');
      }else{
        const errorMessages = error.details.map(detail => detail.message).join('\n');
        alert(errorMessages);
      }}

    return (
      <div >
        <div >
          <form onSubmit={handleRegister} >
            <div>
              <label htmlFor="name" >
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Name"
               
              />
            </div>
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
            <div>
              <label htmlFor="confirmPassword" >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm Password"
              />
            </div>
            <div>
              <label htmlFor="dateOfBirth" >
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    );
  };
  
  export default Register;