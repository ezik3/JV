// ============================================================================
// Settings Page - System Configuration
// ============================================================================
// Route: /venue/pos/settings
// Purpose: Manage venue settings, tax rates, and system configuration
// ============================================================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { supabase } from '../../lib/supabase';

const Settings = () => {
  const navigate = useNavigate();
  const { venue, isAuthenticated, refreshVenue } = useAuth();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Venue Settings
  const [venueSettings, setVenueSettings] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    email: '',
    website: '',
  });

  // Tax Settings
  const [taxSettings, setTaxSettings] = useState({
    tax_rate: '',
    tax_name: '',
    tax_enabled: true,
  });

  // Operating Hours
  const [operatingHours, setOperatingHours] = useState({
    monday: { open: '09:00', close: '22:00', closed: false },
    tuesday: { open: '09:00', close: '22:00', closed: false },
    wednesday: { open: '09:00', close: '22:00', closed: false },
    thursday: { open: '09:00', close: '22:00', closed: false },
    friday: { open: '09:00', close: '23:00', closed: false },
    saturday: { open: '09:00', close: '23:00', closed: false },
    sunday: { open: '10:00', close: '21:00', closed: false },
  });

  // Feature Toggles
  const [features, setFeatures] = useState({
    online_ordering: true,
    reservations: false,
    loyalty_program: false,
    delivery: false,
    takeout: true,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/venue/pos/auth/manager');
    }
  }, [isAuthenticated, navigate]);

  // Load settings
  useEffect(() => {
    if (venue) {
      setVenueSettings({
        name: venue.name || '',
        address: venue.address || '',
        city: venue.city || '',
        state: venue.state || '',
        zip: venue.zip || '',
        phone: venue.phone || '',
        email: venue.email || '',
        website: venue.website || '',
      });

      setTaxSettings({
        tax_rate: venue.tax_rate?.toString() || '0',
        tax_name: venue.tax_name || 'Tax',
        tax_enabled: venue.tax_enabled !== false,
      });

      // Load operating hours from venue settings if available
      if (venue.operating_hours) {
        setOperatingHours(venue.operating_hours);
      }

      // Load features from venue settings if available
      if (venue.features) {
        setFeatures(venue.features);
      }
    }
  }, [venue]);

  // Save venue settings
  const saveVenueSettings = async () => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from('venues')
        .update(venueSettings)
        .eq('id', venue.id);

      if (error) throw error;

      alert('Venue settings saved successfully!');
      refreshVenue?.();
    } catch (error) {
      console.error('Error saving venue settings:', error);
      alert('Error saving settings: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Save tax settings
  const saveTaxSettings = async () => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from('venues')
        .update({
          tax_rate: parseFloat(taxSettings.tax_rate),
          tax_name: taxSettings.tax_name,
          tax_enabled: taxSettings.tax_enabled,
        })
        .eq('id', venue.id);

      if (error) throw error;

      alert('Tax settings saved successfully!');
      refreshVenue?.();
    } catch (error) {
      console.error('Error saving tax settings:', error);
      alert('Error saving settings: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Save operating hours
  const saveOperatingHours = async () => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from('venues')
        .update({ operating_hours: operatingHours })
        .eq('id', venue.id);

      if (error) throw error;

      alert('Operating hours saved successfully!');
      refreshVenue?.();
    } catch (error) {
      console.error('Error saving operating hours:', error);
      alert('Error saving settings: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Save features
  const saveFeatures = async () => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from('venues')
        .update({ features })
        .eq('id', venue.id);

      if (error) throw error;

      alert('Feature settings saved successfully!');
      refreshVenue?.();
    } catch (error) {
      console.error('Error saving features:', error);
      alert('Error saving settings: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your venue and system configuration</p>
        </div>
        <Button onClick={() => navigate('/venue/pos/dashboard')}>
          Back to Dashboard
        </Button>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="venue">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="venue">Venue Info</TabsTrigger>
          <TabsTrigger value="tax">Tax Settings</TabsTrigger>
          <TabsTrigger value="hours">Operating Hours</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        {/* Venue Information Tab */}
        <TabsContent value="venue" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Venue Information</CardTitle>
              <CardDescription>Update your venue details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Venue Name *</Label>
                  <Input
                    id="name"
                    value={venueSettings.name}
                    onChange={(e) => setVenueSettings({ ...venueSettings, name: e.target.value })}
                    placeholder="My Restaurant"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={venueSettings.phone}
                    onChange={(e) => setVenueSettings({ ...venueSettings, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    value={venueSettings.address}
                    onChange={(e) => setVenueSettings({ ...venueSettings, address: e.target.value })}
                    placeholder="123 Main St"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={venueSettings.city}
                    onChange={(e) => setVenueSettings({ ...venueSettings, city: e.target.value })}
                    placeholder="New York"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={venueSettings.state}
                    onChange={(e) => setVenueSettings({ ...venueSettings, state: e.target.value })}
                    placeholder="NY"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input
                    id="zip"
                    value={venueSettings.zip}
                    onChange={(e) => setVenueSettings({ ...venueSettings, zip: e.target.value })}
                    placeholder="10001"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={venueSettings.email}
                    onChange={(e) => setVenueSettings({ ...venueSettings, email: e.target.value })}
                    placeholder="contact@restaurant.com"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={venueSettings.website}
                    onChange={(e) => setVenueSettings({ ...venueSettings, website: e.target.value })}
                    placeholder="https://myrestaurant.com"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={saveVenueSettings} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Venue Information'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax Settings Tab */}
        <TabsContent value="tax" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Tax Configuration</CardTitle>
              <CardDescription>Configure tax rates and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="tax_enabled"
                    checked={taxSettings.tax_enabled}
                    onChange={(e) => setTaxSettings({ ...taxSettings, tax_enabled: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="tax_enabled" className="cursor-pointer">
                    Enable tax calculation
                  </Label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tax_name">Tax Name</Label>
                  <Input
                    id="tax_name"
                    value={taxSettings.tax_name}
                    onChange={(e) => setTaxSettings({ ...taxSettings, tax_name: e.target.value })}
                    placeholder="Sales Tax"
                    disabled={!taxSettings.tax_enabled}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                  <Input
                    id="tax_rate"
                    type="number"
                    step="0.01"
                    value={taxSettings.tax_rate}
                    onChange={(e) => setTaxSettings({ ...taxSettings, tax_rate: e.target.value })}
                    placeholder="8.25"
                    disabled={!taxSettings.tax_enabled}
                  />
                  <p className="text-sm text-muted-foreground">
                    Current rate: {taxSettings.tax_rate}%
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={saveTaxSettings} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Tax Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Operating Hours Tab */}
        <TabsContent value="hours" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Operating Hours</CardTitle>
              <CardDescription>Set your venue's opening hours</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(operatingHours).map(([day, hours]) => (
                <div key={day} className="grid grid-cols-4 gap-4 items-center">
                  <div className="capitalize font-medium">{day}</div>
                  <Input
                    type="time"
                    value={hours.open}
                    onChange={(e) => setOperatingHours({
                      ...operatingHours,
                      [day]: { ...hours, open: e.target.value }
                    })}
                    disabled={hours.closed}
                  />
                  <Input
                    type="time"
                    value={hours.close}
                    onChange={(e) => setOperatingHours({
                      ...operatingHours,
                      [day]: { ...hours, close: e.target.value }
                    })}
                    disabled={hours.closed}
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`${day}-closed`}
                      checked={hours.closed}
                      onChange={(e) => setOperatingHours({
                        ...operatingHours,
                        [day]: { ...hours, closed: e.target.checked }
                      })}
                      className="h-4 w-4"
                    />
                    <Label htmlFor={`${day}-closed`} className="cursor-pointer">
                      Closed
                    </Label>
                  </div>
                </div>
              ))}

              <div className="pt-4">
                <Button onClick={saveOperatingHours} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Operating Hours'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Toggles</CardTitle>
              <CardDescription>Enable or disable features for your venue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Online Ordering</p>
                    <p className="text-sm text-muted-foreground">Allow customers to order online</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={features.online_ordering}
                    onChange={(e) => setFeatures({ ...features, online_ordering: e.target.checked })}
                    className="h-5 w-5"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Reservations</p>
                    <p className="text-sm text-muted-foreground">Enable table reservations</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={features.reservations}
                    onChange={(e) => setFeatures({ ...features, reservations: e.target.checked })}
                    className="h-5 w-5"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Loyalty Program</p>
                    <p className="text-sm text-muted-foreground">Customer loyalty and rewards</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={features.loyalty_program}
                    onChange={(e) => setFeatures({ ...features, loyalty_program: e.target.checked })}
                    className="h-5 w-5"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Delivery</p>
                    <p className="text-sm text-muted-foreground">Offer delivery service</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={features.delivery}
                    onChange={(e) => setFeatures({ ...features, delivery: e.target.checked })}
                    className="h-5 w-5"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Takeout</p>
                    <p className="text-sm text-muted-foreground">Enable takeout orders</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={features.takeout}
                    onChange={(e) => setFeatures({ ...features, takeout: e.target.checked })}
                    className="h-5 w-5"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={saveFeatures} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Features'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Danger Zone */}
      <Card className="border-red-500">
        <CardHeader>
          <CardTitle className="text-red-500">Danger Zone</CardTitle>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Export Data</p>
              <p className="text-sm text-muted-foreground">Download all venue data as backup</p>
            </div>
            <Button variant="outline">Export Data</Button>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div>
              <p className="font-medium">Delete Venue</p>
              <p className="text-sm text-muted-foreground">Permanently delete this venue and all data</p>
            </div>
            <Button variant="destructive" disabled>
              Delete Venue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
