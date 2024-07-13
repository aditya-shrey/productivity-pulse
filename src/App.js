import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

import SignInPage from './SignInPage';
import ChatRoomPage from './ChatRoomPage';
import HomePage from './HomePage';

function App() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    console.log("Loading user...");
    return <div>Loading...</div>;
  }

  if (error) {
    console.error("Authentication error: ", error);
    return <div>Error: {error.message}</div>;
  }

  console.log("User: ", user);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <HomePage /> : <Navigate to="/signin" />} />
        <Route path="/signin" element={!user ? <SignInPage /> : <Navigate to="/" />} />
        <Route path="/chat" element={user ? <ChatRoomPage /> : <Navigate to="/signin" />} />
      </Routes>
    </Router>
  );
}

export default App;
