import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';

const Navbar = () => {
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  const Links =[
    {name:"Dashboard",link:"/"},
    {name:"Auctions",link:"/"},
    {name:"Contact",link:"/"},
  ];

  return (
    <div className='flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 text-black'>
      <h1 className='w-full text-3xl font-bold text-[#1D2945]'>AMS .</h1>
      <ul className='hidden md:flex cursor-pointer'>
        {
            Links.map((link)=>(
                <li key={link.name} className='md:ml-[60px]'>
                    <a href={link.link} className='p-4 hover:text-[#1D2945]'>{link.name}</a>
                </li>
            ))
        }
      </ul>
      <div onClick={handleNav} className='block md:hidden cursor-pointer'>
          {nav ? <AiOutlineClose size={20}/> : <AiOutlineMenu size={20} />}
      </div>
      <ul className={nav ? 'fixed left-0 top-0 w-[60%] h-full border-r border-r-gray-200 bg-white ease-in-out duration-500' : 'ease-in-out duration-500 fixed left-[-100%]'}>
        <h1 className='w-full text-3xl font-bold text-[#1D2945] m-4'>AMS .</h1>
          <li className='p-4 border-b border-gray-200 hover:text-[#1D2945]'><a>Dashboard</a></li>
          <li className='p-4 border-b border-gray-200 hover:text-[#1D2945]'><a>Auctions</a></li>
          <li className='p-4 hover:text-[#1D2945]'><a>Contact</a></li>
      </ul>
    </div>
  );
};

export default Navbar;