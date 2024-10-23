import { useState, useEffect } from 'react';
import { handleErrorResult } from '../util/TostMessage';
import { useParams, Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/navbar';
import axios from 'axios';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import api from '../util/api';

interface Profile {
  role: string;
  name: string;
  email: string;
  telephone: string;
  address: string;
}

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
  status: boolean;
  sellerId: number;
}

const ProfilePage: React.FC = () => {
  const { userID } = useParams<{ userID: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [auctions, setAuctions] = useState<AuctionDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);


  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true); 
      try {
        const response = await axios.get(`http://localhost:5000/api/Public/GetProfileData`, {
          params: { userID }
        });
        const data: Profile = response.data;
        setProfile(data);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          handleErrorResult(err.response.data.message || 'Failed to fetch profile data');
        } else {
          handleErrorResult('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchUserId = async () => {
      try {
          const response = await api.get('http://localhost:5000/api/auth/GetUsersId'); 
          if (response.status === 200) {
              setCurrentUserId(response.data); 
          }
      } catch (error) {
          console.error('Error fetching user ID:', error);
      }
  };

    const fetchAuctions = async () => {
      try {
        setLoading(true);
        const response = await axios.get<AuctionDto[]>(`http://localhost:5000/api/Public/GetAuctionsBySellerId?sellerid=${userID}`);
        const filteredAuctions = response.data.filter(
          (auction) => new Date(auction.endDate) >= new Date()
        );

        setAuctions(filteredAuctions);
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

    fetchProfile();
    fetchAuctions();
    fetchUserId();
  }, [userID]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1D2945] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Profile data not available</div>
      </div>
    );
  }

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    window.location.reload();
};

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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
        <div className="bg-gray-100 rounded-lg shadow-xl p-8  max-w-md w-full">
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}`}
                alt={profile.name}
                className="w-32 h-32 rounded-full shadow-lg"
              />
              <div className="absolute bottom-0 right-0 bg-[#1D2945] text-white px-3 py-1 rounded-full text-sm">
                {profile.role}
              </div>
            </div>
            <h1 className="text-2xl font-bold text-[#1D2945] mb-1">
            {profile.name}
          </h1>

          <div className="w-full mt-6 space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#1D2945] rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-[#1D2945]">{profile.email}</p>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#1D2945] rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-[#1D2945]">{profile.telephone}</p>
                </div>
              </div>
            </div>

            <div className="pb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#1D2945] rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-[#1D2945]">{profile.address}</p>
                </div></div>
                
                </div>
                </div>
                
          </div>
          {currentUserId === Number(userID) && (
        <div className="flex justify-center mt-1">
          <button
            onClick={handleLogout}
            className="w-full bg-[#1D2945] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#2b3d67] transition duration-200"
          >
            Logout
          </button>
        </div>
      )}
        </div>
        
      </div>

{profile.role === 'Seller' && (
 <div className="mx-auto w-10/12 px-4 py-4 bg-gray-50">
  <h2 className="text-2xl font-bold mb-4">Sellers Active Auctions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {auctions.length === 0 ? (
        <div className="col-span-4 text-center text-gray-600 py-8">
          No Active auctions found for this seller.
        </div>
      ) : (
        <>
          
          {auctions.map((auction) => {
            const endDate = new Date(auction.endDate);
            const currentDate = new Date();
            const timeDiff = endDate.getTime() - currentDate.getTime();
            const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
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
                className="bg-gray-100 rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:shadow-xl"
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
                          />
                        </div>
                      ))}
                    </Slider>
                  ) : (
                    <div className="h-48  flex items-center justify-center">
                      <span className="text-gray-500">No image available</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-bold text-gray-800 mt-2 truncate">
                    {auction.manufacturerName} {auction.modelName} {auction.year}
                  </h2>
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      <p className="text-xs text-gray-600">
                        {auction.currentPrice != null ? "Current Bid" : "Initial Price"}
                      </p>
                      <p className="text-lg font-bold text-[#1D2945]">
                        ${auction.currentPrice != null 
                          ? auction.currentPrice.toLocaleString() 
                          : '0'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">Time Left</p>
                      <p className={`text-sm font-bold ${
                        daysLeft <= 3 ? "text-red-600" : "text-gray-800"
                      }`}>
                        {daysLeft} days
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/auction-details/${auction.auctionId}`}
                    className="mt-4 w-full bg-[#1D2945] text-white py-2 px-4 rounded-md text-sm font-semibold hover:bg-opacity-90 transition duration-300 block text-center"
                  >
                    Place Bid
                  </Link>
                </div>
              </div>
            );
          })}
          {auctions.length < 4 && Array.from({ length: 4 - auctions.length }).map((_, index) => (
            <div key={`empty-${index}`} className="hidden sm:block" />
          ))}
        </>
      )}
    </div>
  </div>
)}
      <Footer />
    </>
  );
};

export default ProfilePage;
