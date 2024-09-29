import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface CarType {
  id: number;
  typeName: string;
}

interface Manufacturer {
  id: number;
  manufacturerName: string;
  models: string[];
}

const CategoryManager: React.FC = () => {
  const [carTypes, setCarTypes] = useState<CarType[]>([]);
  const [newCarType, setNewCarType] = useState('');
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [newManufacturerName, setNewManufacturerName] = useState('');
  const [newModels, setNewModels] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch car types and manufacturers on component mount
  useEffect(() => {
    fetchCarTypes();
    fetchManufacturersWithModels();
  }, []);

  const fetchCarTypes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/Public/Cartype');
      setCarTypes(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching car types');
    }
  };

  const fetchManufacturersWithModels = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/Public/ManufacturersWithModels');
      setManufacturers(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching manufacturers with models');
    }
  };

  // Function to add a new car type
  const handleAddCarType = async () => {
    if (newCarType.trim() === '') {
      setError('Car type name cannot be empty');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/Admin/AddCarType', {
        typeName: newCarType,
      });
      setCarTypes([...carTypes, response.data]);
      setNewCarType('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error adding car type');
    }
  };

  // Function to add a new manufacturer with models
  const handleAddManufacturerWithModels = async () => {
    if (newManufacturerName.trim() === '' || newModels.length === 0) {
      setError('Manufacturer name and at least one model are required');
      return;
    }
  
    // Log the data being sent to the API
    console.log({
      manufacturerName: newManufacturerName,
      models: newModels,
    });
  
    try {
      const response = await axios.post('http://localhost:5000/api/Admin/AddManufacturerWithModels', {
        manufacturerName: newManufacturerName,
        models: newModels,
      });
  
      // Check if the response contains the expected data
      console.log('API Response:', response.data);
  
      setManufacturers([...manufacturers, response.data]);
      setNewManufacturerName('');
      setNewModels([]);
    } catch (err: any) {
      console.error('Error response:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Error adding manufacturer and models');
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Category Manager</h2>

      {error && <p className="text-red-500">{error}</p>}

      {/* Add Car Type */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Add New Car Type</h3>
        <input
          type="text"
          placeholder="New car type"
          value={newCarType}
          onChange={(e) => setNewCarType(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleAddCarType}
          className="ml-2 p-2 bg-blue-500 text-white rounded"
        >
          Add Car Type
        </button>
      </div>

      {/* Display Car Types */}
      <h3 className="text-lg font-semibold">Car Types</h3>
      <ul className="mb-6 space-y-4">
        {carTypes.map((carType) => (
          <li key={carType.id}>{carType.typeName}</li>
        ))}
      </ul>

      {/* Add Manufacturer with Models */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Add New Manufacturer with Models</h3>
        <input
          type="text"
          placeholder="Manufacturer name"
          value={newManufacturerName}
          onChange={(e) => setNewManufacturerName(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Enter models (comma-separated)"
          value={newModels.join(', ')}
          onChange={(e) => setNewModels(e.target.value.split(',').map(model => model.trim()))}
          className="p-2 border border-gray-300 rounded mt-2"
        />
        <button
          onClick={handleAddManufacturerWithModels}
          className="ml-2 p-2 bg-green-500 text-white rounded"
        >
          Add Manufacturer with Models
        </button>
      </div>

      {/* Display Manufacturers with Models */}
      <h3 className="text-lg font-semibold">Manufacturers and Models</h3>
     <ul className="space-y-4">
  {manufacturers.map((manufacturer) => (
    <li key={manufacturer.id}>
      <strong>{manufacturer.manufacturerName}</strong>
      <ul className="ml-4 list-disc">
        {manufacturer.models.map((model, index) => (
          <li key={index}>{model}</li> 
        ))}
      </ul>
    </li>
  ))}
</ul>

    </div>
  );
};

export default CategoryManager;
