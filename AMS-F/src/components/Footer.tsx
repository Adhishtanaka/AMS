// src/components/Footer.tsx

import React from 'react';
import { 
  FaFacebook, 
  FaInstagram, 
  FaTwitter 
} from 'react-icons/fa';

const items = [
    { name: "Facebook", icon: <FaFacebook />, link: "https://www.facebook.com/" },
    { name: "Instagram", icon: <FaInstagram />, link: "https://www.instagram.com/" },
    { name: "Twitter", icon: <FaTwitter />, link: "https://twitter.com/" },
  ];
   
  
const Footer: React.FC = () => {
  return (
    
    <footer className="py-10 text-white bg-green-900">
      <div className="container px-6 mx-auto">
        {/* Top section with 6 columns */}
        <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-6">
             {/* Company Information */}
          <div>
            <h4 className="mb-4 text-lg font-semibold">About Us</h4>
            <p className="text-sm">
              We are an auction management system that helps you find, bid, and win your desired items securely and efficiently.
            </p>
          </div>
          {/* Navigation Links */}
          <div>
            <h4 className="mb-4 text-lg font-semibold">Quick Links</h4>
            <ul>
              <li><a href="/" className="text-sm hover:text-gray-300">Home</a></li>
              <li><a href="/auctions" className="text-sm hover:text-gray-300">Browse Auctions</a></li>
              <li><a href="/faq" className="text-sm hover:text-gray-300">FAQ</a></li>
              <li><a href="/contact" className="text-sm hover:text-gray-300">Contact Us</a></li>

            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h4 className="mb-4 text-lg font-semibold">Payment Methods</h4>
            <div className="flex space-x-4">
              <img src="/visa.png" alt="Visa" className="w-8 h-8" />
              <img src="/mastercard.png" alt="MasterCard" className="w-8 h-8" />
              <img src="/paypal.png" alt="PayPal" className="w-8 h-8" />
            </div>
          </div>   
          {/* Leagal Section */}
          <div>
            <h4 className="mb-4 text-lg font-semibold">Legal Terms</h4>
            <p className="mb-2 text-sm">Privacy Policy</p>
            <p className="text-sm">Terms of service</p>
            <p className="mt-2 text-sm"><a href="/cookies" className="text-blue-400">Visit our cookies</a></p>
          </div> 
          {/* User Actions */}
          <div>
         <h4 className="mb-4 text-lg font-semibold">User Actions</h4>
         <ul>
         <li><a href="/my-account" className="text-sm hover:text-gray-300 ">My Account</a></li>
         <li><a href="/my-bids" className="text-sm hover:text-gray-300 ">My Bids</a></li>
        <li><a href="/sell-with-us" className="text-sm hover:text-gray-300 ">Sell with Us</a></li>
        <li><a href="/how-it-works" className="text-sm hover:text-gray-300 ">How It Works</a></li>
         </ul>
         </div>
          
          {/* Social Media Links */}
          <div>
            <h4 className="mb-4 text-lg font-semibold">Follow Us on</h4>
            <div className="flex space-x-4">
        {items.map((item, index) => (
    <a key={index} href={item.link} target="_blank" rel="noopener noreferrer">
      {item.icon}
    </a>
    
    
  ))}
  
  
</div>
</div>
   </div>

        {/* Bottom section with Newsletter Signup and Copyright */}
        <div className="pt-6 text-center border-t border-gray-700">
          <form className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold">Subscribe to our Newsletter</label>
            <div className="flex justify-center mt-2">
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="p-2 text-white bg-gray-800 rounded-l focus:outline-none"
              />
              <button type="submit" className="px-4 py-2 bg-black rounded-r hover:bg-gray-500">Subscribe</button>
            </div>
          </form>
          <p className="text-sm text-gray-200">© 2024 Auction Management System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
