import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaDiscord } from 'react-icons/fa';

const socialItems = [
  { name: "Facebook", icon: <FaFacebook />, link: "https://www.facebook.com/" },
  { name: "Instagram", icon: <FaInstagram />, link: "https://www.instagram.com/" },
  { name: "Twitter", icon: <FaTwitter />, link: "https://twitter.com/" },
  { name: "Discord", icon: <FaDiscord />, link: "https://discord.com/" },
];

const Footer = () => {
  return (
    <footer className="w-full py-10 text-black bg-gray-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Information */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-gray-700">About Us</h4>
            <p className="text-sm text-gray-500">
            We are an auction management system that helps you find, bid, and win your desired items securely and efficiently.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-gray-700">Quick Links</h4>
            <ul className="space-y-2">
            <li><a href="/" className="text-sm hover:text-gray-400 text-slate-500">Home</a></li>
              <li><a href="/auctions" className="text-sm hover:text-gray-400 text-slate-500">Browse Auctions</a></li>
              <li><a href="/faq" className="text-sm hover:text-gray-400 text-slate-500">FAQ</a></li>
              <li><a href="/contact" className="text-sm hover:text-gray-400 text-slate-500">Contact Us</a></li>
            </ul>
          </div>

          {/* Payment methods */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-gray-700">Payment Methods </h4>
            <div className="flex space-x-4">
              <img src="/images/visa.png" alt="Visa" className="w-8 h-8" />
              <img src="/images/mastercard.png" alt="MasterCard" className="w-8 h-8" />
              <img src="/images/paypal.png" alt="Visa" className="w-8 h-8" />
            </div>

          </div>

          {/* Social Media Links */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-gray-700">Follow Us on</h4>
            <div className="flex space-x-4">
              {socialItems.map((item) => (
                <a
                  key={item.name}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 transition-colors duration-300 hover:text-orange-400"
                >
                  {React.cloneElement(item.icon, { size: 24 })}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="pt-8 mt-8 border-t border-gray-300">
          <p className="text-sm text-center text-gray-600">
            © {new Date().getFullYear()} Auction Management System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
