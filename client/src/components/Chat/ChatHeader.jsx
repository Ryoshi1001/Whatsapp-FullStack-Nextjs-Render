import React, { useState } from 'react';
import Avatar from '../common/Avatar';
import { MdCall } from 'react-icons/md';
import { IoVideocam } from 'react-icons/io5';
import { BiSearchAlt2 } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useStateProvider } from '@/context/StateContext';
import { reducerCases } from '@/context/constants';
import ContextMenu from '../common/ContextMenu';

const ChatHeader = () => {
  const [{ currentChatUser, onlineUsers }, dispatch] = useStateProvider();

  const [contextMenuCoordinates, setContextMenuCoordinates] = useState({
    x: 0,
    y: 0,
  });
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);

  const showContextMenu = (e) => {
    e.preventDefault();
    setIsContextMenuVisible(true);
    setContextMenuCoordinates({ x: e.pageX - 50, y: e.pageY + 20 });
  };

  const contextMenuOptions = [
    {
      name: 'Exit',
      callback: async () => {
        dispatch({
          type: reducerCases.SET_EXIT_CHAT,
        });
      },
    },
  ];

  //roomId used by ZeggoCloud library
  const handleVoiceCall = () => {
    dispatch({
      type: reducerCases.SET_VOICE_CALL,
      voiceCall: {
        ...currentChatUser,
        type: 'out-going',
        callType: 'voice',
        roomId: Date.now(),
      },
    });
  };

  const handleVideoCall = () => {
    dispatch({
      type: reducerCases.SET_VIDEO_CALL,
      videoCall: {
        ...currentChatUser,
        type: 'out-going',
        callType: 'video',
        roomId: Date.now(),
      },
    });
  };

  return (
    <div className="xs:px-2 h-16 px-4 py-3 text-teal-light flex justify-between items-center bg-panel-header-background">
      <div className="xs:gap-3 xs:pr-3 flex items-center justify-center gap-6">
        <Avatar
          type={'sm'}
          image={
            currentChatUser
              ? currentChatUser.profilePicture
              : '/default_avatar.png'
          }
        />
        <div className="flex flex-col">
          <span className="xs:text-[12px] text-primary-strong">{currentChatUser?.name}</span>
          <span className="xs:text-[12px] text-secondary text-sm">
            {
              onlineUsers.includes(currentChatUser.id) ? "online" : "offline"
            }
          </span>
        </div>
      </div>

      <div className="flex gap-6">
        <MdCall
          className=" text-panel-header-icon cursor-pointer text-2xl"
          onClick={handleVoiceCall}
        />
        <IoVideocam
          className="text-panel-header-icon cursor-pointer text-2xl"
          onClick={handleVideoCall}
        />
        <BiSearchAlt2
          className="text-panel-header-icon cursor-pointer text-2xl"
          onClick={() =>
            dispatch({
              type: reducerCases.SET_MESSAGE_SEARCH,
            })
          }
        />
        <BsThreeDotsVertical
          className="text-panel-header-icon cursor-pointe text-2xl cursor-pointer"
          id="context-opener"
          onClick={(e) => {showContextMenu(e)}}
        />
        {isContextMenuVisible && (
          <ContextMenu
            options={contextMenuOptions}
            coordinates={contextMenuCoordinates}
            contextMenu={isContextMenuVisible}
            setContextMenu={setIsContextMenuVisible}
          />
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
