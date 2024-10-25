import { reducerCases } from '@/context/constants';
import { useStateProvider } from '@/context/StateContext';
import Image from 'next/image';
import React from 'react';
import reducer from '@/context/StateReducers';

const IncomingVideoCall = () => {
  const [{ incomingVideoCall, socket }, dispatch] = useStateProvider();

  const acceptCall = () => {
    dispatch({
      type: reducerCases.SET_VIDEO_CALL,
      videoCall: {
        ...incomingVideoCall,
        type: 'in-coming',
      },
    });
    socket.current.emit('accept-incoming-call', { id: incomingVideoCall.id });
    dispatch({
      type: reducerCases.SET_INCOMING_VIDEO_CALL,
      incomingVideoCall: undefined,
    });
    console.log('acceptCall function used : from incomingVideoCall.jsx');
  };

  const rejectCall = () => {
    socket.current.emit('reject-video-call', { from: incomingVideoCall.id });
    dispatch({
      type: reducerCases.END_CALL,
    });
    console.log('rejectCall function used : from incomingVideoCall.jsx');

  };

  return (
    <div className="h-24 w-80 fixed bottom-20 right-4 z-30 rounded-sm flex gap-5 items-center justify-start p-4 bg-conversation-panel-background text-white drop-shadow-2xl border-icon-green border-2 py-14">
      <div>
        <Image
          src={incomingVideoCall.profilePicture}
          height={68}
          width={68}
          alt="avatar"
          className="rounded-full"
        />
      </div>

      <div>
        <div>{incomingVideoCall.name}</div>
        <div className="text-xs">Incoming Video Call</div>
        <div className="flex gap-2 mt-2">
          <button
            className="bg-red-500 p-1 px-3 text-sm rounded-full"
            onClick={rejectCall}
          >
            Reject
          </button>
          <button
            className="bg-green-500 p-1 px-3 text-sm rounded-full"
            onClick={acceptCall}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingVideoCall;
