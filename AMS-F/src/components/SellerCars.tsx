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
    <div className="container px-4 mx-auto">
      <button
        className="p-1 mb-4 bg-blue-300 rounded"
        onClick={() => navigate('/seller/add-car')}
      >
        Add Car
      </button>
      {cars.length === 0 ? (
        <div>No cars found for this seller.</div>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Car Title</th>
              <th className="px-4 py-2 border-b">Model</th>
              <th className="px-4 py-2 border-b">Year</th>
              <th className="px-4 py-2 border-b">Price</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.id}>
                <td className="px-4 py-2 border-b">
                  <Link to={`car-details/${car.id}`} className="text-blue-300 hover:underline">
                    {car.carTitle}
                  </Link>
                </td>
                <td className="px-4 py-2 border-b">{getModelName(car.modelId)}</td>
                <td className="px-4 py-2 border-b">{car.year}</td>
                <td className="px-4 py-2 border-b">${car.price}</td>
                <td className="px-4 py-2 border-b">
                  <button
                    className="text-red-500 hover:text-red-700"
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
