import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, firestore } from '../../firebase/firebase';
import Navbar from '../../components/Navbar';
import Banner from '../../components/Banner';
import Footer from '../../components/Footer';

function SignInPage() {
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          _createdAt: serverTimestamp(),
          _email: user.email,
          _name: user.displayName,
          _teams: []
        });
        console.log('New user created in Firestore');
      }
    } catch (error) {
      console.error('SignIn error: ', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Navbar signInWithGoogle={signInWithGoogle} />
      <Banner className="py-4" />
      <div className="flex-grow flex flex-col justify-center items-center bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap justify-center items-stretch w-full max-w-7xl space-y-8 lg:space-y-0 lg:space-x-8">
          <div className="bg-white p-8 rounded-md shadow-xl flex-grow flex-shrink w-full max-w-md lg:w-1/3">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Why Use Productivity Pulse?</h2>
            <ul className="list-disc pl-5 text-gray-600">
              <li className="mb-2">Manage multiple teams seamlessly</li>
              <li className="mb-2">Assign and track tasks effortlessly</li>
              <li className="mb-2">Enhance team collaboration</li>
              <li className="mb-2">Increase productivity with powerful tools</li>
            </ul>
          </div>
          <div className="bg-white p-8 rounded-md shadow-xl flex-grow flex-shrink w-full max-w-md lg:w-1/3">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Get Started Today</h2>
            <p className="text-gray-600 mb-4">Set up your team on Productivity Pulse to boost your productivity and streamline your workflows.</p>
            <button className="w-full py-2 px-4 bg-primary text-white rounded-md shadow hover:bg-secondary transition duration-150 mb-4"
              onClick={signInWithGoogle}
            >
              Create an Account
            </button>
            <a href="/features" className="w-full py-2 px-4 bg-secondary text-white rounded-md shadow hover:bg-primary transition duration-150 text-center">
              Learn More
            </a>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full mt-8 lg:mt-8">
          <div className="bg-white p-8 rounded-md shadow-xl flex-grow flex-shrink w-full max-w-4xl">
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
      <Footer className="py-4" />
    </div>
  );
}

export default SignInPage;
