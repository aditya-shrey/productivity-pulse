import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';  // Import your firebase configuration

function HomePage() {
  return auth.currentUser && (
    <div>
      <h1>Welcome to Chat App</h1>
      <button onClick={() => {
        signOut(auth);
        console.log("User signed out");
      }}>Sign Out</button>
    </div>
  );
}

export default HomePage;
