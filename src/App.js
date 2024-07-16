import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

import SignInPage from './SignInPage';
//import HomePage from './HomePage';
import DashboardPage from './DashboardPage';
import TeamDashboardPage from './TeamDashboardPage';

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

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <SignInPage />} />
        <Route path="/signin" element={!user ? <SignInPage /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/signin" />} />
        <Route path="/team/:teamId" element={user ? <TeamDashboardPage /> : <Navigate to="/signin" />} />
      </Routes>
    </Router>
  );
}

export default App;
