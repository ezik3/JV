import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Mail, Phone, Star } from 'lucide-react';
import './nocturne.css';

const Staff = () => {
  const staffMembers = [
    {
      id: 1,
      name: "John Smith",
      role: "Manager",
      email: "john.smith@restaurant.com",
      phone: "+1 234-567-8901",
      status: "active",
      performance: 4.8,
      ordersCompleted: 245,
      shiftsThisWeek: 5
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Waiter",
      email: "sarah.j@restaurant.com",
      phone: "+1 234-567-8902",
      status: "active",
      performance: 4.6,
      ordersCompleted: 189,
      shiftsThisWeek: 4
    },
    {
      id: 3,
      name: "Mike Chen",
      role: "Chef",
      email: "mike.chen@restaurant.com",
      phone: "+1 234-567-8903",
      status: "active",
      performance: 4.9,
      ordersCompleted: 312,
      shiftsThisWeek: 5
    },
    {
      id: 4,
      name: "Emily Davis",
      role: "Waiter",
      email: "emily.d@restaurant.com",
      phone: "+1 234-567-8904",
      status: "off-duty",
      performance: 4.7,
      ordersCompleted: 178,
      shiftsThisWeek: 3
    },
    {
      id: 5,
      name: "David Wilson",
      role: "Bartender",
      email: "david.w@restaurant.com",
      phone: "+1 234-567-8905",
      status: "active",
      performance: 4.5,
      ordersCompleted: 156,
      shiftsThisWeek: 4
    },
    {
      id: 6,
      name: "Lisa Brown",
      role: "Sous Chef",
      email: "lisa.b@restaurant.com",
      phone: "+1 234-567-8906",
      status: "active",
      performance: 4.8,
      ordersCompleted: 267,
      shiftsThisWeek: 5
    }
  ];

  const weeklyRoster = [
    { id: 1, name: "John Smith", role: "Manager", mon: "09:00-17:00", tue: "09:00-17:00", wed: "09:00-17:00", thu: "09:00-17:00", fri: "09:00-17:00", sat: "-", sun: "-" },
    { id: 2, name: "Sarah Johnson", role: "Waiter", mon: "11:00-20:00", tue: "-", wed: "11:00-20:00", thu: "11:00-20:00", fri: "11:00-20:00", sat: "-", sun: "-" },
    { id: 3, name: "Mike Chen", role: "Chef", mon: "10:00-18:00", tue: "10:00-18:00", wed: "10:00-18:00", thu: "10:00-18:00", fri: "10:00-18:00", sat: "-", sun: "-" },
    { id: 4, name: "Emily Davis", role: "Waiter", mon: "-", tue: "17:00-23:00", wed: "17:00-23:00", thu: "17:00-23:00", fri: "-", sat: "17:00-23:00", sun: "-" },
    { id: 5, name: "David Wilson", role: "Bartender", mon: "18:00-02:00", tue: "18:00-02:00", wed: "-", thu: "18:00-02:00", fri: "18:00-02:00", sat: "-", sun: "-" },
    { id: 6, name: "Lisa Brown", role: "Sous Chef", mon: "10:00-18:00", tue: "10:00-18:00", wed: "10:00-18:00", thu: "10:00-18:00", fri: "10:00-18:00", sat: "-", sun: "-" }
  ];

  const getRoleColor = (role) => {
    const colors = {
      'Manager': 'bg-purple-100 text-purple-800 border-purple-200',
      'Waiter': 'bg-blue-100 text-blue-800 border-blue-200',
      'Chef': 'bg-red-100 text-red-800 border-red-200',
      'Sous Chef': 'bg-orange-100 text-orange-800 border-orange-200',
      'Bartender': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[role] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': 'bg-green-100 text-green-800 border-green-200',
      'off-duty': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || colors['off-duty'];
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Staff Management</h1>
          <p className="text-muted-foreground">Manage your team and schedules</p>
        </div>
        <Button className="neon-glow gap-2">
          <Plus className="h-4 w-4" />
          Add Staff
        </Button>
      </div>

      <Tabs defaultValue="staff" className="w-full">
        <TabsList className="glass border-border">
          <TabsTrigger value="staff">Staff List</TabsTrigger>
          <TabsTrigger value="roster">Weekly Roster</TabsTrigger>
        </TabsList>

        {/* Staff List View */}
        <TabsContent value="staff" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {staffMembers.map((staff) => (
              <Card key={staff.id} className="glass border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-foreground">{staff.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getRoleColor(staff.role)}>
                          {staff.role}
                        </Badge>
                        <Badge className={getStatusColor(staff.status)}>
                          {staff.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{staff.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{staff.phone}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Performance</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold text-foreground">{staff.performance}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="text-muted-foreground">Orders</div>
                        <div className="font-semibold text-foreground">{staff.ordersCompleted}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Shifts</div>
                        <div className="font-semibold text-foreground">{staff.shiftsThisWeek}/week</div>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" size="sm">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Weekly Roster View */}
        <TabsContent value="roster" className="mt-6">
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Weekly Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Role</th>
                      <th className="text-center py-3 px-4 font-semibold text-foreground">Mon</th>
                      <th className="text-center py-3 px-4 font-semibold text-foreground">Tue</th>
                      <th className="text-center py-3 px-4 font-semibold text-foreground">Wed</th>
                      <th className="text-center py-3 px-4 font-semibold text-foreground">Thu</th>
                      <th className="text-center py-3 px-4 font-semibold text-foreground">Fri</th>
                      <th className="text-center py-3 px-4 font-semibold text-foreground">Sat</th>
                      <th className="text-center py-3 px-4 font-semibold text-foreground">Sun</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weeklyRoster.map((staff, index) => (
                      <tr
                        key={staff.id}
                        className={`border-b border-border ${
                          index % 2 === 0 ? 'bg-secondary/20' : ''
                        }`}
                      >
                        <td className="py-3 px-4 font-medium text-foreground">{staff.name}</td>
                        <td className="py-3 px-4">
                          <Badge className={getRoleColor(staff.role)}>
                            {staff.role}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-sm ${staff.mon === '-' ? 'text-muted-foreground' : 'text-foreground font-medium bg-secondary/50 px-2 py-1 rounded'}`}>
                            {staff.mon}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-sm ${staff.tue === '-' ? 'text-muted-foreground' : 'text-foreground font-medium bg-secondary/50 px-2 py-1 rounded'}`}>
                            {staff.tue}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-sm ${staff.wed === '-' ? 'text-muted-foreground' : 'text-foreground font-medium bg-secondary/50 px-2 py-1 rounded'}`}>
                            {staff.wed}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-sm ${staff.thu === '-' ? 'text-muted-foreground' : 'text-foreground font-medium bg-secondary/50 px-2 py-1 rounded'}`}>
                            {staff.thu}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-sm ${staff.fri === '-' ? 'text-muted-foreground' : 'text-foreground font-medium bg-secondary/50 px-2 py-1 rounded'}`}>
                            {staff.fri}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-sm ${staff.sat === '-' ? 'text-muted-foreground' : 'text-foreground font-medium bg-secondary/50 px-2 py-1 rounded'}`}>
                            {staff.sat}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-sm ${staff.sun === '-' ? 'text-muted-foreground' : 'text-foreground font-medium bg-secondary/50 px-2 py-1 rounded'}`}>
                            {staff.sun}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Staff;
