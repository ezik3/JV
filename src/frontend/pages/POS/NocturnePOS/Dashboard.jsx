import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const stats = [
    { title: "Total Sales", value: "$12,345", icon: DollarSign, change: "+12.5%" },
    { title: "Orders Today", value: "145", icon: ShoppingCart, change: "+8.2%" },
    { title: "Active Tables", value: "23", icon: Users, change: "+3.1%" },
    { title: "Revenue", value: "$8,234", icon: TrendingUp, change: "+15.3%" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="glass glass-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-primary">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="glass col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                <div>
                  <p className="font-semibold">Order #1234</p>
                  <p className="text-sm text-muted-foreground">Table 5 • 2 items</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">$45.99</p>
                  <p className="text-sm text-primary">Pending</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                <div>
                  <p className="font-semibold">Order #1235</p>
                  <p className="text-sm text-muted-foreground">Table 8 • 5 items</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">$89.50</p>
                  <p className="text-sm text-accent">Preparing</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Average Order Value</p>
                <p className="text-2xl font-bold">$32.50</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Peak Hour</p>
                <p className="text-2xl font-bold">9:00 PM</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Staff on Duty</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
