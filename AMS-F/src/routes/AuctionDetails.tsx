import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axios from 'axios';
import { handleErrorResult } from '../util/TostMessage';
import Navbar from '../components/navbar';
import Footer from '../components/Footer';
import BidForm from '../components/BidForm';

interface Auction {
  auctionId: number;
  productId: number;
  startDate: string;
  endDate: string;
  current_Price: number;
  status: string;
}

interface CarDTO {
    id: number;
    carTitle: string;
    carDescription: string;
    img?: string;
    modelName: string;
    performanceClassName: string;
    year: number;
    price: number;
    carTypeName: string;
    sellerId: number;
    sellerName: string;
  }
  
  
  const CombinedAuctionCarDetails = () => {
    const { auctionId } = useParams<{ auctionId: string }>();
    const [auction, setAuction] = useState<Auction | null>(null);
    const [car, setCar] = useState<CarDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const fetchDetails = async () => {
        try {
          setIsLoading(true);
          const auctionResponse = await axios.get<Auction>(
            `http://localhost:5000/api/Public/GetAuctionById?auctionId=${auctionId}`
          );
          setAuction(auctionResponse.data);
  
          const carResponse = await axios.get<CarDTO>(
            `http://localhost:5000/api/Public/GetCarById?carId=${auctionResponse.data.productId}`
          );
          setCar(carResponse.data);
        } catch (error) {
          handleErrorResult('Failed to load auction details');
        } finally {
          setIsLoading(false);
        }
      };
  
      if (auctionId) {
        fetchDetails();
      }
    }, [auctionId]);
  
    const sliderSettings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 4000,
      pauseOnHover: true,
      arrows: true,
    };
  
    if (isLoading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }
  
    if (!auction || !car) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-800 text-xl">Details not found</div>
        </div>
      );
    }
  
    const imageUrls = car.img
      ? car.img.split(',').map((url) => `http://localhost:5000/car-images/${url.trim()}`)
      : [];
  
    const timeRemaining = new Date(auction.endDate).getTime() - new Date().getTime();
    const isActive = timeRemaining > 0;
  
    const carouselHeight = '612px'; 
  
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gray-100 p-6">
              {/* Car Title */}
              <h1 className="text-3xl font-bold text-black mb-2">{car.carTitle}</h1>
  
              {/* Auction Status */}
              <div className="flex items-center gap-4">
                <span className="text-black">Year: {car.year}</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {auction.status}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                  Model - {car.modelName}
                </span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full">
                  Class - {car.performanceClassName}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-semibold rounded-full">
                  {car.carTypeName}
                </span>
              </div>
            </div>
  
            {/* Content Grid */}
            <div className="grid lg:grid-cols-2 gap-8 p-6">
              {/* Image Carousel */}
              <div className="space-y-4">
                {imageUrls.length > 0 ? (
                  <div className="rounded-lg overflow-hidden shadow-md h-full" style={{ height: carouselHeight }}>
                    <Slider {...sliderSettings}>
                      {imageUrls.map((url, index) => (
                        <div key={index}>
                          <img
                            src={url}
                            alt={`${car.carTitle} - View ${index + 1}`}
                            className="w-full object-cover"
                            style={{ height: carouselHeight }}
                          />
                        </div>
                      ))}
                    </Slider>
                  </div>
                ) : (
                  <p>No images available</p>
                )}
              </div>
  
              {/* Details and Bid Form */}
              <div className="space-y-6 h-full flex flex-col justify-between" style={{ height: carouselHeight }}>
                {/* Car Description */}
                <div className="bg-gray-50 rounded-lg p-6 shadow flex-grow">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">About this Car</h2>
                  <p className="text-gray-600 leading-relaxed">{car.carDescription}</p>
                </div>
  
                {/* Auction Details */}
                <div className="bg-white rounded-lg p-6 shadow border border-gray-200 flex-grow">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Auction Details</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-500 text-sm">Current Bid</p>
                      <p className="text-2xl font-bold text-gray-800">
                        ${auction.current_Price.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Initial Price</p>
                      <p className="text-xl text-gray-800">${car.price.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Start Date</p>
                      <p className="text-gray-800">
                        {new Date(auction.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">End Date</p>
                      <p className="text-gray-800">
                        {new Date(auction.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
  
                {/* Bid Form */}
                <div className="flex items-center justify-center flex-grow">
                  <BidForm bid={{ aucId: auction.auctionId, current_amount: auction.current_Price }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  };
  
  export default CombinedAuctionCarDetails;
  