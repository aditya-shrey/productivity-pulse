import React, { useState } from 'react';
import Confetti from 'react-confetti';
import './App.css';

function App() {
  const [showConfetti, setShowConfetti] = useState(false);

  const handleConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000); // Confetti will disappear after 3 seconds
  };

  return (
    <div className="App">
      <header className="bg-blue-500 text-white p-4">
        <h1 className="text-2xl font-bold">Pulse Productivity Baby!</h1>
      </header>
      <main className="p-4">
        <p className="text-lg">
           All frontend files will go in src. For CSS styling check out both tailwind.config.js and src/app.css
        </p>
        <button 
          className="mt-4 bg-green-500 text-white p-2 rounded hover:bg-green-600"
          onClick={handleConfetti}
        >
          Press for Confetti
        </button>
      </main>
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
    </div>
  );
}

export default App;

//To run cd into pulse-productivity and run "npm start"