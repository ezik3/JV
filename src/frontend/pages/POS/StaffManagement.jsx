// ============================================================================
// Staff Management Page - Employee & Role Management
// ============================================================================
// Route: /venue/pos/staff
// Purpose: Manage employees, roles, shifts, and permissions
// ============================================================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useEmployee } from '../../contexts';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { formatTime } from '../../lib/utils';
import { supabase } from '../../lib/supabase';

const StaffManagement = () => {
  const navigate = useNavigate();
  const { venue, isAuthenticated } = useAuth();
  const { employees, fetchEmployees } = useEmployee();

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [shifts, setShifts] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'server',
    phone: '',
  });

  // Role options
  const roles = [
    { value: 'manager', label: 'Manager', color: 'bg-purple-500' },
    { value: 'server', label: 'Server', color: 'bg-blue-500' },
    { value: 'kitchen', label: 'Kitchen', color: 'bg-orange-500' },
    { value: 'bartender', label: 'Bartender', color: 'bg-green-500' },
    { value: 'host', label: 'Host', color: 'bg-yellow-500' },
  ];

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/venue/pos/auth/manager');
    }
  }, [isAuthenticated, navigate]);

  // Fetch employees and shifts
  useEffect(() => {
    const loadData = async () => {
      if (!venue?.id) return;

      try {
        setLoading(true);
        await fetchEmployees?.();
        await fetchShifts();
      } catch (error) {
        console.error('Error loading staff data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [venue?.id]);

  // Fetch shifts
  const fetchShifts = async () => {
    if (!venue?.id) return;

    try {
      const { data, error } = await supabase
        .from('employee_shifts')
        .select(`
          *,
          employees:employee_id (name, role)
        `)
        .eq('venue_id', venue.id)
        .order('clock_in', { ascending: false })
        .limit(20);

      if (error) throw error;
      setShifts(data || []);
    } catch (error) {
      console.error('Error fetching shifts:', error);
    }
  };

  // Filter employees by search
  const filteredEmployees = employees?.filter(emp =>
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Open modal for new employee
  const openNewEmployeeModal = () => {
    setEditingEmployee(null);
    setFormData({
      email: '',
      name: '',
      role: 'server',
      phone: '',
    });
    setShowEmployeeModal(true);
  };

  // Open modal for editing
  const openEditEmployeeModal = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      email: employee.email || '',
      name: employee.name || '',
      role: employee.role || 'server',
      phone: employee.phone || '',
    });
    setShowEmployeeModal(true);
  };

  // Invite/Save employee
  const saveEmployee = async () => {
    if (!formData.email || !formData.name) {
      alert('Please fill in required fields (email and name)');
      return;
    }

    try {
      if (editingEmployee) {
        // Update existing employee
        const { error } = await supabase
          .from('employees')
          .update({
            name: formData.name,
            role: formData.role,
            phone: formData.phone,
          })
          .eq('id', editingEmployee.id);

        if (error) throw error;
      } else {
        // Create new employee invitation
        const { error } = await supabase
          .from('employee_invitations')
          .insert([{
            venue_id: venue.id,
            email: formData.email,
            role: formData.role,
            invited_by: venue.manager_id,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
          }]);

        if (error) throw error;

        // TODO: Send invitation email
        alert('Employee invitation sent! They will receive an email to complete registration.');
      }

      setShowEmployeeModal(false);
      fetchEmployees?.();
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Error saving employee: ' + error.message);
    }
  };

  // Delete employee
  const deleteEmployee = async (employeeId) => {
    if (!confirm('Are you sure you want to remove this employee?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', employeeId);

      if (error) throw error;

      fetchEmployees?.();
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Error deleting employee: ' + error.message);
    }
  };

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    return roles.find(r => r.value === role)?.color || 'bg-gray-500';
  };

  // Calculate shift duration
  const calculateShiftDuration = (shift) => {
    if (!shift.clock_in) return 'N/A';

    const start = new Date(shift.clock_in);
    const end = shift.clock_out ? new Date(shift.clock_out) : new Date();
    const hours = ((end - start) / (1000 * 60 * 60)).toFixed(1);

    return `${hours} hrs`;
  };

  // Employee statistics
  const getStaffStats = () => {
    return {
      total: employees?.length || 0,
      active: shifts.filter(s => !s.clock_out).length,
      managers: employees?.filter(e => e.role === 'manager').length || 0,
      servers: employees?.filter(e => e.role === 'server').length || 0,
      kitchen: employees?.filter(e => e.role === 'kitchen').length || 0,
    };
  };

  const stats = getStaffStats();

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading staff...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Staff Management</h1>
          <p className="text-muted-foreground">Manage employees, roles, and shifts</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={openNewEmployeeModal}>Invite Employee</Button>
          <Button variant="outline" onClick={() => navigate('/venue/pos/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">On Shift</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Managers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.managers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Servers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.servers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Kitchen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.kitchen}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <Input
            type="text"
            placeholder="Search employees by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      {/* Tabs: Employees & Shifts */}
      <Tabs defaultValue="employees">
        <TabsList>
          <TabsTrigger value="employees">Employees ({stats.total})</TabsTrigger>
          <TabsTrigger value="shifts">Recent Shifts ({shifts.length})</TabsTrigger>
        </TabsList>

        {/* Employees Tab */}
        <TabsContent value="employees" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Employee Directory</CardTitle>
              <CardDescription>{filteredEmployees.length} employees</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredEmployees.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No employees found</p>
                  <Button onClick={openNewEmployeeModal}>Invite Your First Employee</Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => {
                      const isOnShift = shifts.some(s => s.employee_id === employee.id && !s.clock_out);
                      return (
                        <TableRow key={employee.id}>
                          <TableCell className="font-medium">{employee.name}</TableCell>
                          <TableCell>{employee.email}</TableCell>
                          <TableCell>{employee.phone || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge className={getRoleBadgeColor(employee.role)}>
                              {employee.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {isOnShift ? (
                              <Badge className="bg-green-500">On Shift</Badge>
                            ) : (
                              <Badge variant="outline">Off Shift</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openEditEmployeeModal(employee)}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteEmployee(employee.id)}
                              >
                                Remove
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shifts Tab */}
        <TabsContent value="shifts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Shifts</CardTitle>
              <CardDescription>Last 20 shifts</CardDescription>
            </CardHeader>
            <CardContent>
              {shifts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No shift records found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Clock In</TableHead>
                      <TableHead>Clock Out</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shifts.map((shift) => (
                      <TableRow key={shift.id}>
                        <TableCell className="font-medium">
                          {shift.employees?.name || 'Unknown'}
                        </TableCell>
                        <TableCell>
                          <Badge className={getRoleBadgeColor(shift.employees?.role)}>
                            {shift.employees?.role || 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatTime(shift.clock_in)}</TableCell>
                        <TableCell>{shift.clock_out ? formatTime(shift.clock_out) : 'Active'}</TableCell>
                        <TableCell>{calculateShiftDuration(shift)}</TableCell>
                        <TableCell>
                          {!shift.clock_out ? (
                            <Badge className="bg-green-500">Active</Badge>
                          ) : (
                            <Badge variant="outline">Completed</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Employee Modal */}
      {showEmployeeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>
                    {editingEmployee ? 'Edit Employee' : 'Invite New Employee'}
                  </CardTitle>
                  <CardDescription>
                    {editingEmployee ? 'Update employee information' : 'Send invitation to join your team'}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEmployeeModal(false)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="employee@example.com"
                  disabled={!!editingEmployee}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="flex-1" onClick={saveEmployee}>
                  {editingEmployee ? 'Update' : 'Send Invitation'}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowEmployeeModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
