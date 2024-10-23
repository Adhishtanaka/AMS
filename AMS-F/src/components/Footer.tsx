import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaDiscord } from 'react-icons/fa';

const socialItems = [
  { name: 'Facebook', icon: <FaFacebook />, link: 'https://www.facebook.com/' },
  { name: 'Instagram', icon: <FaInstagram />, link: 'https://www.instagram.com/' },
  { name: 'Twitter', icon: <FaTwitter />, link: 'https://twitter.com/' },
  { name: 'Discord', icon: <FaDiscord />, link: 'https://discord.com/' },
];

const Footer = () => {
  return (
    <footer className="w-full py-10 text-black bg-white">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Information */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-gray-700">About Us</h4>
            <p className="text-sm text-gray-600">
              We are an auction management system helping you bid, win, and manage auctions effectively.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-gray-700">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-sm text-gray-600">Home</a></li>
              <li><a href="/auctions" className="text-gray-600 ">Browse Auctions</a></li>
              <li><a href="/faq" className="text-sm text-gray-600">FAQ</a></li>
              <li><a href="/contact" className="text-sm text-gray-600">Contact Us</a></li>
            </ul>
          </div>
          {/* Contact Information */}
           <div>
           <h4 className="mb-4 text-lg font-semibold text-gray-700">Contact Information</h4>
          <ul className="space-y-2">
           <li className="text-sm text-gray-600">Email: </li>
           <li className="text-sm text-gray-600">Phone: </li>
           <li className="text-sm text-gray-600">Address: </li>
           <li className="text-sm text-gray-600">Country: </li>
           </ul>
        </div>

          {/* Newsletter Section */}
       <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-700">Subscribe to Our Newsletter</h4>
     <form className="flex space-x-2">
           <input
          type="email"
          placeholder="Enter your email"
           className="flex-1 px-4 py-2 text-sm text-gray-500 border border-gray-300 rounded-lg outline-none"
          />
         <button className="px-4 py-2 text-white bg-blue-950 border border-gray-800 rounded-lg hover:bg-[#000080]">
         Subscribe
        </button>
    </form>
  <p className="text-sm text-gray-600">You’ll get an email about once a month. We’ll never share your address.</p>

  {/* Social Media Section */}
  <div className="flex mt-4 space-x-4">
    {socialItems.map((item) => (
      <a
        key={item.name}
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 transition-colors hover:text-blue-950"
      >
        {React.cloneElement(item.icon, { size: 24 })}
      </a>
    ))}
  </div>
</div>

        </div>

        {/* Footer Bottom Section */}
        <div className="pt-8 mt-8 border-t border-gray-300">
          <p className="text-sm text-center text-gray-400">
            &copy; {new Date().getFullYear()} Auction Management System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
