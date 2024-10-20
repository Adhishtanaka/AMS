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

      <div className="max-w-md p-4 mx-auto mt-10 bg-gray-100 rounded-lg shadow-lg sm:max-w-2xl sm:p-6">
        <h2 className="mb-6 text-2xl font-bold text-gray-800 sm:text-3xl">Create New Auction</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="carSelect" className="block mb-2 text-sm font-medium text-gray-700">
              Select Car
            </label>
            <select
              id="carSelect"
              value={selectedCarId}
              onChange={(e) => setSelectedCarId(e.target.value)}
              required
              className="block w-full py-2 pl-3 pr-10 mt-1 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
            <label htmlFor="endDate" className="block mb-2 text-sm font-medium text-gray-700">
              Select Auction End Date/Time
            </label>
            <input
              type="datetime-local"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 mt-3 bg-[#222246] text-white rounded-md shadow-sm font-medium hover:bg-[#161646] focus:outline-none "
              >
              Create Auction
            </button>
          </div>
        </form>
      </div>

      {/* Add space between form and footer */}
      <div className="mt-12"></div>
      
      {/* Footer */}
      <Footer/>
    </>
  );
};

export default AddAuction;
