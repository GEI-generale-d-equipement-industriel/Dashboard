import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignupPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    setEmail(searchParams.get('email') || '');
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://your-backend.com/auth/complete-signup', { email, password, token });
      alert('Account created successfully!');
      navigate('/login'); // Redirect to login page
    } catch (error) {
      alert('Error creating account.');
    }
  };

  return (
    <div>
      <h2>Complete Your Signup</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} disabled />
        <input type="password" placeholder="Create Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignupPage;
