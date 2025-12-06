import React, { useState } from 'react';
import Layout from './Layout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Users, Clock, DollarSign, X } from 'lucide-react';
import './nocturne.css';

const Tables = () => {
  const [selectedTable, setSelectedTable] = useState(null);

  const tables = [
    { id: 1, number: 1, status: "available", capacity: 2, currentGuests: 0, orderId: null, orderTotal: 0, duration: null },
    { id: 2, number: 2, status: "occupied", capacity: 4, currentGuests: 3, orderId: "#1047", orderTotal: 45.50, duration: "45m" },
    { id: 3, number: 3, status: "occupied", capacity: 2, currentGuests: 2, orderId: "#1046", orderTotal: 78.25, duration: "32m" },
    { id: 4, number: 4, status: "reserved", capacity: 6, currentGuests: 0, orderId: null, orderTotal: 0, duration: null, reservedFor: "18:00" },
    { id: 5, number: 5, status: "available", capacity: 4, currentGuests: 0, orderId: null, orderTotal: 0, duration: null },
    { id: 6, number: 6, status: "occupied", capacity: 4, currentGuests: 4, orderId: "#1045", orderTotal: 125.50, duration: "1h 12m" },
    { id: 7, number: 7, status: "available", capacity: 2, currentGuests: 0, orderId: null, orderTotal: 0, duration: null },
    { id: 8, number: 8, status: "occupied", capacity: 6, currentGuests: 5, orderId: "#1044", orderTotal: 89.00, duration: "28m" },
    { id: 9, number: 9, status: "available", capacity: 4, currentGuests: 0, orderId: null, orderTotal: 0, duration: null },
    { id: 10, number: 10, status: "reserved", capacity: 8, currentGuests: 0, orderId: null, orderTotal: 0, duration: null, reservedFor: "19:30" },
    { id: 11, number: 11, status: "occupied", capacity: 2, currentGuests: 2, orderId: "#1043", orderTotal: 54.20, duration: "18m" },
    { id: 12, number: 12, status: "available", capacity: 4, currentGuests: 0, orderId: null, orderTotal: 0, duration: null },
    { id: 13, number: 13, status: "available", capacity: 6, currentGuests: 0, orderId: null, orderTotal: 0, duration: null },
    { id: 14, number: 14, status: "occupied", capacity: 4, currentGuests: 3, orderId: "#1042", orderTotal: 67.30, duration: "55m" },
    { id: 15, number: 15, status: "available", capacity: 2, currentGuests: 0, orderId: null, orderTotal: 0, duration: null },
    { id: 16, number: 16, status: "available", capacity: 4, currentGuests: 0, orderId: null, orderTotal: 0, duration: null }
  ];

  const getStatusConfig = (status) => {
    const configs = {
      available: {
        badge: "bg-green-100 text-green-800 border-green-200",
        bg: "bg-green-50",
        border: "border-green-200",
        label: "Available"
      },
      occupied: {
        badge: "bg-red-100 text-red-800 border-red-200",
        bg: "bg-red-50",
        border: "border-red-200",
        label: "Occupied"
      },
      reserved: {
        badge: "bg-yellow-100 text-yellow-800 border-yellow-200",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        label: "Reserved"
      }
    };
    return configs[status] || configs.available;
  };

  const stats = {
    total: tables.length,
    available: tables.filter(t => t.status === "available").length,
    occupied: tables.filter(t => t.status === "occupied").length,
    reserved: tables.filter(t => t.status === "reserved").length
  };

  return (
    <Layout>
    <div className="flex h-screen bg-background">
      {/* Tables Grid */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Tables</h1>
          <p className="text-muted-foreground">Monitor and manage table status</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="glass border-border">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Total Tables</div>
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            </CardContent>
          </Card>
          <Card className="glass border-border">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Available</div>
              <div className="text-2xl font-bold text-green-600">{stats.available}</div>
            </CardContent>
          </Card>
          <Card className="glass border-border">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Occupied</div>
              <div className="text-2xl font-bold text-red-600">{stats.occupied}</div>
            </CardContent>
          </Card>
          <Card className="glass border-border">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Reserved</div>
              <div className="text-2xl font-bold text-yellow-600">{stats.reserved}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map(table => {
            const statusConfig = getStatusConfig(table.status);
            return (
              <Card
                key={table.id}
                className={`glass glass-hover cursor-pointer border-2 ${statusConfig.border} ${statusConfig.bg} ${
                  selectedTable?.id === table.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedTable(table)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-2xl font-bold text-foreground">
                      Table {table.number}
                    </div>
                    <Badge className={statusConfig.badge}>
                      {statusConfig.label}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{table.currentGuests}/{table.capacity} guests</span>
                    </div>
                    {table.status === "occupied" && (
                      <>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{table.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          <DollarSign className="h-4 w-4" />
                          <span>${table.orderTotal.toFixed(2)}</span>
                        </div>
                      </>
                    )}
                    {table.status === "reserved" && (
                      <div className="text-sm text-muted-foreground">
                        Reserved for {table.reservedFor}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Details Sidebar */}
      {selectedTable && (
        <div className="w-96 bg-card border-l border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              Table {selectedTable.number}
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setSelectedTable(null)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <Card className="glass border-border mb-4">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge className={getStatusConfig(selectedTable.status).badge}>
                  {getStatusConfig(selectedTable.status).label}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Capacity:</span>
                <span className="font-semibold text-foreground">{selectedTable.capacity} people</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Current Guests:</span>
                <span className="font-semibold text-foreground">{selectedTable.currentGuests}</span>
              </div>
            </CardContent>
          </Card>

          {selectedTable.status === "occupied" && (
            <>
              <Card className="glass border-border mb-4">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">Order Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Order ID:</span>
                    <span className="font-semibold text-foreground">{selectedTable.orderId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-semibold text-foreground">{selectedTable.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-bold text-lg text-foreground">
                      ${selectedTable.orderTotal.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Button className="w-full neon-glow">
                  View Order
                </Button>
                <Button variant="outline" className="w-full">
                  Add Items
                </Button>
                <Button variant="outline" className="w-full text-destructive hover:bg-destructive hover:text-destructive-foreground">
                  Clear Table
                </Button>
              </div>
            </>
          )}

          {selectedTable.status === "available" && (
            <div className="space-y-2">
              <Button className="w-full neon-glow">
                Seat Guests
              </Button>
              <Button variant="outline" className="w-full">
                Reserve Table
              </Button>
            </div>
          )}

          {selectedTable.status === "reserved" && (
            <>
              <Card className="glass border-border mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Reserved For:</span>
                    <span className="font-semibold text-foreground">{selectedTable.reservedFor}</span>
                  </div>
                </CardContent>
              </Card>
              <div className="space-y-2">
                <Button className="w-full neon-glow">
                  Seat Guests
                </Button>
                <Button variant="outline" className="w-full text-destructive hover:bg-destructive hover:text-destructive-foreground">
                  Cancel Reservation
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
    </Layout>
  );
};
export default Tables;
