import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { handleErrorResult } from "../util/TostMessage";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";

interface Car {
  id: number;
  carTitle: string;
  carDescription: string;
  img: string;
  modelName: string;
  performanceClassName: string;
  year: number;
  price: number;
  carTypeName: string;
  sellerId: number;
}

const SellerCarDetail: React.FC = () => {
  const { carId } = useParams<{ carId: string }>();
  const [car, setCar] = useState<Car | null>(null);

  useEffect(() => {
    fetchCarDetails();
  }, [carId]);

  const fetchCarDetails = async () => {
    try {
      console.log(`Fetching car details for ID: ${carId}`);
      const response = await axios.get<Car>(
        `http://localhost:5000/api/Public/GetCarById?carId=${carId}`
      );
      console.log("Car details fetched successfully:", response.data);
      setCar(response.data);
    } catch (error) {
      console.error("Error fetching car details:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "An error occurred";
        handleErrorResult(errorMessage);
      } else {
        handleErrorResult("An unexpected error occurred");
      }
    }
  };

  if (!car) {
    return <div>Loading car details...</div>;
  }

  const imageUrls = car.img
    .split(",")
    .map((url) => `http://localhost:5000/car-images/${url.trim()}`);

    const sliderSettings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,        
      autoplaySpeed: 3000,   
      pauseOnHover: true,
      adaptiveHeight: true,
      centerMode: false,
      variableWidth: false,    
    };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto mb-20 pb-5 bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gray-100 p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
              {car.carTitle}
            </h1>

          </div>

          <div className="flex flex-col lg:flex-row gap-4 sm:gap-8 p-4 sm:p-6">
  {/* Image Carousel Column */}
  <div className="w-full lg:w-1/2 flex items-center"> 
    <div className="w-full">
      {imageUrls.length > 0 ? (
        <div className="rounded-lg overflow-hidden shadow-md">
          <Slider {...sliderSettings}>
            {imageUrls.map((url, index) => (
              <div key={index}>
                {/* Fix the carousel height */}
                <div className="relative pt-[75%]">
                  <img
                    src={url}
                    alt={`${car.carTitle} - View ${index + 1}`}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/public/images/placeholder.jpg';
                    }}
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        <div className="bg-gray-100 rounded-lg p-4 text-center">No images available</div>
      )}
    </div>
  </div>

  {/* Details Column */}
  <div className="w-full lg:w-1/2 flex flex-col justify-between"> 
    <div className="bg-gray-50 rounded-lg p-4 sm:p-6 shadow">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">About this Car</h2>
      <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{car.carDescription}</p>
    </div>

    <div className="bg-white rounded-lg p-4 sm:p-6 shadow border border-gray-200 flex-grow h-full"> 
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Pricing Details</h2>
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        <div>
          <p className="text-gray-500 text-xs sm:text-sm">Price</p>
          <p className="text-lg sm:text-xl text-gray-800">${car.price.toLocaleString()}</p>
        </div>
      </div>

      {/* Additional Details Section Below Price */}
      <div className="mt-4">
        <p className="text-gray-500 text-xs sm:text-sm">Year: {car.year}</p>
        <p className="text-gray-500 text-xs sm:text-sm">Model: {car.modelName}</p>
        <p className="text-gray-500 text-xs sm:text-sm">Car Type: {car.carTypeName}</p>
        <p className="text-gray-500 text-xs sm:text-sm">Performance Class: {car.performanceClassName}</p>
      </div>
    </div>
  </div>
</div>
</div></div>
      <Footer />
    </div>
  );
};

export default SellerCarDetail;
