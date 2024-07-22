import React, { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, firestore } from '../../firebase/firebase';
import { useNavigate } from 'react-router-dom';

function SignInPage() {
  const [view, setView] = useState('buttons'); // buttons, signingIn, signUp
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error("Error during sign in: ", error);
      alert("Error during sign in: " + error.message);
    }
  };

  const handleLogIn = async () => {
    try {
      const user = await handleGoogleSignIn();
      if (!user) return;

      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        // User exists, proceed to dashboard
        console.log("User exists. Logging in...");
        navigate('/dashboard');
      } else {
        // User does not exist, prompt sign up
        alert("User does not exist. Please sign up.");
        setView('signUp');
      }
    } catch (error) {
      console.error("LogIn error: ", error);
    }
  };

  const handleSignUp = async () => {
    try {
      const user = await handleGoogleSignIn();
      if (!user) return;

      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // If user doesn't exist, create a new user entry
        await setDoc(userDocRef, {
          _createdAt: serverTimestamp(),
          _email: user.email,
          _name: user.displayName,
          _photoURL: user.photoURL,
          _teams: []
        });
        console.log("New user created in Firestore");
      }
      navigate('/dashboard');
    } catch (error) {
      console.error("SignUp error: ", error);
    }
  };

  if (view === 'signUp') {
    return (
      <div>
        <center>
          <h1>Signing Up...</h1>
          <button onClick={handleSignUp}>Sign Up with Google</button>
        </center>
      </div>
    );
  }

  return (
    <div>
      <center>
        <h1>Welcome</h1>
        {view === 'buttons' && (
          <>
            <button onClick={handleLogIn}>Log In</button>
            <button onClick={() => setView('signUp')}>Sign Up</button>
            <button onClick={() => navigate('/contact')}>Contact</button>
          </>
        )}
      </center>
    </div>
  );
}

export default SignInPage;
