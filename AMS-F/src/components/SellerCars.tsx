import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { handleErrorResult } from '../util/TostMessage';
import api from '../util/api';

interface Car {
  id: number;
  carTitle: string;
  carDescription: string;
  manufacturerId: number;
  performanceClassId: number;
  yearId: number;
  price: number;
  carTypeId: number;
  sellerId: number;
}

const SellerCars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await api.get<Car[]>('http://localhost:5000/api/Seller/GetCarsBySellerId');
      setCars(response.data);
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
        fetchCars();
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

  if (loading) {
    return <div>Loading cars...</div>;
  }

  return (
    <div className="container mx-auto px-4 mb-48">
      <button
        className="mb-6 text-gray-600 bg-blue-50 border border-gray-300 hover:border-gray-300 hover:bg-blue-100 font-semibold p-1 px-2 rounded"
        onClick={() => navigate('/seller/add-car')}
      >
        Add Car
      </button>
      {cars.length === 0 ? (
        <div>No cars found for this seller.</div>
      ) : (
        <table className="min-w-full table-auto border-collapse bg-white shadow-md rounded-lg overflow-hidden">
  <thead className="bg-blue-50">
    <tr>
      <th className="px-4 py-2 border text-left font-bold text-[#1D2945]">Car Title</th>
      <th className="px-4 py-2 border text-left font-bold text-[#1D2945]">Manufacturer ID</th>
      <th className="px-4 py-2 border text-left font-bold text-[#1D2945]">Year ID</th>
      <th className="px-4 py-2 border text-left font-bold text-[#1D2945]">Price</th>
      <th className="px-4 py-2 border text-left font-bold text-[#1D2945]">Actions</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-200">
    {cars.map((car) => (
      <tr key={car.id}>
        <td className="px-4 py-1 border">
          <Link to={`car-details/${car.id}`} className="text-blue-500 hover:underline">{car.carTitle}</Link>
        </td>
        <td className="px-4 py-1 border">{car.manufacturerId}</td>
        <td className="px-4 py-1 border">{car.yearId}</td>
        <td className="px-4 py-1 border">${car.price}</td>
        <td className="px-4 py-1 border">
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