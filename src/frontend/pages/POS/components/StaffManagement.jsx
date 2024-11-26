import React, { useState } from 'react';
import '../styles/StaffManagement.css';  // Update this line

const StaffManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Sample staff data - in a real app, this would come from your backend
  const [staffMembers] = useState([
    {
      id: 1,
      name: "John Doe",
      initials: "JD",
      role: "Head Bartender",
      status: "active",
      performance: "98",
      hoursPerWeek: "32",
      schedule: [
        { day: "Mon", time: "2PM - 10PM" },
        { day: "Wed", time: "2PM - 10PM" },
        { day: "Fri", time: "4PM - 12AM" }
      ]
    },
    // Add more staff members as needed
  ]);

  const sidebarLinks = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/pos", label: "POS" },
    { path: "/menu-management", label: "Menu Management" },
    { path: "/inventory", label: "Inventory" },
    { path: "/orders", label: "Orders" },
    { path: "/staff", label: "Staff" },
    { path: "/customers", label: "Customers" },
    { path: "/analytics", label: "Analytics" },
    { path: "/marketing", label: "Marketing" },
    { path: "/reports", label: "Reports" },
    { path: "/settings", label: "Settings" }
  ];

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleRoleFilter = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleStatusFilter = (event) => {
    setSelectedStatus(event.target.value);
  };

  const openScheduleModal = (staff) => {
    setSelectedStaff(staff);
    setShowModal(true);
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="logo">JointVibe POS</div>
        <nav className="nav-menu">
          {sidebarLinks.map((link) => (
            <li key={link.path} className="nav-item">
              <a 
                href={link.path} 
                className={`nav-link ${window.location.pathname === link.path ? 'active' : ''}`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <div className="staff-header">
          <h1>Staff Management</h1>
          <button className="add-staff-btn">
            <i className="fas fa-plus"></i>
            Add New Staff
          </button>
        </div>

        <div className="staff-filters">
          <input 
            type="text" 
            className="filter-input" 
            placeholder="Search staff..."
            onChange={handleSearch}
          />
          <select className="filter-input" onChange={handleRoleFilter}>
            <option value="all">All Roles</option>
            <option value="bartender">Bartender</option>
            <option value="server">Server</option>
            <option value="manager">Manager</option>
          </select>
          <select className="filter-input" onChange={handleStatusFilter}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="staff-grid">
          {staffMembers
            .filter(staff => {
              const matchesSearch = staff.name.toLowerCase().includes(searchTerm);
              const matchesRole = selectedRole === 'all' || staff.role.toLowerCase().includes(selectedRole);
              const matchesStatus = selectedStatus === 'all' || staff.status === selectedStatus;
              return matchesSearch && matchesRole && matchesStatus;
            })
            .map(staff => (
              <StaffCard 
                key={staff.id} 
                staff={staff} 
                onScheduleClick={() => openScheduleModal(staff)}
              />
            ))}
        </div>
      </main>

      {showModal && (
        <ScheduleModal 
          staff={selectedStaff}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

// Staff Card Component
const StaffCard = ({ staff, onScheduleClick }) => (
  <div className="staff-card">
    <div className="staff-actions">
      <button className="action-btn">
        <i className="fas fa-edit"></i>
      </button>
      <button className="action-btn">
        <i className="fas fa-trash"></i>
      </button>
    </div>
    <div className="staff-avatar">{staff.initials}</div>
    <h3 className="staff-name">{staff.name}</h3>
    <div className="staff-role">{staff.role}</div>
    <div className={`staff-status status-${staff.status}`}>{staff.status}</div>
    <div className="staff-stats">
      <div className="stat">
        <div className="stat-value">{staff.performance}%</div>
        <div className="stat-label">Performance</div>
      </div>
      <div className="stat">
        <div className="stat-value">{staff.hoursPerWeek}</div>
        <div className="stat-label">Hours/Week</div>
      </div>
    </div>
    <div className="schedule-preview" onClick={onScheduleClick}>
      {staff.schedule.map((shift, index) => (
        <div key={index} className="schedule-day">
          <span className="day-name">{shift.day}</span>
          <span>{shift.time}</span>
        </div>
      ))}
    </div>
  </div>
);

// Schedule Modal Component
const ScheduleModal = ({ staff, onClose }) => (
  <div className="modal-overlay" style={{ display: 'flex' }}>
    <div className="modal">
      <div className="modal-header">
        <h2 className="staff-edit-name">
          Edit Schedule - <span>{staff.name}</span>
        </h2>
        <button className="close-modal" onClick={onClose}>&times;</button>
      </div>
      <div className="schedule-edit">
        {staff.schedule.map((shift, index) => (
          <div key={index} className="schedule-row">
            <select className="schedule-input" defaultValue={shift.day}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <input 
              type="text" 
              className="schedule-input" 
              defaultValue={shift.time}
              placeholder="e.g. 9AM - 5PM" 
            />
            <button className="remove-shift">Remove</button>
          </div>
        ))}
      </div>
      <button className="add-shift">Add New Shift</button>
    </div>
  </div>
);

export default StaffManagement;