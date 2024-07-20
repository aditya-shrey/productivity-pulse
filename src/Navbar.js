import React from 'react';
import logo from './assets/logo.png';

const Navbar = ({ signInWithGoogle }) => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <img className="h-11 w-auto mr-56" src={logo} alt="Logo" />
            <div className="hidden md:block">
              <div className="ml-4 flex items-baseline space-x-4">
                <a href="#" className="text-gray-800 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Home</a>
                <a href="#" className="text-gray-800 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Features</a>
                <a href="#" className="text-gray-800 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Help</a>
                <a href="#" className="text-gray-800 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Contact</a>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium">Sign Up</button>
              <button
                onClick={signInWithGoogle}
                className="ml-3 bg-secondary text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
