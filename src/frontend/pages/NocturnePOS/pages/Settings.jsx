import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function Settings() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Configure your POS system</p>
      </div>

      <div className="space-y-6">
        <Card className="glass border-border">
          
            Venue Information</CardTitle>
            Basic details about your venue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
              <Label htmlFor="venue-name">Venue Name</Label>
              <Input id="venue-name" placeholder="JV Night Venue" className="glass" />
            </div>
            
              <Label htmlFor="venue-address">Address</Label>
              <Input id="venue-address" placeholder="123 Main St" className="glass" />
            </div>
            Save Changes</Button>
          </CardContent>
        </Card>

        <Card className="glass border-border">
          
            Payment Settings</CardTitle>
            Configure payment methods and integrations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              Accepted Payment Methods</Label>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline">Cash</Button>
                <Button variant="outline">Card</Button>
                <Button variant="outline">JVCoin</Button>
                <Button variant="outline">Mobile Pay</Button>
              </div>
            </div>
            
              <Label htmlFor="tax-rate">Tax Rate (%)</Label>
              <Input id="tax-rate" type="number" placeholder="10" className="glass" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border">
          
            Printer Configuration</CardTitle>
            Set up receipt and kitchen printers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
              <Label htmlFor="receipt-printer">Receipt Printer IP</Label>
              <Input id="receipt-printer" placeholder="192.168.1.100" className="glass" />
            </div>
            
              <Label htmlFor="kitchen-printer">Kitchen Printer IP</Label>
              <Input id="kitchen-printer" placeholder="192.168.1.101" className="glass" />
            </div>
            Test Connection</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
