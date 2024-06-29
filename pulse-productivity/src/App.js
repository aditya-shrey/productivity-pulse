import React from 'react';
import './App.css';

const App = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-background-dark">
      <header className="bg-primary-dark text-white p-6 flex justify-between items-center">
        <h1 className="text-4xl font-bold">Pulse Productivity</h1>
        <nav className="space-x-4">
          <a href="#features" className="hover:text-secondary-light transition-colors pr-6 duration-200">Features</a>
          <a href="#about" className="hover:text-secondary-light transition-colors pr-6 duration-200">About</a>
          <a href="/projects" className="hover:text-secondary-light transition-colors duration-200">Login / SignUp</a>
          <a href="/tasklist" className="hover:text-secondary-light transition-colors duration-200">Task List</a>
        </nav>
      </header>
      <main className="text-center py-20 px-4">
        <h2 className="text-6xl font-bold mb-8 text-white">All in One Project Manager</h2>
        <p className="text-lg mb-12 text-white dark:text-dark">
          Discover a new way to jumpstart your next project without all the hassle.
        </p>
        <a href="/projects" className="bg-primary-dark text-white px-6 py-3 rounded-full text-xl font-semibold shadow-lg hover:bg-primary-light transition-transform transform hover:scale-105">
          Get Started
        </a>
      </main>
      <section id="features" className=" pb-22 px-60 bg-primary-DEFAULT">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <a href="/tasklist" className="p-6 bg-white dark:bg-primary-dark shadow-lg rounded-lg transform hover:scale-105 transition-transform block">
            <h3 className="text-2xl font-semibold mb-4">Task List</h3>
            <p>Organize and prioritize your tasks with ease.</p>
          </a>
          <div className="p-6 bg-white dark:bg-primary-dark shadow-lg rounded-lg transform hover:scale-105 transition-transform">
            <h3 className="text-2xl font-semibold mb-4">Goal Setting</h3>
            <p>Set and track your goals to stay motivated.</p>
          </div>
          <div className="p-6 bg-white dark:bg-primary-dark shadow-lg rounded-lg transform hover:scale-105 transition-transform">
            <h3 className="text-2xl font-semibold mb-4">Task Management</h3>
            <p>Organize and prioritize your tasks with ease.</p>
          </div>
          <div className="p-6 bg-white dark:bg-primary-dark shadow-lg rounded-lg transform hover:scale-105 transition-transform">
            <h3 className="text-2xl font-semibold mb-4">Goal Setting</h3>
            <p>Set and track your goals to stay motivated.</p>
          </div>
          
          {/* <div className="p-6 bg-white dark:bg-primary-dark shadow-lg rounded-lg transform hover:scale-105 transition-transform">
            <h3 className="text-2xl font-semibold mb-4">Analytics</h3>
            <p>Analyze your productivity patterns and improve.</p>
          </div> */}
        </div>
      </section>
      
      
      <footer className="py-6 pt-5 bg-primary-dark text-white text-center">
        &copy; 2024 Pulse Productivity. All rights reserved.
      </footer>
    </div>
    
  );
}

export default App;
