import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/navbar';
import axios from 'axios';
import api from '../util/api';

interface Profile {
  role: string;
  name: string;
  email: string;
  telephone: string;
  address: string;
}



const MyProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true); 
      try {
        const response = await api.get(`http://localhost:5000/api/Public/GetMyProfileData`);
        const data: Profile = response.data;
        setProfile(data);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          navigate("/login")
        } else {
            navigate("/login")
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

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
          
        <div className="flex flex-col gap-2 justify-center mt-1">
        <button
           onClick={() => navigate(`/${profile.role}`)}
            className="w-full bg-[#285d3c] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#38834c] transition duration-200"
          >
            Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="w-full bg-[#1D2945] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#2b3d67] transition duration-200"
          >
            Logout
          </button>
        </div>
     
        </div>
        
      </div>

      <Footer />
    </>
  );
};

export default MyProfilePage;
