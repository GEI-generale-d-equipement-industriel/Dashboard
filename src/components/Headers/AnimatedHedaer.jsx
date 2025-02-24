import React from 'react';




const Header = () => {
  return (
    <header className="w-full bg-black">
    <div className="container mx-auto px-4 py-6 flex justify-center items-center">
      <img
        src="/assets/BeModel.png"
        alt="Company Logo"
        className="h-8 sm:h-10 md:h-12 w-auto object-contain transition-all duration-300 hover:scale-105"
      />
    </div>
  </header>
  );
};  

export default Header;
