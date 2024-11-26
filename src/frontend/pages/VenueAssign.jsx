import React, { useState, useEffect } from 'react';
import './VenueAssign.css';

const VenueAssign = () => {
  const [employees, setEmployees] = useState([
    { id: 1, name: 'John Doe', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { id: 2, name: 'Jane Smith', image: 'https://randomuser.me/api/portraits/women/1.jpg' },
  ]);

  const [roles, setRoles] = useState(['All', 'Serving', 'Registry', 'Bar', 'Kitchen']);
  const [activeRole, setActiveRole] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const handleDragStart = (e, employee) => {
    e.dataTransfer.setData('application/json', JSON.stringify(employee));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const employee = JSON.parse(e.dataTransfer.getData('application/json'));
    e.currentTarget.innerHTML = `
      <img src="${employee.image}" alt="${employee.name}" />
      <span>${employee.name}</span>
    `;
  };

  const handleRoleClick = (role) => {
    setActiveRole(role);
  };

  const handleAddRole = () => {
    const newRoleName = prompt('Enter new role name:');
    if (newRoleName) {
      setRoles([...roles, newRoleName]);
    }
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/menu">Menu</a></li>
          <li><a href="/orders">Orders</a></li>
          <li><a href="/credits">Credits</a></li>
          <li><a href="/assign" className="active">Assign</a></li>
          <li><a href="/notifications">Notifications</a></li>
          <li><a href="/messages">Messages</a></li>
          <li><a href="/account">Account</a></li>
          <li><a href="/settings">Settings</a></li>
        </ul>
      </nav>

      <div className="container">
        <h1>Assign Employees</h1>
        
        <div className="top-buttons">
          <button className="create-employee-btn">
            <span className="plus">+</span>
            Create Employee
          </button>
          <button className="create-roster-btn">Create Roster</button>
        </div>
        
        <div className="assign-container">
          <div className="employee-list">
            <input
              type="text"
              className="search-bar"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {filteredEmployees.map(employee => (
              <div
                key={employee.id}
                className="employee-card"
                draggable="true"
                onDragStart={(e) => handleDragStart(e, employee)}
              >
                <img src={employee.image} alt={employee.name} />
                <span>{employee.name}</span>
              </div>
            ))}
          </div>
          
          <div className="assignment-area">
            <div className="role-selector">
              {roles.map(role => (
                <button
                  key={role}
                  className={`role-btn ${activeRole === role ? 'active' : ''}`}
                  onClick={() => handleRoleClick(role)}
                >
                  {role}
                </button>
              ))}
              <button className="add-role-btn" onClick={handleAddRole}>+</button>
            </div>
            
            <div className="assignment-grid">
              {['Table 1', 'Table 2', 'Bar 1', 'Kitchen'].map(slot => (
                <div
                  key={slot}
                  className="assignment-slot"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <h3>{slot}</h3>
                  <p>Drop employee here</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueAssign;