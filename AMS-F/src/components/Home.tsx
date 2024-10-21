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
  {
    question: 'What happens if I win an auction?',
    answer:'If you win an auction, you will receive an email confirmation, and the item will be marked as sold to you. Follow the instructions in the email to complete the payment and arrange for shipping.',
  },
  {
   question: 'Can I retract a bid once it is placed?',
   answer:'No, bids cannot be retracted once placed. Please make sure you are committed to purchasing the item before placing a bid.',
  },
  {
    question:'How do I pay for an item I won?',
    answer:'After winning an auction, you can complete the payment through our secure payment gateway using options like Visa, Mastercard, or PayPal.',
  },
  {
    question:'Is my payment information secure?',
    answer:'Yes, all transactions are secured with encryption, and we process payments through trusted gateways. Your payment details are not stored on our system.',
  },
];

const Home: React.FC = () => {

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
    <Navbar/>
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

