import { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

interface AuctionDto {
  auctionId: number;
  startDate: string;
  endDate: string;
  current_Price: number;
  carTitle: string;
  img: string;
  modelName: string;           
  manufacturerName: string;   
  year: number;                
}

const All = () => {
  const [auctions, setAuctions] = useState<AuctionDto[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/public/GetALLAuctionDetails"
        );
        setAuctions(response.data);
      } catch (error) {
        console.error("Error fetching auctions:", error);
      }
    };
    fetchAuctions();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <div className="mx-auto w-10/12 px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {auctions.map((auction) => {
            const imageUrls = auction.img
              ? auction.img.split(",").map(
                  (url) => `http://localhost:5000/car-images/${url.trim()}`
                )
              : [];

            const daysLeft = Math.ceil(
              (new Date(auction.endDate).getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24)
            );

            return (
              <div
                key={auction.auctionId}
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:shadow-xl"
              >
                {/* Image Carousel */}
                <div className="relative h-48">
                  {imageUrls.length > 0 ? (
                    <Slider {...sliderSettings}>
                      {imageUrls.map((url, index) => (
                        <div key={index} className="h-48">
                          <img
                            src={url}
                            alt={`${auction.carTitle} - View ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/api/placeholder/400/320";
                            }}
                          />
                        </div>
                      ))}
                    </Slider>
                  ) : (
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No image available</span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <h2 className="text-lg font-bold text-gray-800 mt-2 truncate">
                    {auction.carTitle}
                  </h2>
                  <p className="text-sm text-gray-600">{auction.manufacturerName}: {auction.modelName}- {auction.year}</p>
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      <p className="text-xs text-gray-600">Current Bid</p>
                      <p className="text-lg font-bold text-[#1D2945]">
                        ${auction.current_Price.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">Time Left</p>
                      <p className={`text-sm font-bold ${daysLeft <= 3 ? 'text-red-600' : 'text-gray-800'}`}>
                        {daysLeft} days
                      </p>
                    </div>
                  </div>

                  <button onClick={() => navigate(`/auction-details/${auction.auctionId}`)} className="mt-4 w-full bg-[#1D2945] text-white py-2 px-4 rounded-md text-sm font-semibold hover:bg-opacity-90 transition duration-300">
                    Place Bid
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default All;
