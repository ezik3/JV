import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

export default function SignupForm({ type, onSubmit, children }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    fullName: '',
    venueName: '',
    address: '',
    businessLicense: '',
    businessEmail: '',
    venueType: '',
    country: '',
    latitude: '',
    longitude: ''
  });
  const history = useHistory();

  console.log('SignupForm rendered');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted');
    console.log('Signup submitted:', formData);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // This else block can be removed if you always pass onSubmit
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, role: type }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Registration successful:', data);
          history.push('/home');
        } else {
          const errorData = await response.json();
          console.error('Registration failed:', errorData);
        }
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        required
      />
      <input
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm Password"
        required
      />
      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone number"
        required
      />
      <input
        type="text"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        placeholder="Full Name"
        required
      />
      {type === 'venue' && (
        <>
          <input
            type="text"
            name="venueName"
            value={formData.venueName}
            onChange={handleChange}
            placeholder="Venue Name"
            required
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Venue Address"
            required
          />
          <input
            type="text"
            name="businessLicense"
            value={formData.businessLicense}
            onChange={handleChange}
            placeholder="Business License Number"
            required
          />
          <input
            type="email"
            name="businessEmail"
            value={formData.businessEmail}
            onChange={handleChange}
            placeholder="Business Email"
            required
          />
          <select
            name="venueType"
            value={formData.venueType}
            onChange={handleChange}
            required
          >
            <option value="">Select Venue Type</option>
            <option value="nightclub">Nightclub</option>
            <option value="bar">Bar</option>
            <option value="restaurant">Restaurant</option>
            <option value="concert_hall">Concert Hall</option>
          </select>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country"
            required
          />
          <input
            type="text"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            placeholder="Latitude"
            required
          />
          <input
            type="text"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            placeholder="Longitude"
            required
          />
        </>
      )}
      {children && children({ formData, setFormData })}
      <button type="submit">Sign Up</button>
    </form>
  );
}