import React from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';

function HomePage() {
  const navigate = useNavigate();

  return auth.currentUser && (
    <div>
      <center>
        <h1>Welcome to Chat App</h1>
        <button onClick={() => {
          signOut(auth);
          console.log("User signed out");
        }}>Sign Out</button>
        <button onClick={() => {
          navigate('/chat');
          console.log("User moves to chat room");
        }}>Chat</button>
      </center>
    </div>
  );
}

export default HomePage;