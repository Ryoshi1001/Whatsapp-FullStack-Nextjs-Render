import { useStateProvider } from '@/context/StateContext'
import dynamic from 'next/dynamic'
import React, { useEffect } from 'react'
import Container from './Container'

const VideoCall = () => {
  const [{videoCall, socket, userInfo}] = useStateProvider()
  
  useEffect(() => {
    if(videoCall.type === "out-going"){
      console.log("videCall userInfo", userInfo)
      socket.current.emit("outgoing-video-call", {
        to: videoCall.id, 
        from: {
          id: userInfo.id, 
          profilePicture: userInfo.profileImage, 
          name: userInfo.name, 
        }, 
        callType: videoCall.callType, 
        roomId: videoCall.roomId, 
      })
    }
  }, [videoCall])

  return (
    <Container data={videoCall}/>
  )
}

export default VideoCall