import { useStateProvider } from '@/context/StateContext'
import React, { useState } from 'react'
import { BsEmojiSmile } from 'react-icons/bs'
import { FaMicrophone } from 'react-icons/fa'
import { ImAttachment } from 'react-icons/im'
import { MdSend } from 'react-icons/md'
const MessageBar = () => {
  //code for when clicking send btn in messageBar on bottom of app screen for text messages
  const [{userInfo, currentChatUser}, dispatch] = useStateProvider(); 
  const [message, setMessage] = useState('')
  const sendMessage = async () => {
alert(message)
  }

  return (
    <div
    className='bg-panel-header-background h-20 px-4 flex items-center justify-center gap-6 relative'>
      <>
      <div className="flex items-center justify-center gap-6">
        <BsEmojiSmile className='text-panel-header-icon cursor-pointer text-xl' title='Emoji'/>
        <ImAttachment className='text-panel-header-icon cursor-pointer text-xl' title='Attach File'/>
      </div>
      <div className='w-full rounded-lg h-10 flex items-center'>
        <input type="text" placeholder='Type a message' className='bg-input-background text-sm focus:outline-none text-white px-5 h-10 rounded-lg py-4 w-full'
        onChange={(e) => setMessage(e.target.value)}
        value={message} />
      </div>
      <div className='w-10 items-center justify-center'>
        <button>
          <MdSend className='text-panel-header-icon cursor-pointer text-xl' title='Send Message'
          onClick={sendMessage}
          />
          {/* <FaMicrophone className='text-panel-header-icon cursor-pointer text-xl' title='Record'/> */}
        </button>

      </div>
      </>
    </div>
  )
}

export default MessageBar