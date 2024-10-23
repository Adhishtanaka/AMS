import React from "react";
import { useState } from 'react';
import Navbar from "../components/navbar";
import Footer from "../components/Footer";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import CategoryCard from "../components/CategoryCard";


const cars = [
  {
    img: "/src/assets/Ferrari.png",
    name: "Ferrari F8",
    price: 250000,
  },
  {
    img: "/src/assets/c2.png",
    name: "Lamborghini Huracan",
    price: 320000,
  },
  {
    img: "/src/assets/c3.png",
    name: "McLaren 720S",
    price: 280000,
  }
];

const categories = [
  {
    img: "/src/assets/cat1.png",
    title: "Sedans",
  },
  {
    img: "/src/assets/cat1.png",
    title: "SUVs",
  },
  {
    img: "/src/assets/cat1.png",
    title: "Coupes",
  },
  {
    img: "/src/assets/cat1.png",
    title: "Trucks",
  },
  {
    img: "/src/assets/cat1.png",
    title: "Electric Cars",
  },
  {
    img: "/src/assets/cat1.png",
    title: "Luxury Cars",
  },
  {
    img: "/src/assets/cat1.png",
    title: "Sports Cars",
  },
  {
    img: "/src/assets/cat1.png",
    title: "Convertibles",
  },
];


interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'Do I have to log in to bid?',
    answer: 'Yes, you will need to create an account and log in to place bids.',
  },
  {
    question: 'How do I submit a bid?',
    answer: 'First, you must be logged in with an activated account in order to bid. Do not have an account? sign-up is quick and free!',
  },
  {
    question: 'Is there any cost to place a bid on an item?',
    answer: 'Nope! There is never a cost to place a bid on an item. You are,however,responsible for following-through on any items won.',
  },
];

const Home: React.FC = () => {

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };


  return (
    <>
    <Navbar/>

    <div className="container mx-auto p-4">
      {/* Hero Section */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to Car Bidding</h1>
        <p className="text-gray-600 mt-2">Find your dream car and place your bids now!</p>
      </div>

      {/* Carousel Section */}
      <div className="carousel-container mb-8">
        <Slider {...carouselSettings}>
          {cars.map((car, index) => (
            <div key={index} className="p-4">
              <img
                src={car.img}
                alt={car.name}
                className="w-full h-96 object-cover rounded-lg"
              />
              <h2 className="text-xl font-bold text-center mt-4">{car.name}</h2>
            </div>
          ))}
        </Slider>
      </div>
    </div>

    {/* Category Cards Section */}
    <div className="max-w-7xl p-8 mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-1 gap-y-4 mb-8">
        {categories.map((category, index) => (
          <CategoryCard key={index} img={category.img} title={category.title} />
        ))}
      </div>


    
    <div className="max-w-5xl p-8 mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-bold">FAQs</h1>
      </header>
      <div className="flex">
        <p className="w-1/2 mt-4 text-gray-600">
          Have questions? Here you'll find the answers most valued by our partners, along with access to step-by-step instructions and support.
        </p>
        <div className="md:w-1/3 md:pb-12">
          <img src="/src/assets/contact.svg" alt="FAQ Illustration" className="w-full h-auto" />
        </div>
      </div>
      <div className="max-w-2xl p-8 mx-auto mb-10">
      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <div key={index} className="pb-4 border-b border-gray-200">
            <button
              className="flex items-center justify-between w-full py-2 text-lg font-medium text-left text-gray-800"
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              <span>{openIndex === index ? '-' : '+'}</span>
            </button>
            {openIndex === index && (
              <p className="mt-2 text-gray-600">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
      
    </div>
    <Footer />
    </>
  );
};

export default Home;

