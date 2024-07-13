import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebase';  // Import your firebase configuration

function SignInPage() {
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      console.log("User signed in");
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

export default SignInPage;
