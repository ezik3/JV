import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import api from '../../../api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import './nocturne-pos.css';

export default function POSSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [venueName, setVenueName] = useState('');
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
      // Register as a venue
      const response = await api.post('/api/auth/register', { 
        email, 
        password,
        venueName,
        role: 'venue'
      });
      
      // Store auth data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('userRole', 'venue');
      localStorage.setItem('venueName', venueName);
      
      // Redirect to POS dashboard
      history.push('/venue/pos/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nocturne-pos min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md glass border-border">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center text-primary">JV POS</CardTitle>
          <CardDescription className="text-center">
            Create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="error-message text-center p-2 rounded bg-destructive/20">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="venueName">Venue Name</Label>
              <Input
                id="venueName"
                type="text"
                placeholder="Your Venue Name"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full neon-glow"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/venue/pos" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
