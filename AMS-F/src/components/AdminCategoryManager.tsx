import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { handleErrorResult } from '../util/TostMessage';
import api from '../util/api';

interface CarType {
  id: number;
  typeName: string;
}

interface Manufacturer {
  id: number;
  manufacturerName: string;
}

interface Model {
  modelId: number;
  modelName: string;
  manufacturerId: number;
  manufacturerName: string;
}

interface TableComponentProps {
  title: string;
  data: any //eslint-disable-line
  headers: string[];
  onDelete: (id: number) => void;
}


const CategoryManager: React.FC = () => {
  const [carTypes, setCarTypes] = useState<CarType[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [newCarType, setNewCarType] = useState('');
  const [newManufacturer, setNewManufacturer] = useState('');
  const [newModel, setNewModel] = useState('');
  const [selectedManufacturerId, setSelectedManufacturerId] = useState<number | ''>('');

  const [activeTab, setActiveTab] = useState<'carTypes' | 'manufacturers' | 'models'>('carTypes');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const carTypesRes = await axios.get('http://localhost:5000/api/Public/GetAllCarTypes');
      setCarTypes(carTypesRes.data);

      const manufacturersRes = await axios.get('http://localhost:5000/api/Public/GetAllManufacturers');
      setManufacturers(manufacturersRes.data);

      const modelsRes = await axios.get('http://localhost:5000/api/Public/GetAllModels');
      setModels(modelsRes.data);

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'An error occurred';
        handleErrorResult(errorMessage);
      } else {
        handleErrorResult('An unexpected error occurred');
      }
    }
  };

  const handleAddCarType = async () => {
    if (newCarType.trim() === '') {
      handleErrorResult('Car type name cannot be empty');
      return;
    }

    try {
      await api.post('http://localhost:5000/api/Admin/AddCarType', {
        typeName: newCarType,
      });
      setNewCarType('');
      await fetchCategories();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'An error occurred';
        handleErrorResult(errorMessage);
      } else {
        handleErrorResult('An unexpected error occurred');
      }
    }
  };

  const handleAddManufacturer = async () => {
    if (newManufacturer.trim() === '') {
      handleErrorResult('Manufacturer name cannot be empty');
      return;
    }

    try {
      await api.post('http://localhost:5000/api/Admin/AddManufacturer', {
        manufacturerName: newManufacturer,
      });
      setNewManufacturer('');
      await fetchCategories();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'An error occurred';
        handleErrorResult(errorMessage);
      } else {
        handleErrorResult('An unexpected error occurred');
      }
    }
  };

  const handleAddModel = async () => {
    if (newModel.trim() === '' || selectedManufacturerId === '') {
      handleErrorResult('Model name and manufacturer are required');
      return;
    }

    try {
      await api.post('http://localhost:5000/api/Admin/AddModel', {
        modelName: newModel,
        manufacturerId: selectedManufacturerId,
      });
      setNewModel('');
      setSelectedManufacturerId('');
      await fetchCategories();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'An error occurred';
        handleErrorResult(errorMessage);
      } else {
        handleErrorResult('An unexpected error occurred');
      }
    }
  };


  const handleDelete = async (endpoint: string, id: number) => {
    try {
      await api.delete(`http://localhost:5000/api/Admin/${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        data: id,
      });
      
      await fetchCategories();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'An error occurred';
        handleErrorResult(errorMessage);
      } else {
        handleErrorResult('An unexpected error occurred');
      }
    }
  };
  

  const renderTabContent = () => {
    switch (activeTab) {
      case 'carTypes':
        return (
          <>
            <TableComponent
              title="Car Types"
              data={carTypes}
              headers={['typeName']}
              onDelete={(id: number) => handleDelete('DeleteCarType', id)}
            />
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="New car type"
                value={newCarType}
                onChange={(e) => setNewCarType(e.target.value)}
                className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
              <button
                onClick={handleAddCarType}
                className="p-2 text-[#1D2945] font-semibold bg-[#AABFEF] rounded-lg hover:bg-[#8BAEFF]"
              >
                Add
              </button>
            </div>
          </>
        );
      case 'manufacturers':
        return (
          <>
            <TableComponent
              title="Manufacturers"
              data={manufacturers}
              headers={['manufacturerName']}
              onDelete={(id: number) => handleDelete('DeleteManufacturer', id)}
            />
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="New manufacturer"
                value={newManufacturer}
                onChange={(e) => setNewManufacturer(e.target.value)}
                className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
              <button
                onClick={handleAddManufacturer}
                className="p-2 text-[#1D2945] font-semibold bg-[#AABFEF] rounded-lg hover:bg-[#8BAEFF]"
              >
                Add
              </button>
            </div>
          </>
        );
      case 'models':
        return (
          <>
            <TableComponent
              title="Models"
              data={models}
              headers={['modelName', 'manufacturerName']}
              onDelete={(id: number) => handleDelete('DeleteModel', id)}
            />
            <div className="flex flex-col space-y-2">
              <select
                value={selectedManufacturerId}
                onChange={(e) => setSelectedManufacturerId(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <option value="">Select Manufacturer</option>
                {manufacturers.map((manufacturer) => (
                  <option key={manufacturer.id} value={manufacturer.id}>
                    {manufacturer.manufacturerName}
                  </option>
                ))}
              </select>
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  placeholder="New model"
                  value={newModel}
                  onChange={(e) => setNewModel(e.target.value)}
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
                <button
                  onClick={handleAddModel}
                  className="p-2 text-[#1D2945] font-semibold bg-[#AABFEF] rounded-lg hover:bg-[#8BAEFF]"
                >
                  Add
                </button>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const TableComponent:React.FC<TableComponentProps>  = ({ title, data, headers, onDelete }) => (
    <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
      <h3 className="mb-4 text-xl font-semibold">{title}</h3>
      <table className="min-w-full border border-collapse table-auto">
        <thead>
          <tr>
            {headers.map((header: string, index: number) => (
              <th key={index} className="px-4 py-2 text-left bg-gray-200 border">{header}</th>
            ))}
            <th className="px-4 py-2 bg-gray-200 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item: any, idx: number) => ( // eslint-disable-line
            <tr key={item.id || item.modelId} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
              {headers.map((header: string, index: number) => (
                <td key={index} className="px-4 py-2 border">{item[header]}</td>
              ))}
              <td className="px-4 py-2 border">
                <button
                  onClick={() => onDelete(item.id || item.modelId)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container p-8 mx-auto">
      <h2 className="mb-8 text-3xl font-semibold">Categories</h2>

      {/* Tabs */}
      <div className="flex mb-8 space-x-4">
        <button
          onClick={() => setActiveTab('carTypes')}
          className={`p-2 px-4 ${activeTab === 'carTypes' ? 'bg-[#1D2945] text-white' : 'bg-gray-300'} rounded-lg`}
        >
          Car Types
        </button>
        <button
          onClick={() => setActiveTab('manufacturers')}
          className={`p-2 ${activeTab === 'manufacturers' ? 'bg-[#1D2945] text-white' : 'bg-gray-300'} rounded-lg`}
        >
          Manufacturers
        </button>
        <button
          onClick={() => setActiveTab('models')}
          className={`p-2 ${activeTab === 'models' ? 'bg-[#1D2945] text-white' : 'bg-gray-300'} rounded-lg`}
        >
          Models
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default CategoryManager;

