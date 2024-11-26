import React, { useState } from 'react';

const BasicInfoForm = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    type: '',
    address: '',
    phone: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl mb-4">Venue Information</h2>
      
      <div className="mb-4">
        <label className="block mb-2">Venue Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Venue Type</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({...formData, type: e.target.value})}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Type</option>
          <option value="restaurant">Restaurant</option>
          <option value="bar">Bar</option>
          <option value="club">Club</option>
          <option value="cafe">Cafe</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Address</label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Phone Number</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Next Step
      </button>
    </form>
  );
};

export default BasicInfoForm;