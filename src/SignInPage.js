import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, firestore } from './firebase';
import Navbar from './Navbar';
import Banner from './Banner';
import Footer from './Footer';

function SignInPage() {
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
    <div className="flex flex-col min-h-screen">
      <Navbar signInWithGoogle={signInWithGoogle} />
      <Banner />
      <div className="flex-grow flex flex-col justify-center items-center bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center items-stretch w-full max-w-7xl space-y-8 lg:space-y-0 lg:space-x-8">
          <div className="bg-white p-8 rounded-md shadow-xl w-full max-w-md lg:w-1/3">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Why Use Productivity Pulse?</h2>
            <ul className="list-disc pl-5 text-gray-600">
              <li className="mb-2">Manage multiple teams seamlessly</li>
              <li className="mb-2">Assign and track tasks effortlessly</li>
              <li className="mb-2">Enhance team collaboration</li>
              <li className="mb-2">Increase productivity with powerful tools</li>
            </ul>
          </div>
          <div className="bg-white p-8 rounded-md shadow-xl w-full max-w-md lg:w-1/3">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Get Started Today</h2>
            <p className="text-gray-600 mb-4">Join thousands of teams already using Productivity Pulse to boost their productivity and streamline their workflows.</p>
            <button className="w-full py-2 px-4 bg-primary text-white rounded-md shadow hover:bg-secondary transition duration-150 mb-4">
              Create an Account
            </button>
            <button className="w-full py-2 px-4 bg-secondary text-white rounded-md shadow hover:bg-primary transition duration-150">
              Learn More
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full mt-8 lg:mt-12">
          <div className="bg-white p-8 rounded-md shadow-xl w-full max-w-4xl">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">Sign In To Your Console</h1>
            <button
              onClick={signInWithGoogle}
              className="w-full py-2 px-4 bg-primary text-white rounded-md shadow hover:bg-secondary transition duration-150 mb-4"
            >
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SignInPage;
