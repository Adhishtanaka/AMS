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

  const imageUrl = (car: Car) => {
    if (!car || !car.img) {
      return 'http://localhost:5173/public/images/placeholder.jpg'; 
    }
    return `http://localhost:5000/car-images/${car.img.split(",")[0].trim()}`;
  };
  
  

  return (
    <div className="container px-4 mx-auto mb-48">
      <button
        className="mb-6 text-white bg-[#1D2945] hover:bg-[#3d517f] font-semibold p-1 px-2 rounded"
        onClick={() => navigate('/seller/add-car')}
      >
        Add Car
      </button>

      {cars.length === 0 ? (
        <div className="text-center p-4">No cars found for this seller.</div>
      ) : (
        <div className="w-full overflow-x-auto">
          {/* Mobile View (Card Layout) */}
          <div className="lg:hidden space-y-4">
            {cars.map((car) => (
              <div key={car.id} className="bg-white rounded-lg shadow p-4 space-y-3">
                <Link to={`car-details/${car.id}`} className="flex flex-col space-y-2">
                  <img
                    src={imageUrl(car)}
                    alt={car.carTitle}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/public/images/placeholder.jpg';
                    }}
                  />
                  <h3 className="font-semibold text-lg text-gray-800">{car.carTitle}</h3>
                </Link>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="space-y-1">
                    <p className="text-gray-500">Model</p>
                    <p className="font-medium">{getModelName(car.modelId)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500">Year</p>
                    <p className="font-medium">{car.year}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500">Price</p>
                    <p className="font-medium">${car.price}</p>
                  </div>
                  <div className="flex items-end">
                    <button
                      className="w-full py-1 text-red-500 rounded-lg bg-gray-50 hover:text-red-600 hover:bg-red-50"
                      onClick={() => deleteCar(car.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View (Table Layout) */}
          <table className="hidden lg:table min-w-full bg-white border-collapse rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 font-semibold text-left text-black border-b">Car Title</th>
                <th className="px-4 py-2 font-semibold text-left text-black border-b">Model</th>
                <th className="px-4 py-2 font-semibold text-left text-black border-b">Year</th>
                <th className="px-4 py-2 font-semibold text-left text-black border-b">Price</th>
                <th className="px-4 py-2 font-semibold text-left text-black border-b">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {cars.map((car) => (
                <tr key={car.id}>
                  <td className="px-4 py-2">
                    <Link
                      to={`car-details/${car.id}`}
                      className="text-gray-600 flex items-center hover:underline"
                    >
                      <img
                        src={imageUrl(car)}
                        className="w-24 h-16 object-cover rounded-lg mr-3"
                        alt={car.carTitle}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/public/images/placeholder.jpg';
                        }}
                      />
                      <span>{car.carTitle}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-gray-800">{getModelName(car.modelId)}</td>
                  <td className="px-4 py-2 text-gray-800">{car.year}</td>
                  <td className="px-4 py-2 text-gray-800">${car.price}</td>
                  <td className="px-4 py-2 text-gray-800">
                    <button
                      className="px-2 py-1 text-red-500 rounded-lg bg-gray-50 hover:text-red-600 hover:bg-red-50"
                      onClick={() => deleteCar(car.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SellerCars;
