import React, { useState } from 'react';

const POSSettingsForm = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState(initialData || {
    currency: 'JV',
    acceptStablecoin: true,
    tableCount: 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl mb-4">POS Configuration</h2>
      
      <div className="mb-4">
        <label className="block mb-2">Number of Tables</label>
        <input
          type="number"
          value={formData.tableCount}
          onChange={(e) => setFormData({...formData, tableCount: parseInt(e.target.value)})}
          className="w-full p-2 border rounded"
          min="0"
          required
        />
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.acceptStablecoin}
            onChange={(e) => setFormData({...formData, acceptStablecoin: e.target.checked})}
            className="mr-2"
          />
          Accept JV Stablecoin
        </label>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Next Step
        </button>
      </div>
    </form>
  );
};

export default POSSettingsForm;