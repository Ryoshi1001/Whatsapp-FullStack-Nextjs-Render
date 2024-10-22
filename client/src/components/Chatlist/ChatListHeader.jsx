import React, { useState } from 'react';
import Avatar from '../common/Avatar';
import { useStateProvider } from '@/context/StateContext';
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from 'react-icons/bs';
import axios from 'axios';
import { reducerCases } from '@/context/constants';
import { Router, useRouter } from 'next/router';
import ContextMenu from '../common/ContextMenu';

const ChatListHeader = () => {
  const [{ userInfo }, dispatch] = useStateProvider();

  const router = useRouter();
  const [contextMenuCoordinates, setContextMenuCoordinates] = useState({
    x: 0,
    y: 0,
  });
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);

  const showContextMenu = (e) => {
    e.preventDefault();
    setIsContextMenuVisible(true);
    setContextMenuCoordinates({ x: e.pageX, y: e.pageY });
  };

  const contextMenuOptions = [
    {
      name: 'Logout',
      callback: async () => {
        setIsContextMenuVisible(false);
        router.push('/logout');
      },
    },
  ];

  const handleLogout = () => {};

  const handleAllContactsPage = async () => {
    dispatch({
      type: reducerCases.SET_ALL_CONTACTS_PAGE,
    });
  };

  return (
    <div className="xs:px-2 flex flex-row xs:flex-col xs:h-24 xs:gap-3 justify-between items-center h-16 px-4 py-3 overflow-hidden">
      <div className="cursor-pointer">
        <Avatar type={'sm'} image={userInfo?.profileImage} />
      </div>
      <div className="xs:gap-3 xs:flex xs:justify-between flex gap-6">
        <BsFillChatLeftTextFill
          className="text-panel-header-icon cursor-pointer text-xl w-full h-full"
          title="New Chat"
          onClick={handleAllContactsPage}
        />
        <>
          <BsThreeDotsVertical
            className="text-panel-header-icon cursor-pointer text-2xl w-full h-full"
            title="Menu"
            id="context-opener"
            onClick={(e) => {
              showContextMenu(e);
            }}
          />
        </>
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

export default ChatListHeader;
