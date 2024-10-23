import React from "react";
import { useState } from 'react';
import { motion } from "framer-motion";
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
    img: "/src/assets/cat2.png",
    title: "SUVs",
  },
  {
    img: "/src/assets/cat3.png",
    title: "Coupes",
  },
  {
    img: "/src/assets/cat4.png",
    title: "Trucks",
  },
  {
    img: "/src/assets/cat5.png",
    title: "Electric Cars",
  },
  {
    img: "/src/assets/cat6.png",
    title: "Luxury Cars",
  },
  {
    img: "/src/assets/image.png",
    title: "Sports Cars",
  },
  {
    img: "/src/assets/cat8.png",
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
      <Navbar />
      
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-40 h-40 bg-purple-200 rounded-full blur-3xl opacity-20"
          animate={{
            x: [0, -70, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto p-4 relative">
        {/* Hero Section with animation */}
        <motion.div 
          className="text-center py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-800">Welcome to Car Bidding</h1>
          <p className="text-gray-600 mt-2">Find your dream car and place your bids now!</p>
        </motion.div>

        {/* Carousel Section */}
        <motion.div 
          className="carousel-container mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Slider {...carouselSettings}>
            {cars.map((car, index) => (
              <div key={index} className="p-4">
                <img
                  src={car.img}
                  alt={car.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
                {/* <h2 className="text-xl font-bold text-center mt-4">{car.name}</h2> */}
              </div>
            ))}
          </Slider>
        </motion.div>
      </div>

      {/* Category Cards Section with stagger animation */}
      <motion.div 
        className="max-w-7xl p-8 mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-1 gap-y-4 mb-8"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {categories.map((category, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <CategoryCard img={category.img} title={category.title} />
          </motion.div>
        ))}
      </motion.div>

      {/* New Testimonials Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">What Our Users Say</h2>
          <p className="mt-4 text-gray-600">Discover why car enthusiasts trust our platform</p>
        </div>
        

      </div>

      {/* FAQ Section with animations */}
      <motion.div 
        className="max-w-5xl p-8 mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <header className="mb-12">
          <h1 className="text-4xl font-bold">FAQs</h1>
        </header>
        <div className="flex flex-col md:flex-row">
          <p className="md:w-1/2 mt-4 text-gray-600">
            Have questions? Here you'll find the answers most valued by our partners, along with access to step-by-step instructions and support.
          </p>
          <div className="md:w-1/3 md:pb-12">
            <img src="/src/assets/contact.svg" alt="FAQ Illustration" className="w-full h-auto" />
          </div>
        </div>
        <div className="max-w-2xl p-8 mx-auto mb-10">
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <motion.div 
                key={index} 
                className="pb-4 border-b border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  className="flex items-center justify-between w-full py-2 text-lg font-medium text-left text-gray-800"
                  onClick={() => toggleFAQ(index)}
                >
                  {faq.question}
                  <span>{openIndex === index ? '-' : '+'}</span>
                </button>
                {openIndex === index && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 text-gray-600"
                  >
                    {faq.answer}
                  </motion.p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      
      <Footer />
    </>
  );
};

export default Home;