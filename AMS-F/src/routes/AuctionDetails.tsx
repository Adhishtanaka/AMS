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

interface AuctionDto {
  auctionId: number;
  productId: number;
  startDate: string;
  endDate: string;
  currentPrice: number | null;
  carTitle: string;
  img: string;
  modelName: string;
  manufacturerName: string;
  year: number;
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
  const [auction, setAuction] = useState<AuctionDto | null>(null);
  const [car, setCar] = useState<CarDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        const auctionResponse = await axios.get<AuctionDto>(
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
    responsive: [
      {
        breakpoint: 640,
        settings: {
          arrows: false,
        }
      }
    ]
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

  // const timeRemaining = new Date(auction.endDate).getTime() - new Date().getTime();
  // const isActive = timeRemaining > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto mb-20 pb-5 bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gray-100 p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">{car.carTitle}</h1>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <span className="text-black text-sm sm:text-base">Year: {car.year}</span>
              {/* <span
                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                  isActive ? 'bg-gray-50  text-gray-800 border border-[#ADB4C4]' : 'bg-red-100 text-red-800'
                }`}
              >
                {auction.status}
              </span> */}
              <span className="px-2 sm:px-3 py-1 border border-[#ADB4C4] bg-gray-50 text-gray-800 text-xs sm:text-sm font-semibold rounded-full">
                {car.modelName}
              </span>
              <span className="px-2 sm:px-3 py-1 border border-[#ADB4C4] bg-gray-50 text-gray-800 text-xs sm:text-sm font-semibold rounded-full">
                {car.performanceClassName}
              </span>
              <span className="px-2 sm:px-3 py-1 border border-[#ADB4C4] bg-gray-50 text-gray-800 text-xs sm:text-sm font-semibold rounded-full">
                {car.carTypeName}
              </span>
            </div>
          </div>

          {/* Content Grid */}
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-8 p-4 sm:p-6">
            {/* Image Carousel Column */}
            <div className="w-full lg:w-1/2 flex items-center"> {/* Added flex and items-center */}
              <div className="w-full">
                {imageUrls.length > 0 ? (
                  <div className="rounded-lg overflow-hidden shadow-md">
                    <Slider {...sliderSettings}>
                      {imageUrls.map((url, index) => (
                        <div key={index}>
                          <div className="relative pt-[75%]">
                            <img
                              src={url}
                              alt={`${car.carTitle} - View ${index + 1}`}
                              className="absolute top-0 left-0 w-full h-full object-cover"
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

            {/* Details and Bid Form */}
            <div className="w-full lg:w-1/2 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 shadow">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">About this Car</h2>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{car.carDescription}</p>
              </div>

              <div className="bg-white rounded-lg p-4 sm:p-6 shadow border border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Auction Details</h2>
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm">Current Bid</p>
                    <p className="text-lg font-bold text-gray-800">
                    ${auction.currentPrice != null
                          ? auction.currentPrice.toLocaleString() 
                          : "N/A"} 
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm">Initial Price</p>
                    <p className="text-lg sm:text-xl text-gray-800">${car.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm">Start Date</p>
                    <p className="text-sm sm:text-base text-gray-800">
                      {new Date(auction.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm">End Date</p>
                    <p className="text-sm sm:text-base text-gray-800">
                      {new Date(auction.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <BidForm bid={{ aucId: auction.auctionId, current_amount: auction.currentPrice !== null ? auction.currentPrice : car.price  }} />
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