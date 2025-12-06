import React from 'react';
import Layout from './Layout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import './nocturne.css';

const Kitchen = () => {
  const orders = [
    {
      id: "#1047",
      table: "Table 12",
      items: [
        { name: "Margherita Pizza", quantity: 2, notes: "Extra cheese" },
        { name: "Caesar Salad", quantity: 1, notes: "" }
      ],
      time: "2m ago",
      priority: "high"
    },
    {
      id: "#1046",
      table: "Table 8",
      items: [
        { name: "Grilled Salmon", quantity: 1, notes: "Well done" },
        { name: "Pasta Carbonara", quantity: 2, notes: "" },
        { name: "Garlic Bread", quantity: 2, notes: "" }
      ],
      time: "5m ago",
      priority: "medium"
    },
    {
      id: "#1045",
      table: "Table 3",
      items: [
        { name: "Chicken Wings", quantity: 3, notes: "Spicy" },
        { name: "French Fries", quantity: 2, notes: "" }
      ],
      time: "8m ago",
      priority: "low"
    },
    {
      id: "#1044",
      table: "Table 15",
      items: [
        { name: "Steak", quantity: 2, notes: "Medium rare" },
        { name: "Mashed Potatoes", quantity: 2, notes: "" }
      ],
      time: "12m ago",
      priority: "high"
    }
  ];

  const getPriorityColor = (priority) => {
    const colors = {
      high: "bg-red-100 text-red-800 border-red-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      low: "bg-green-100 text-green-800 border-green-200"
    };
    return colors[priority] || colors.medium;
  };

  return (
    <Layout>
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Kitchen Display</h1>
        <p className="text-muted-foreground">Track and manage orders in real-time</p>
      </div>

      <Tabs defaultValue="legacy" className="w-full">
        <TabsList className="glass border-border">
          <TabsTrigger value="legacy">Legacy View</TabsTrigger>
          <TabsTrigger value="display">Display View</TabsTrigger>
          <TabsTrigger value="display2">Display 2</TabsTrigger>
        </TabsList>

        {/* Legacy View - Card Grid */}
        <TabsContent value="legacy" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => (
              <Card key={order.id} className="glass border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-foreground">{order.id}</CardTitle>
                    <Badge className={getPriorityColor(order.priority)}>
                      {order.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{order.table}</span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {order.time}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between p-2 bg-secondary/50 rounded">
                        <div>
                          <div className="font-medium text-foreground">
                            {item.quantity}x {item.name}
                          </div>
                          {item.notes && (
                            <div className="text-sm text-muted-foreground italic">{item.notes}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" size="sm">
                      <XCircle className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                    <Button className="flex-1 neon-glow" size="sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Complete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Display View - List */}
        <TabsContent value="display" className="mt-6">
          <Card className="glass border-border">
            <CardContent className="p-0">
              {orders.map((order, index) => (
                <div
                  key={order.id}
                  className={`p-4 border-b border-border last:border-0 ${
                    index % 2 === 0 ? 'bg-secondary/20' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold text-foreground">{order.id}</div>
                      <div>
                        <div className="font-semibold text-foreground">{order.table}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {order.time}
                        </div>
                      </div>
                    </div>
                    <Badge className={getPriorityColor(order.priority)}>
                      {order.priority}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="p-2 bg-background rounded border border-border">
                        <div className="font-medium text-foreground">
                          {item.quantity}x {item.name}
                        </div>
                        {item.notes && (
                          <div className="text-sm text-muted-foreground italic">{item.notes}</div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <XCircle className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                    <Button className="neon-glow" size="sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Complete
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display 2 - McDonald's Style */}
        <TabsContent value="display2" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {orders.map((order) => (
              <Card key={order.id} className="glass border-border overflow-hidden">
                <div className={`p-3 ${
                  order.priority === 'high' ? 'bg-red-100' :
                  order.priority === 'medium' ? 'bg-yellow-100' :
                  'bg-green-100'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl font-bold text-gray-900">{order.id.replace('#', '')}</div>
                      <div className="text-lg font-semibold text-gray-900">{order.table}</div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-900">
                      <Clock className="h-5 w-5" />
                      <span className="text-lg font-semibold">{order.time}</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-3 mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="p-3 bg-secondary rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-full text-xl font-bold">
                            {item.quantity}
                          </div>
                          <div className="flex-1">
                            <div className="text-lg font-semibold text-foreground">{item.name}</div>
                            {item.notes && (
                              <div className="text-sm text-muted-foreground italic mt-1">
                                Note: {item.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" size="lg" className="h-14">
                      <XCircle className="h-5 w-5 mr-2" />
                      Cancel
                    </Button>
                    <Button size="lg" className="h-14 neon-glow">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Complete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
    </Layout>
  );
};
export default Kitchen;
