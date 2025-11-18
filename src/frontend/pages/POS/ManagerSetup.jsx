// ============================================================================
// Manager Setup Page - Venue Onboarding
// ============================================================================
// Route: /venue/pos/auth/manager
// Purpose: One-time venue setup and manager authentication
// ============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { supabase } from '../../lib/supabase';

const ManagerSetup = () => {
  const navigate = useNavigate();
  const { user, venue, signIn, signUp } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' or 'setup'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Venue setup form state
  const [venueName, setVenueName] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [venueCity, setVenueCity] = useState('');
  const [venueState, setVenueState] = useState('');
  const [venueZip, setVenueZip] = useState('');
  const [venuePhone, setVenuePhone] = useState('');
  const [taxRate, setTaxRate] = useState('0.08');

  // ============================================================================
  // HANDLE LOGIN
  // ============================================================================

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      // If user has venue, go to dashboard
      if (venue) {
        navigate('/venue/pos/dashboard');
      } else {
        // No venue, switch to setup mode
        setMode('setup');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // HANDLE SIGNUP & VENUE SETUP
  // ============================================================================

  const handleSetup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // If not logged in, create account first
      if (!user) {
        await signUp(email, password, {
          full_name: venueName,
        });
      }

      // Create venue
      const { data: newVenue, error: venueError } = await supabase
        .from('pos_venues')
        .insert({
          name: venueName,
          owner_id: user.id,
          address: venueAddress,
          city: venueCity,
          state: venueState,
          zip_code: venueZip,
          phone: venuePhone,
          tax_rate: parseFloat(taxRate),
          is_active: true,
        })
        .select()
        .single();

      if (venueError) throw venueError;

      // Redirect to dashboard
      navigate('/venue/pos/dashboard');
    } catch (err) {
      console.error('Setup error:', err);
      setError(err.message || 'Failed to create venue');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            {mode === 'login' ? 'Manager Login' : 'Venue Setup'}
          </CardTitle>
          <CardDescription className="text-center">
            {mode === 'login'
              ? 'Sign in to access your POS system'
              : 'Set up your venue to get started'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive rounded-md text-destructive text-sm">
              {error}
            </div>
          )}

          {mode === 'login' ? (
            // ============================================================================
            // LOGIN FORM
            // ============================================================================
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="manager@venue.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMode('setup')}
                  disabled={loading}
                >
                  New Venue Setup
                </Button>
              </div>
            </form>
          ) : (
            // ============================================================================
            // VENUE SETUP FORM
            // ============================================================================
            <form onSubmit={handleSetup} className="space-y-4">
              {!user && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="setup-email">Email</Label>
                    <Input
                      id="setup-email"
                      type="email"
                      placeholder="manager@venue.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="setup-password">Password</Label>
                    <Input
                      id="setup-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="border-t my-4"></div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="venue-name">Venue Name</Label>
                <Input
                  id="venue-name"
                  type="text"
                  placeholder="The Nightclub"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="venue-address">Address</Label>
                <Input
                  id="venue-address"
                  type="text"
                  placeholder="123 Main Street"
                  value={venueAddress}
                  onChange={(e) => setVenueAddress(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="venue-city">City</Label>
                  <Input
                    id="venue-city"
                    type="text"
                    placeholder="City"
                    value={venueCity}
                    onChange={(e) => setVenueCity(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="venue-state">State</Label>
                  <Input
                    id="venue-state"
                    type="text"
                    placeholder="State"
                    value={venueState}
                    onChange={(e) => setVenueState(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="venue-zip">ZIP</Label>
                  <Input
                    id="venue-zip"
                    type="text"
                    placeholder="ZIP"
                    value={venueZip}
                    onChange={(e) => setVenueZip(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="venue-phone">Phone</Label>
                  <Input
                    id="venue-phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={venuePhone}
                    onChange={(e) => setVenuePhone(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                  <Input
                    id="tax-rate"
                    type="number"
                    step="0.001"
                    min="0"
                    max="1"
                    placeholder="0.08"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Venue'}
                </Button>
                {!user && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setMode('login')}
                    disabled={loading}
                  >
                    Back to Login
                  </Button>
                )}
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerSetup;
