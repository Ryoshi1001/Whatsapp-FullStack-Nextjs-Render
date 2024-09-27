import Avatar from '@/components/common/Avatar';
import Input from '@/components/common/Input';
import { reducerCases } from '@/context/constants';
import { useStateProvider } from '@/context/StateContext';
import { ONBOARD_USER_ROUTE } from '@/utils/ApiRoutes';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const onboarding = () => {
  const router = useRouter();
  const [{ userInfo, newUser }, dispatch] = useStateProvider();
  const [name, setName] = useState(userInfo?.name || '');
  const [about, setAbout] = useState('');
  const [image, setImage] = useState('/default_avatar.png');

  useEffect(() => {
    if (!newUser && !userInfo?.email) {
      router.push('/login');
    } else if (!newUser && userInfo?.email) {
      router.push('/');
    }
  }, [newUser, userInfo, router]);

  const onboardUserHandler = async () => {
    if (validateDetails()) {
      const email = userInfo.email;
      try {
        const { data } = await axios.post(ONBOARD_USER_ROUTE, {
          email,
          name,
          about,
          image,
        });

        if (data.status) {
          dispatch({
            type: reducerCases.SET_NEW_USER,
            newUser: false,
          });
          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: {
              id: data.id, 
              name,
              email,
              profileImage: image,
              status: about,
            },
          });
          router.push('/');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const validateDetails = () => {
    if (name.length < 3) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-panel-header-background justify-center items-center text-white overflow-hidden">
      <div className="flex items-center justify-center gap-2">
        <Image
          src="/whatsapp.gif"
          width={300}
          height={300}
          alt="whatsapp logo animation"
          priority={true}
        />
        <span className="text-7xl">Whatsapp</span>
      </div>
      <h2 className="text-2xl">Create your profile</h2>
      <div className="flex gap-6 mt-6 flex-row items-center justify-center">
        <div className="flex flex-col items-center justify-center mt-5 gap-6 text-white">
          <Input name="Display Name" state={name} setState={setName} label />
          <Input name="About" state={about} setState={setAbout} label />
          <div className="flex justify-center items-center">
            <button
              className="flex items-center justify-center text-white bg-search-input-container-background p-5 rounded-lg gap-7"
              onClick={onboardUserHandler}
            >
              Create Profile
            </button>
          </div>
        </div>
        <Avatar type={'xl'} image={image} setImage={setImage} />
      </div>
    </div>
  );
};

export default onboarding;
