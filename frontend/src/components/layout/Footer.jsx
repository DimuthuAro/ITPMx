import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-5 text-center">
      <p>&copy; 2024 ITPM System. All rights reserved.</p>
      <div className="mt-2.5">
        <a href="#" className="text-white no-underline hover:underline">Privacy Policy</a>
        <a href="#" className="text-white no-underline hover:underline mx-2.5">Terms of Service</a>
        <a href="#" className="text-white no-underline hover:underline">Contact Us</a>
      </div>
      <div className="mt-2.5">
        <a href="#" className="mx-2.5 inline-block">
          <img src="/facebook-icon.png" alt="Facebook" className="w-6 h-6" />
        </a>
        <a href="#" className="mx-2.5 inline-block">
          <img src="/twitter-icon.png" alt="Twitter" className="w-6 h-6" />
        </a>
        <a href="#" className="mx-2.5 inline-block">
          <img src="/linkedin-icon.png" alt="LinkedIn" className="w-6 h-6" />
        </a>
      </div>
    </footer>
  );
};

export default Footer; 