import { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";
import AnimatedCountdown from "../components/AnimatedCountdown";

interface AuctionDto {
  auctionId: number;
  initialPrice: number;
  startDate: string;
  endDate: string;
  currentPrice: number | null;
  carTitle: string;
  img: string;
  modelName: string;
  manufacturerName: string;
  year: number;
  sellerName: string;
}

const All = () => {
  const [auctions, setAuctions] = useState<AuctionDto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAuctions, setFilteredAuctions] = useState<AuctionDto[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/public/GetALLAuctionDetails"
        );
        setAuctions(response.data);
        setFilteredAuctions(response.data);
      } catch (error) {
        console.error("Error fetching auctions:", error);
      }
    };
    fetchAuctions();
  }, []);

  useEffect(() => {
    const currentDate = new Date();
    const filtered = auctions.filter((auction) => {
      const endDate = new Date(auction.endDate);
      if (endDate < currentDate) {
        return false; 
      }
      const searchString = searchTerm.toLowerCase();
      return (
        auction.carTitle.toLowerCase().includes(searchString) ||
        auction.sellerName.toLowerCase().includes(searchString) ||
        auction.manufacturerName.toLowerCase().includes(searchString) ||
        auction.modelName.toLowerCase().includes(searchString) ||
        auction.year.toString().includes(searchString)
      );
    });
    setFilteredAuctions(filtered);
  }, [searchTerm, auctions]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    // Add these settings to fix the image display issues
    adaptiveHeight: true,
    centerMode: false,
    variableWidth: false,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style>
        {`
          .slick-dots {
            margin-bottom: 5px;
          }
          .slick-dots li {
            margin: 0 -4px;
          }
        `}
      </style>
      <Navbar />

      {/* Search Bar */}
      <div className="w-full py-4 ">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Car Manufacturer, Model, or Year..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className=" w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1D2945] focus:border-transparent transition duration-200"
            />
            {/* Search Icon using pure CSS */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            {/* Clear button */}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto w-10/12 px-4 py-8">
        {filteredAuctions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No auctions found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAuctions.map((auction) => {
               const imageUrls = auction.img
               ? auction.img
                   .split(",")
                   .map(
                     (url) => `http://localhost:5000/car-images/${url.trim()}`
                   )
               : [];
 
             
 
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
                              (e.target as HTMLImageElement).src = '/public/images/placeholder.jpg';
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
                     {auction.manufacturerName} {auction.modelName}-{" "}
                     {auction.year}
                   </h2>
                   <div className="flex justify-between items-center mt-2">
                     <div>
                       <p className="text-xs text-gray-600">{auction.currentPrice != null
                           ? "Current Bid" 
                           : "Initial Price"} </p>
                       <p className="text-lg font-bold text-[#1D2945]">
                         ${auction.currentPrice != null
                           ? auction.currentPrice.toLocaleString() 
                           : auction.initialPrice.toLocaleString()} 
                       </p>
                     </div>
                     <div className="text-right">
                       <AnimatedCountdown endDate={auction.endDate} />
                     </div>
                   </div>
 
                   <button
                     onClick={() =>
                       navigate(`/auction-details/${auction.auctionId}`)
                     }
                     className="mt-4 w-full bg-[#1D2945] text-white py-2 px-4 rounded-md text-sm font-semibold hover:bg-opacity-90 transition duration-300"
                   >
                     Place Bid
                   </button>
                 </div>
               </div>
             );
           })}
         </div>
        )}</div>
       <Footer />
     </div>
   );
 };
 
 export default All;