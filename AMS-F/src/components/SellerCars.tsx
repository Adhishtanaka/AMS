import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { handleErrorResult } from '../util/TostMessage';
import api from '../util/api';

interface Car {
  id: number;
  carTitle: string;
  carDescription: string;
  img: string;
  modelId: number;
  performanceClassId: number;
  year: number;
  price: number;
  carTypeId: number;
  sellerId: number;
}

interface Model {
  modelId: number;
  modelName: string;
  manufacturerId: number;
  manufacturerName: string;
}



const SellerCars: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch cars
      const carsResponse = await api.get<Car[]>('http://localhost:5000/api/Seller/GetCarsBySellerId');
      setCars(carsResponse.data);
      
      // Fetch models
      const modelsResponse = await api.get<Model[]>('http://localhost:5000/api/Public/GetAllModels');
      setModels(modelsResponse.data);
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'An error occurred';
        handleErrorResult(errorMessage);
      } else {
        handleErrorResult('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteCar = async (carId: number) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await api.delete(`http://localhost:5000/api/Seller/DeleteCar?carId=${carId}`);
        fetchData();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.message || 'An error occurred';
          handleErrorResult(errorMessage);
        } else {
          handleErrorResult('An unexpected error occurred');
        }
      }
    }
  };

  const getModelName = (modelId: number) => {
    const model = models.find(m => m.modelId === modelId);
    return model ? model.modelName : 'Unknown';
  };

  if (loading) {
    return <div>Loading cars...</div>;
  }

  return (
    <div className="container mx-auto px-4 mb-48">
      <button
        className="mb-6 text-white bg-[#1D2945] hover:bg-[#3d517f] font-semibold p-1 px-2 rounded"
        onClick={() => navigate('/seller/add-car')}
      >
        Add Car
      </button>
      {cars.length === 0 ? (
        <div>No cars found for this seller.</div>
      ) : (
        <table className="min-w-full table-auto border-collapse bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 border text-left font-semibold text-black">Car Title</th>
              <th className="px-4 py-2 border text-left font-semibold text-black">Model</th>
              <th className="px-4 py-2 border text-left font-semibold text-black">Year</th>
              <th className="px-4 py-2 border text-left font-semibold text-black">Price</th>
              <th className="px-4 py-2 border text-left font-semibold text-black">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {cars.map((car) => (
              <tr key={car.id}>
                <td className="px-4 py-2 border">
                  <Link to={`car-details/${car.id}`} className="text-gray-600 hover:underline">
                    {car.carTitle}
                  </Link>
                </td>
                <td className="px-4 py-1 border text-gray-800">{getModelName(car.modelId)}</td>
                <td className="px-4 py-1 border text-gray-800">{car.year}</td>
                <td className="px-4 py-1 border text-gray-800">${car.price}</td>
                <td className="px-4 py-1 border text-gray-800">
                  <button
                    className="text-red-500 px-2 rounded-lg bg-gray-50 hover:text-red-600 hover:bg-red-50"
                    onClick={() => deleteCar(car.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SellerCars;
