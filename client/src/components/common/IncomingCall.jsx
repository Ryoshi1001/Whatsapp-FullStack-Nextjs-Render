import { reducerCases } from '@/context/constants';
import { useStateProvider } from '@/context/StateContext';
import Image from 'next/image';
import React, { useEffect } from 'react'
import reducer from '@/context/StateReducers';

const IncomingCall = () => {
  const [{incomingVoiceCall, socket }, dispatch] = useStateProvider(); 


  const acceptCall = () => {
    console.log('acceptCall function used : from IncomingCall.jsx');

    // stopRingtone(); 
    // socket.current.emit('stop-ringtone'); 
    // dispatch({
    //   type: reducerCases.SET_RINGTONE_PLAYING, 
    //   isRingtonePlaying: false,  
    // })

    dispatch({
      type: reducerCases.SET_VOICE_CALL,
      voiceCall: {
        ...incomingVoiceCall,
        type: 'in-coming',
      },
    });

    socket.current.emit('accept-incoming-call', { id: incomingVoiceCall.id });
    dispatch({
      type: reducerCases.SET_INCOMING_VOICE_CALL,
      incomingVoiceCall: undefined,
    });
  };

  const rejectCall = () => {
    console.log('rejectCall function used : from IncomingCall.jsx');

    // stopRingtone(); 
    // socket.current.emit('stop-ringtone');
    // dispatch({
    //   type: reducerCases.SET_RINGTONE_PLAYING, 
    //   isRingtonePlaying: false, 
    // })
    
    socket.current.emit('reject-voice-call', { from: incomingVoiceCall.id });
    dispatch({
      type: reducerCases.END_CALL,
    });
  };


  return (
    <div>
       <div className="h-24 w-80 fixed bottom-20 right-4 z-30 rounded-sm flex gap-5 items-center justify-start p-4 bg-conversation-panel-background text-white drop-shadow-2xl border-icon-green border-2 py-14">
      <div>
        <Image
          src={incomingVoiceCall.profilePicture}
          height={68}
          width={68}
          alt="avatar"
          className="rounded-full"
        />
      </div>

      <div>
        <div>{incomingVoiceCall.name}</div>
        <div className="text-xs">Incoming Voice Call</div>
        <div className="flex gap-2 mt-2">
          <button
            className="bg-red-500 p-2 px-4 text-sm rounded-full"
            onClick={rejectCall}
          >
            Reject
          </button>
          <button
            className="bg-green-500 p-2 px-4 text-sm rounded-full"
            onClick={acceptCall}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
    </div>
  )
}

export default IncomingCall