import { CHECK_USER_ROUTE } from '@/utils/ApiRoutes.js';
import { firebaseAuth } from '../utils/FirebaseConfig.js';
import axios from 'axios';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useRouter } from 'next/router.js';
import { useStateProvider } from '@/context/StateContext.jsx';
import { reducerCases } from '@/context/constants.js';

const Login = () => {
  //using NextJS useRouter
  const router = useRouter();

  //setting state of user
  const [{userInfo, newUser}, dispatch] = useStateProvider();

  const [isMobileScreen, setIsMobileScreen] = useState(false); 

  const handleResize = () => {
    setIsMobileScreen(window.innerWidth < 640)
  }

  useEffect(() => {
    handleResize(); 

    window.addEventListener("resize", handleResize); 

    window.removeEventListener('resize', handleResize)
  }, [])



  //useEffect 
  useEffect(() => {
    console.log({userInfo, newUser})
    if (userInfo?.id && !newUser) {
      router.push('/')
    }
  }, [userInfo, newUser])
  
  const handleLogin = async () => {
    console.log('Starting login process...');
    try {
      const provider = new GoogleAuthProvider();
      console.log('Attempting to sign in with Google...');
      
      const {
        user: { displayName: name, email, photoURL: profileImage },
      } = await signInWithPopup(firebaseAuth, provider);
      
      console.log('User signed in successfully:', { name, email, profileImage });
  
      // Sending the email to the backend to check if user exists
      console.log('Sending email to backend for user check:', email);
      console.log('Checking user at:', CHECK_USER_ROUTE);
      const { data } = await axios.post(CHECK_USER_ROUTE, { email });
      
      console.log('Received response from backend:', { data });
  
      if (!data.status) {
        console.log('New user detected. Redirecting to onboarding...');
        dispatch({
          type: reducerCases.SET_NEW_USER,
          newUser: true,
        });
        dispatch({
          type: reducerCases.SET_USER_INFO,
          userInfo: {
            name,
            email,
            profileImage,
            status: '',
          },
        });
        router.push('/onboarding');
      } else {
        console.log('Existing user found. Updating user info...');
        const { id, name, email, profilePicture: profileImage, status } = data.data;
        dispatch({
          type: reducerCases.SET_USER_INFO,
          userInfo: {
            id,
            name,
            email,
            profileImage,
            status
          },
        });
        router.push('/');
      }
    } catch (error) {
      console.error('Login error:', error.message);
    }
  };
  return (
    <div className="flex justify-center items-center bg-panel-header-background h-screen w-screen flex-col gap-6 overflow-clip">
      <div className="flex justify-center items-center text-white gap-2 ">
        <Image
          src="/whatsapp.gif"
          alt="whatsapp logo animation"
          priority={true}
          width={isMobileScreen ? 100 : 300}
          height={isMobileScreen ? 100 : 300}
        />
        <span className="xs:text-5xl text-7xl">Whatsapp</span>
      </div>
      <button
        className="flex items-center justify-center text-white bg-search-input-container-background p-5 rounded-lg gap-7"
        onClick={handleLogin}
      >
        <FcGoogle className="text-3xl" />
        <span className="xs:text-xl text-2xl">Login with Google</span>
      </button>
    </div>
  );
};

export default Login;
