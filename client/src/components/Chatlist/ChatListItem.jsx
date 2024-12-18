import React, { useEffect, useState } from 'react';
import Avatar from '../common/Avatar';
import { useStateProvider } from '@/context/StateContext';
import { reducerCases } from '@/context/constants';
import CalculateTime from '@/utils/CalculateTime';
import MessageStatus from '../common/MessageStatus';
import { FaCamera, FaMicrophone } from 'react-icons/fa';
import { setPersistence } from 'firebase/auth';

const ChatListItem = ({ data, isContactsPage = false }) => {
  const [{ userInfo, currentChatUser }, dispatch] = useStateProvider();
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  //resize of avatar for mobile function
  const handleResize = () => {
    setIsMobileScreen(window.innerWidth < 640);
  };

  //useEffect to resize avatar for mobile
  useEffect(() => {
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleContactClick = () => {
    console.log("Contact data:", data); // Check what data contains
    console.log("Contact data:", data); // Check what data contains
    console.log("Profile Picture URL:", data.profilePicture); // Log profile picture URL
    // Existing dispatch logic...
      // Validate profile picture URL
  const profilePictureUrl = data.profilePicture && data.profilePicture.startsWith('http')
  ? data.profilePicture // Use Cloudinary URL if valid
  : data.profilePicture.startsWith('/') ? `${data.profilePicture}`
  :  `/avatars${data.profilePicture}` // Fallback if not valid

    if (!isContactsPage) {
      dispatch({
        type: reducerCases.CHANGE_CURRENT_CHAT_USER,
        user: {
          name: data.name,
          about: data.about,
          profilePicture: profilePictureUrl,
          email: data.email,
          id: userInfo.id === data.senderId ? data.receiverId : data.senderId,
        },
      });
    } else {
      dispatch({
        type: reducerCases.CHANGE_CURRENT_CHAT_USER,
        user: { ...data, profilePictureUrl },
      });
      dispatch({
        type: reducerCases.SET_ALL_CONTACTS_PAGE,
      });
    }
  };

  return (
    <div
      className={`flex cursor-pointer hover:bg-background-default-hover xs:flex xs:flex-col xs:items-start`}
      onClick={handleContactClick}
    >
      <div className="xs:px-2 min-w-fit px-5 pt-3 pb-1 \">
        <Avatar
          className="xs:type-[lg]"
          image={data?.profilePicture}
          type={isMobileScreen ? 'lg' : 'lg'}
        />
      </div>
      <div className="xs:px-2 min-h-full flex flex-col justify-center mt-3 pr-2 w-full text-xs sm:text-sm">
        <div className="flex flex-row xs:flex-col xs:gap-1 justify-between">
          <div>
            <span className="text-white">{data?.name}</span>
          </div>
          {!isContactsPage && (
            <div>
              <span
                className={`${
                  !data.totalUnreadMessages > 0
                    ? 'text-secondary'
                    : 'text-icon-green'
                } text-sm`}
              >
                {CalculateTime(data.createdAt)}
              </span>
            </div>
          )}
        </div>
        <div className="flex border-b border-conversation-border pb-3 pt-1 pr-2">
          <div className="flex flex-row xs:flex-col xs:gap-1 justify-between w-full">
            <span className="text-secondary line-clamp-1 text-sm ">
              {isContactsPage ? (
                data?.about || '\u00A0'
              ) : (
                <div className="flex items-center gap-1 max-w-[200px]sm:max-w-[250px] md:max-w-[300px] lg:max-w-[200px] xl:max-w-[300px]">
                  {data.senderId === userInfo.id && (
                    <MessageStatus messageStatus={data.messageStatus} />
                  )}
                  {data.type === 'text' && (
                    <span className="truncate">{data.message}</span>
                  )}
                  {data.type === 'audio' && (
                    <span className="flex gap-1 items-center">
                      <FaMicrophone className="text-panel-header-icon" />
                      Audio
                    </span>
                  )}
                  {data.type === 'image' && (
                    <span className="flex gap-1 items-center">
                      <FaCamera className="text-panel-header-icon" />
                      Image
                    </span>
                  )}
                </div>
              )}
            </span>
            {data.totalUnreadMessages > 0 && (
              <div>
                {' '}
                <span className="bg-icon-green px-[8px] py-[4px] text-sm rounded-full">
                  {data.totalUnreadMessages}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;
