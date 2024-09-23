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
          if (error.response?.status === 409) {
              handleErrorResult('An active auction already exists for this car.');
          } else {
              const errorMessage = error.response?.data?.message || 'An error occurred';
              handleErrorResult(errorMessage);
          }
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
      <div className="mt-6"></div>

      <div className="max-w-md sm:max-w-2xl mx-auto mt-10 p-4 sm:p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Create New Auction</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="carSelect" className="block text-sm font-medium text-gray-700 mb-2">
              Select Car
            </label>
            <select
              id="carSelect"
              value={selectedCarId}
              onChange={(e) => setSelectedCarId(e.target.value)}
              required
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">-- Choose a car --</option>
              {cars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.carTitle}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
              Select Auction End Date/Time
            </label>
            <input
              type="datetime-local"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              Create Auction
            </button>
          </div>
        </form>
      </div>

      {/* Add space between form and footer */}
      <div className="mt-12"></div>
      
      {/* Footer */}
      <Footer />
    </>
  );
};

export default AddAuction;
