import React, { useState, useEffect } from 'react';
import api from '../util/api';
import axios from 'axios';
import { handleErrorResult, handleSuccessResult } from '../util/TostMessage';
import Footer from '../components/Footer';
import Navbar from '../components/navbar';

interface Car {
  id: number;
  carTitle: string;
}

const AddAuction: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCarId, setSelectedCarId] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await api.get('http://localhost:5000/api/seller/GetCarsBySellerId');
        if (Array.isArray(response.data)) {
          setCars(response.data);
        } else {
          handleErrorResult('Invalid data format');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.message || 'An error occurred';
          handleErrorResult(errorMessage);
        } else {
          handleErrorResult('An unexpected error occurred');
        }
      }
    };
    fetchCars();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const auctionData = {
      ProductId: selectedCarId,
      StartDate: new Date(),
      EndDate: new Date(endDate),
      Status: 'Active',
    };
    try {
      await api.post('http://localhost:5000/api/seller/CreateAuction', auctionData);
      handleSuccessResult('Auction created successfully!');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'An error occurred';
        handleErrorResult(errorMessage);
      } else {
        handleErrorResult('An unexpected error occurred');
      }
    }
  };

  return (
    <>
      {/* Navbar with spacing below */}
      <Navbar />
      <div className="flex items-center justify-center min-h-screen px-4 py-6">
      <div className="w-full max-w-md p-8 px-12 py-12 bg-white rounded-lg shadow-lg">
        <h2 className="mb-6 font-bold text-center text-gray-900 sm:text-2xl">Create New Auction</h2>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className='text-gray-700'>
            <label htmlFor="carSelect" className="block mb-2 text-sm font-medium text-gray-500">
              Select Car
            </label>
            <select
              id="carSelect"
              value={selectedCarId}
              onChange={(e) => setSelectedCarId(e.target.value)}
              required
              className="block w-full py-2 pl-3 pr-5 mt-1 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-[#263657] focus:border-[#2d3c67] sm:text-sm"
            >
              <option value="" >-Choose A Car-</option>
              {cars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.carTitle}
                </option>
              ))}
            </select>
          </div>
          <div className='text-gray-700'>
            <label htmlFor="endDate" className="block mb-2 text-sm font-medium text-gray-500">
              Select Auction End Date/Time
            </label>
            <input
              type="datetime-local"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="block w-full py-2 pl-3 pr-5 mt-1 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-[#263657] focus:border-[#2d3c67] sm:text-sm"
            />
          </div>
          <div>
            <button
              type="submit"
              className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white transition duration-150 ease-in-out border border-transparent rounded-md shadow-sm bg-[#1D2945] hover:bg-[#243357] "
            >
              Create Auction
            </button>
          </div>
        </form>
      </div>
</div>
      {/* Add space between form and footer */}
      <div className="mt-12"></div>
      
      {/* Footer */}
      <Footer />
    
    </>
  );
};

export default AddAuction;
