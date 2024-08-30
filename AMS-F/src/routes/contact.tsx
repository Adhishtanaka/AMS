import React from "react";
import { useState } from 'react';
import Navbar from "../components/navbar";
import Footer from "../components/Footer";


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

const Contact: React.FC = () => {

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
    <Navbar/>
    <div className="max-w-5xl mx-auto p-8">
      <header className="mb-12">
        <h1 className="text-4xl font-bold">FAQs</h1>
      </header>
      <div className="flex">
        <p className="mt-4 text-gray-600 w-1/2">
          Have questions? Here you'll find the answers most valued by our partners, along with access to step-by-step instructions and support.
        </p>
        <div className="md:w-1/3 md:pb-12">
          <img src="/src/assets/contact.svg" alt="FAQ Illustration" className="w-full h-auto" />
        </div>
      </div>
      <div className="max-w-2xl mx-auto p-8 mb-10">
      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <div key={index} className="border-b border-gray-200 pb-4">
            <button
              className="w-full text-left flex justify-between items-center py-2 text-lg font-medium text-gray-800"
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

export default Contact;
