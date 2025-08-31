import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const LoginView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    // Mock login - any non-empty credentials will work
    setError('');
    login(email);
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-primary">
      <div className="w-full max-w-md p-8 space-y-8 bg-secondary rounded-lg shadow-2xl border border-border-color">
        <div className="text-center">
          <img src="https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/HNAI%20Title%20-Teal%20%26%20Golden%20Logo%20-%20DESIGN%203%20-%20Raj-07.png" alt="HERE AND NOW AI Logo" className="w-48 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-accent tracking-wider">DIGITAL TWINS</h1>
          <p className="text-text-secondary mt-2">Please sign in to continue</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-secondary">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-text-primary bg-primary border border-border-color rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-secondary">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-text-primary bg-primary border border-border-color rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-brand-secondary bg-accent rounded-md hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-hover transition-colors"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};