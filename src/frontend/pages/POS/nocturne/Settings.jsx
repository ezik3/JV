import React, { useState } from 'react';
import Layout from './Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Save, Building2, CreditCard, Printer } from 'lucide-react';
import './nocturne.css';

const Settings = () => {
  const [venueInfo, setVenueInfo] = useState({
    name: 'My Restaurant',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    phone: '+1 234-567-8900',
    email: 'contact@myrestaurant.com'
  });

  const [paymentSettings, setPaymentSettings] = useState({
    acceptCash: true,
    acceptCard: true,
    acceptDigital: true,
    taxRate: '10.00'
  });

  const [printerSettings, setPrinterSettings] = useState({
    kitchenPrinterIP: '192.168.1.100',
    receiptPrinterIP: '192.168.1.101',
    barPrinterIP: '192.168.1.102'
  });

  const handleVenueChange = (field, value) => {
    setVenueInfo({ ...venueInfo, [field]: value });
  };

  const handlePaymentChange = (field, value) => {
    setPaymentSettings({ ...paymentSettings, [field]: value });
  };

  const handlePrinterChange = (field, value) => {
    setPrinterSettings({ ...printerSettings, [field]: value });
  };

  const handleSaveVenue = () => {
    console.log('Saving venue info:', venueInfo);
    // Add save logic here
  };

  const handleSavePayment = () => {
    console.log('Saving payment settings:', paymentSettings);
    // Add save logic here
  };

  const handleSavePrinter = () => {
    console.log('Saving printer settings:', printerSettings);
    // Add save logic here
  };

  return (
    <Layout>
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Configure your POS system</p>
      </div>

      {/* Venue Information */}
      <Card className="glass border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-foreground">Venue Information</CardTitle>
              <CardDescription>Update your restaurant details</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="venueName">Restaurant Name</Label>
              <Input
                id="venueName"
                value={venueInfo.name}
                onChange={(e) => handleVenueChange('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="venuePhone">Phone Number</Label>
              <Input
                id="venuePhone"
                value={venueInfo.phone}
                onChange={(e) => handleVenueChange('phone', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="venueAddress">Address</Label>
            <Input
              id="venueAddress"
              value={venueInfo.address}
              onChange={(e) => handleVenueChange('address', e.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="venueCity">City</Label>
              <Input
                id="venueCity"
                value={venueInfo.city}
                onChange={(e) => handleVenueChange('city', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="venueState">State</Label>
              <Input
                id="venueState"
                value={venueInfo.state}
                onChange={(e) => handleVenueChange('state', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="venueZip">ZIP Code</Label>
              <Input
                id="venueZip"
                value={venueInfo.zipCode}
                onChange={(e) => handleVenueChange('zipCode', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="venueEmail">Email</Label>
            <Input
              id="venueEmail"
              type="email"
              value={venueInfo.email}
              onChange={(e) => handleVenueChange('email', e.target.value)}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button className="neon-glow gap-2" onClick={handleSaveVenue}>
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Settings */}
      <Card className="glass border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-foreground">Payment Settings</CardTitle>
              <CardDescription>Configure accepted payment methods</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
              <div>
                <div className="font-medium text-foreground">Accept Cash</div>
                <div className="text-sm text-muted-foreground">Allow cash payments</div>
              </div>
              <input
                type="checkbox"
                checked={paymentSettings.acceptCash}
                onChange={(e) => handlePaymentChange('acceptCash', e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
              <div>
                <div className="font-medium text-foreground">Accept Card</div>
                <div className="text-sm text-muted-foreground">Credit and debit cards</div>
              </div>
              <input
                type="checkbox"
                checked={paymentSettings.acceptCard}
                onChange={(e) => handlePaymentChange('acceptCard', e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
              <div>
                <div className="font-medium text-foreground">Accept Digital Wallets</div>
                <div className="text-sm text-muted-foreground">Apple Pay, Google Pay, etc.</div>
              </div>
              <input
                type="checkbox"
                checked={paymentSettings.acceptDigital}
                onChange={(e) => handlePaymentChange('acceptDigital', e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                step="0.01"
                value={paymentSettings.taxRate}
                onChange={(e) => handlePaymentChange('taxRate', e.target.value)}
                className="max-w-xs"
              />
              <p className="text-sm text-muted-foreground">Applied to all orders</p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button className="neon-glow gap-2" onClick={handleSavePayment}>
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Printer Configuration */}
      <Card className="glass border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Printer className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-foreground">Printer Configuration</CardTitle>
              <CardDescription>Set up network printers</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="kitchenPrinter">Kitchen Printer IP Address</Label>
              <Input
                id="kitchenPrinter"
                placeholder="192.168.1.100"
                value={printerSettings.kitchenPrinterIP}
                onChange={(e) => handlePrinterChange('kitchenPrinterIP', e.target.value)}
              />
              <p className="text-sm text-muted-foreground">Prints kitchen orders and tickets</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="receiptPrinter">Receipt Printer IP Address</Label>
              <Input
                id="receiptPrinter"
                placeholder="192.168.1.101"
                value={printerSettings.receiptPrinterIP}
                onChange={(e) => handlePrinterChange('receiptPrinterIP', e.target.value)}
              />
              <p className="text-sm text-muted-foreground">Prints customer receipts</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="barPrinter">Bar Printer IP Address</Label>
              <Input
                id="barPrinter"
                placeholder="192.168.1.102"
                value={printerSettings.barPrinterIP}
                onChange={(e) => handlePrinterChange('barPrinterIP', e.target.value)}
              />
              <p className="text-sm text-muted-foreground">Prints beverage orders</p>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline">Test Printers</Button>
            <Button className="neon-glow gap-2 ml-auto" onClick={handleSavePrinter}>
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
    </Layout>
  );
};
export default Settings;
