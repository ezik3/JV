import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Clock, ChefHat, Bell } from 'lucide-react';
import './nocturne.css';

const KitchenDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeOrders = [
    {
      id: "#1047",
      table: "Table 12",
      items: [
        { name: "Margherita Pizza", quantity: 2, notes: "Extra cheese", category: "Main" },
        { name: "Caesar Salad", quantity: 1, notes: "", category: "Appetizer" }
      ],
      time: "2m",
      priority: "urgent",
      server: "Sarah"
    },
    {
      id: "#1046",
      table: "Table 8",
      items: [
        { name: "Grilled Salmon", quantity: 1, notes: "Well done", category: "Main" },
        { name: "Pasta Carbonara", quantity: 2, notes: "", category: "Main" },
        { name: "Garlic Bread", quantity: 2, notes: "", category: "Sides" }
      ],
      time: "5m",
      priority: "high",
      server: "Mike"
    },
    {
      id: "#1045",
      table: "Table 3",
      items: [
        { name: "Chicken Wings", quantity: 3, notes: "Spicy", category: "Appetizer" },
        { name: "Steak Medium Rare", quantity: 1, notes: "No salt", category: "Main" }
      ],
      time: "8m",
      priority: "medium",
      server: "Emma"
    },
    {
      id: "#1044",
      table: "Table 15",
      items: [
        { name: "Seafood Platter", quantity: 1, notes: "No shellfish", category: "Main" },
        { name: "Side Salad", quantity: 2, notes: "", category: "Sides" }
      ],
      time: "12m",
      priority: "medium",
      server: "John"
    }
  ];

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: "bg-red-500 text-white border-red-600",
      high: "bg-orange-500 text-white border-orange-600",
      medium: "bg-yellow-500 text-white border-yellow-600",
      low: "bg-green-500 text-white border-green-600"
    };
    return colors[priority] || colors.medium;
  };

  const getPriorityBorder = (priority) => {
    const borders = {
      urgent: "border-red-500 shadow-red-500/50",
      high: "border-orange-500 shadow-orange-500/50",
      medium: "border-yellow-500 shadow-yellow-500/50",
      low: "border-green-500 shadow-green-500/50"
    };
    return borders[priority] || borders.medium;
  };

  return (
    <Layout>
      <div className="p-6 space-y-6 bg-background min-h-screen">
        {/* Header with Time */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
              <ChefHat className="h-10 w-10 text-primary" />
              Kitchen Display System
            </h1>
            <p className="text-muted-foreground mt-2">Real-time order tracking for kitchen staff</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-foreground">
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="text-sm text-muted-foreground">
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Active Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeOrders.map((order) => (
            <Card
              key={order.id}
              className={`glass border-4 ${getPriorityBorder(order.priority)} shadow-2xl hover:shadow-3xl transition-all duration-300`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-foreground">{order.id}</CardTitle>
                    <p className="text-lg text-muted-foreground mt-1">
                      {order.table} • Server: {order.server}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={`${getPriorityColor(order.priority)} text-lg px-4 py-2 font-bold uppercase`}>
                      {order.priority}
                    </Badge>
                    <div className="flex items-center gap-2 text-foreground text-xl font-semibold">
                      <Clock className="h-5 w-5" />
                      {order.time}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-secondary/50 border border-border hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl font-bold text-primary">
                            {item.quantity}×
                          </span>
                          <div>
                            <h3 className="text-xl font-bold text-foreground">{item.name}</h3>
                            <Badge variant="outline" className="mt-1 text-sm">
                              {item.category}
                            </Badge>
                          </div>
                        </div>
                        {item.notes && (
                          <div className="mt-3 ml-12 p-2 bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 rounded">
                            <div className="flex items-center gap-2">
                              <Bell className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                              <span className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                                Note: {item.notes}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {activeOrders.length === 0 && (
          <div className="text-center py-20">
            <ChefHat className="h-24 w-24 mx-auto text-muted-foreground opacity-50 mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-2">No Active Orders</h3>
            <p className="text-muted-foreground">Kitchen is all caught up!</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default KitchenDisplay;
