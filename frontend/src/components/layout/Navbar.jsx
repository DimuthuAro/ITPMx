import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-[#101649] backdrop-blur-lg overflow-hidden flex justify-center h-[60px] pt-4 pb-2.5">
      <ul className="flex">
        <li className="inline-block p-4 border-r border-gray-700">
          <a href="#" className="text-white no-underline px-5 py-3.5 hover:font-bold">Home</a>
        </li>
        <li className="inline-block p-4 border-r border-gray-700">
          <a href="#" className="text-white no-underline px-5 py-3.5 hover:font-bold">Dashboard</a>
        </li>
        <li className="inline-block p-4 border-r border-gray-700">
          <a href="#" className="text-white no-underline px-5 py-3.5 hover:font-bold">Profile</a>
        </li>
        <li className="inline-block p-4">
          <a href="#" className="text-white no-underline px-5 py-3.5 hover:font-bold">Settings</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar; 