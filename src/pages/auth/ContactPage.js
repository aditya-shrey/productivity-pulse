import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

function ContactPage() {
  const [messageSent, setMessageSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  
    setMessageSent(true);

  
    setFormData({ name: '', email: '', message: '' });

 
    setTimeout(() => setMessageSent(false), 2000);
  };

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden">
      <Navbar />
      <div className="flex-grow flex flex-col justify-center items-center bg-white px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-8 rounded-md shadow-xl w-full max-w-3xl border">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h1>
          <p className="text-gray-600 mb-6">
            If you have any questions or need assistance, feel free to reach out to us using the form below!
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Your Name"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Your message..."
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-primary text-white rounded-md shadow hover:bg-secondary transition duration-150"
            >
              Send Message
            </button>
          </form>
        </div>
        {messageSent && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-md shadow-lg flex items-center">
              <svg
                className="h-8 w-8 text-green-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div>
                <p className="font-bold text-lg">Message sent</p>
                <p className="text-sm text-gray-600">We'll reach out soon!</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer className="py-4" />
    </div>
  );
}

export default ContactPage;
