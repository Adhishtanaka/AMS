import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface Car {
  productId: number;
  pName: string;
  pDescription: string;
  price: number;
  imageUrls: string;
}

const SellerCarDetail = () => {
  const { carId } = useParams<{ carId: string }>();
  const [car, setCar] = useState<Car | null>(null);

  useEffect(() => {
    fetchCarDetails();
  }, [carId]);

  const fetchCarDetails = async () => {
    try {
      const response = await axios.get<Car>(`http://localhost:5000/api/Seller/GetCarById?carId=${carId}`);
      setCar(response.data);
    } catch (error) {
      console.error('Error fetching car details:', error);
    }
  };

  if (!car) {
    return <div>Loading car details...</div>;
  }

  const imageUrls = car.imageUrls.split(',');

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{car.pName}</h1>
      <Slider {...sliderSettings}>
        {imageUrls.map((url, index) => (
          <div key={index}>
            <img src={`http://localhost:5000/${url}`} alt={`Car image ${index + 1}`} className="w-full" />
          </div>
        ))}
      </Slider>
      <p className="mt-4">{car.pDescription}</p>
      <p className="mt-2 text-xl font-semibold">${car.price}</p>
    </div>
  );
};

export default SellerCarDetail;
