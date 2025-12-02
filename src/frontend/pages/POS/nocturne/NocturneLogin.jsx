import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import api from '../../../api';
import './nocturne-pos.css';

const NocturneLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const history = useHistory();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (token && userRole === 'venue') {
      history.push('/venue/pos/dashboard');
    }
  }, [history]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/auth/login', {
        email,
        password
      });

      if (response.data.success) {
        const { token, userId, role, venueId } = response.data;

        // Verify user is a venue owner
        if (role !== 'venue') {
          setError('Access denied. Only venue owners can access the POS system.');
          setLoading(false);
          return;
        }

        // Store auth data
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('userRole', role);
        if (venueId) {
          localStorage.setItem('venueId', venueId);
        }

        // Redirect to POS dashboard
        history.push('/venue/pos/dashboard');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nocturne-pos flex min-h-screen items-center justify-center p-4">
      <Card className="glass-strong w-full max-w-md fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center neon-text">
            JV POS
          </CardTitle>
          <CardDescription className="text-center text-gray-300">
            Night Venue Point of Sale System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="venue@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="glass border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-200">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="glass border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
            {error && (
              <div className="text-sm text-red-400 bg-red-950/50 p-3 rounded-md border border-red-800">
                {error}
              </div>
            )}
            <Button
              type="submit"
              className="w-full neon-glow bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-gray-400 text-center">
            Don't have an account?{' '}
            <Link to="/venue-signup" className="text-indigo-400 hover:text-indigo-300 underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NocturneLogin;
