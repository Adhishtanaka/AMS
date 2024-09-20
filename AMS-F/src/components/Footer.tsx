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
    
    <footer className="py-10 overflow-hidden text-black bg-white">
      <div className="container px-6 mx-auto">
        {/* Top section */}
        <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-4">
             {/* Company Information */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-slate-600">About Us</h4>
            <p className="text-sm text-slate-500">
              We are an auction management system that helps you find, bid, and win your desired items securely and efficiently.
            </p>
          </div>
          {/* Navigation Links */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-slate-600">Quick Links</h4>
            <ul>
              <li><a href="/" className="text-sm hover:text-gray-400 text-slate-500">Home</a></li>
              <li><a href="/auctions" className="text-sm hover:text-gray-400 text-slate-500">Browse Auctions</a></li>
              <li><a href="/faq" className="text-sm hover:text-gray-400 text-slate-500">FAQ</a></li>
              <li><a href="/contact" className="text-sm hover:text-gray-400 text-slate-500">Contact Us</a></li>

            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-slate-600">Payment Methods</h4>
            <div className="flex space-x-4">
              <img src="./src/assets/visa.png" alt="Visa" className="w-8 h-8" />
              <img src="./src/assets/mastercard.png" alt="MasterCard" className="w-8 h-8" />
              <img src="./src/assets/paypal.png" alt="PayPal" className="w-8 h-8" />
            </div>
          </div>   
        
          {/* Social Media Links */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-slate-600">Follow Us on</h4>
            <div className="flex space-x-4 text-slate-500">
        {items.map((item, index) => (
    <a key={index} href={item.link} target="_blank" rel="noopener noreferrer">
      {item.icon}
    </a>
    
    
  ))}
  
  
</div>
</div>
   </div>

        {/* Bottom section  */}
        <div className="pt-5 text-center border-t border-gray-200">
          
          <p className="pt-5 text-sm text-gray-600">© 2024 Auction Management System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
