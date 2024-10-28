import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import SearchBar from './Chatlist/SearchBar'
import List from './Chatlist/List'

const Empty = () => {
  const [isMobileScreen, setIsMobileScreen] = useState(false)

  const handleResize = () => {
    setIsMobileScreen(window.innerWidth < 640)
  }

  useEffect(() => {
    handleResize(); 

    window.addEventListener('resize', handleResize); 

    window.removeEventListener('resize', handleResize); 

  }, [])
  return (
    <>
    <div className='w-full border-l border-conversation-border bg-panel-header-background flex flex-col h-[100vh] border-b-4 border-b-icon-green items-center justify-center'>
      <Image src={"/whatsapp.gif"} alt='whatsapp drawing' width={isMobileScreen ? 180 : 300} height={isMobileScreen ? 180 : 300} priority={true} unoptimized/>
    </div>
    <SearchBar/>
    <List/>
    </>
  )
}

export default Empty