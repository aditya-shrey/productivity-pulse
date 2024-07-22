import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, firestore } from '../firebase/firebase';

function HomePage() {
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // If user doesn't exist, create a new user entry
        await setDoc(userDocRef, {
          _createdAt: serverTimestamp(),
          _email: user.email,
          _name: user.displayName,
          _teams: []
        });
        console.log("New user created in Firestore");
      }
    } catch (error) {
      console.error("SignIn error: ", error);
    }
  }

  return (
    <div>
      <center>
        <h1>Sign In</h1>
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      </center>
    </div>
  );
}

export default HomePage;
