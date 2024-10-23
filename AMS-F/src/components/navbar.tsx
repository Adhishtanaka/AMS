import { useState, useEffect } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
 
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token);
  }, []); 

  const handleNav = () => {
    setNav(!nav);
  };

  const getLinks = () => {
    const baseLinks = [
      { name: "Home", link: "/" },
      { name: "Auctions", link: "/auctions" },
    ];

    if (isAuthenticated) {
      baseLinks.push({ name: "Profile", link: "/user-profile/Me" });
    } else {
      baseLinks.push({ name: "Login", link: "/login" });
    }

    return baseLinks;
  };

  const Links = getLinks();

  return (
    <div className='flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 text-black'>
      <h1 className='w-full text-3xl font-bold text-[#1D2945]'>AMS .</h1>
      
      {/* Desktop Navigation */}
      <ul className='hidden md:flex cursor-pointer'>
        {Links.map((link) => (
          <li key={link.name} className='md:ml-[60px]'>
            <Link 
              to={link.link} 
              className='p-4 hover:text-[#1D2945]'
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>

      <div onClick={handleNav} className='block md:hidden cursor-pointer'>
        {nav ? <AiOutlineClose size={20}/> : <AiOutlineMenu size={20} />}
      </div>

      {/* Mobile Navigation */}
      <ul className={nav 
        ? 'fixed left-0 top-0 w-[60%] h-full border-r border-r-gray-200 bg-white ease-in-out duration-500' 
        : 'ease-in-out duration-500 fixed left-[-100%]'
      }>
        <h1 className='w-full text-3xl font-bold text-[#1D2945] m-4'>AMS .</h1>
        <li className='p-4 border-b border-gray-200 hover:text-[#1D2945] cursor-pointer'>
          <Link to='/'>Home</Link>
        </li>
        <li className='p-4 border-b border-gray-200 hover:text-[#1D2945] cursor-pointer'>
          <Link to='/auctions'>Auctions</Link>
        </li>
        <li className='p-4 hover:text-[#1D2945] cursor-pointer'>
          <Link to={isAuthenticated ? '/user-profile/Me' : '/login'}>
            {isAuthenticated ? 'Profile' : 'Login'}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;