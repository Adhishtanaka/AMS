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
    <div className="container mx-auto px-4">
      <button
        className="mb-4 bg-blue-300 p-1 rounded"
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
              <th className="py-2 px-4 border-b">Car Title</th>
              <th className="py-2 px-4 border-b">Manufacturer ID</th>
              <th className="py-2 px-4 border-b">Year ID</th>
              <th className="py-2 px-4 border-b">Price</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.id}>
                <td className="py-2 px-4 border-b"><Link to={`car-details/${car.id}`} className="text-blue-500 hover:underline">{car.carTitle} </Link></td>
                <td className="py-2 px-4 border-b">{car.manufacturerId}</td>
                <td className="py-2 px-4 border-b">{car.yearId}</td>
                <td className="py-2 px-4 border-b">${car.price}</td>
                <td className="py-2 px-4 border-b">
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