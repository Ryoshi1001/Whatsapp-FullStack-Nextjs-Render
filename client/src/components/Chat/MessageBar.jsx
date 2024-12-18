//MessageBar component using Cloudinary website.
import { reducerCases } from '@/context/constants';
import { useStateProvider } from '@/context/StateContext';
import { ADD_IMAGE_MESSAGE_ROUTE, ADD_MESSAGE_ROUTE } from '@/utils/ApiRoutes';
import EmojiPicker from 'emoji-picker-react';
import React, { useState, useEffect, useRef } from 'react';
import { BsEmojiSmile } from 'react-icons/bs';
import { ImAttachment } from 'react-icons/im';
import { MdSend } from 'react-icons/md';
import PhotoPicker from '../common/PhotoPicker';
import axios from 'axios';
import { FaMicrophone } from 'react-icons/fa';
import dynamic from 'next/dynamic';

const CaptureAudio = dynamic(() => import("../common/CaptureAudio"), {
  ssr: false, 
})


const MessageBar = () => {
  const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvider();
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const [grabPhoto, setGrabPhoto] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);

  const photoPickerChange = async (e) => {
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME); 

      const response = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, formData); 


      if (response.status === 200) {
        //url for upload
        const imageUrl = response.data.secure_url; 

        socket.current.emit('send-msg', {
          to: currentChatUser?.id,
          from: userInfo?.id,
          //send img Url
          type: 'image', 
          message: imageUrl,
        });
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: {
            message: imageUrl, 
            type: "image", 
            fromSelf: true, 
            senderId: userInfo.id, 
            createdAt: new Date(), 
          },
        });
        console.log("sent drawing text")
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.id !== 'emoji-modal-window') {
        if (
          emojiPickerRef.current &&
          !emojiPickerRef.current.contains(e.target)
        ) {
          setShowEmojiPicker(false);
        }
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  //Emoji modal function
  const handleEmojiModal = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emoji) => {
    setMessage((prev) => (prev += emoji.emoji));
  };

  useEffect(() => {
    if (socket && socket.current) {
      socket.current.on('connect', () => {
        console.log('Connected to WebSocket');
      });

      socket.current.on('disconnect', () => {
        console.log('Disconnected from WebSocket');
      });
    }
  }, [socket]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      const { data } = await axios.post(ADD_MESSAGE_ROUTE, {
        to: currentChatUser?.id,
        from: userInfo?.id,
        message,
      });

      socket.current.emit('send-msg', {
        to: currentChatUser?.id,
        from: userInfo?.id,
        message: message, 
        type: 'text',
      });
      console.log('Message sent:', data.msg);

      dispatch({
        type: reducerCases.ADD_MESSAGE,
        newMessage: {
          message:message, 
          type: 'text', 
          senderId: userInfo.id,
          fromSelf: true,
          createdAt: new Date()
        },
      });
      setMessage('');
    } catch (error) {
      console.error(
        'Error sending message:',
        error.response?.data?.error || error.message
      );
    }
  };

  useEffect(() => {
    const inputElement = document.querySelector('input[type="text"]');
    if (inputElement) {
      inputElement.addEventListener('focus', () => {
        if (socket && socket.current) {
          socket.current.emit('cursor-focus', { userId: userInfo.id });
        }
      });

      inputElement.addEventListener('blur', () => {
        if (socket && socket.current) {
          socket.current.emit('cursor-blur', { userId: userInfo.id });
        }
      });
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener('focus', () => {});
        inputElement.removeEventListener('blur', () => {});
      }
    };
  }, [userInfo]);

  useEffect(() => {
    if (grabPhoto) {
      const data = document.getElementById('photo-picker');
      data.click();
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setGrabPhoto(false);
        }, 1000);
      };
    }
  }, [grabPhoto]);

  return (
    <div className="xs:absolute xs:py-4 xs:bottom-0 xs:left-0 xs:right-0 xs:z-20 xs:w-full  bg-panel-header-background px-4 py-6 h-24 flex items-center justify-center relative">
      {
        !showAudioRecorder && (
          <>
          <div className="xs:flex-col px-1 flex gap-3 items-center justify-center">
            <BsEmojiSmile
              className="text-panel-header-icon cursor-pointer text-3xl xs:text-md"
              title="Emoji"
              id="emoji-modal-window"
              onClick={handleEmojiModal}
            />
            {showEmojiPicker && (
              <div
                className="absolute bottom-24 left-16 z-30"
                id="emoji-modal"
                ref={emojiPickerRef}
              >
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  theme="dark"
                  emojiStyle="apple"
                />
              </div>
            )}
            <ImAttachment
              className="text-panel-header-icon cursor-pointer text-3xl xs:text-md"
              title="Attach File"
              onClick={() => setGrabPhoto(true)}
            />
          </div>
          <div className="w-full rounded-lg h-10 flex items-center mx-3">
            <input
              type="text"
              placeholder="Type a message"
              className="xs:px-2 xs:h-14 xs:text-[14px] bg-input-background text-[16px] focus:outline-none text-white px-5 h-10 rounded-lg py-4 w-full"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              onKeyDown={(e) => {
                if (e.key === "Enter"){
                  e.preventDefault(); 
                  sendMessage(); 
                }
              }}
            />
          </div>
          <div className="w-auto flex items-center justify-center">
            <button 
            onClick={sendMessage}
            >
              {message.length ? (
                <MdSend
                  className="text-panel-header-icon cursor-pointer text-3xl"
                  title="Send Message"
                />
              ) : (
                <FaMicrophone
                  className=" text-panel-header-icon cursor-pointer text-3xl"
                  title="Record"
                  onClick={() => setShowAudioRecorder(true)}
                />
              )}
            </button>
          </div>
          </>
        )
      }
      {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
      {showAudioRecorder && <CaptureAudio hide={setShowAudioRecorder} />}
    </div>
  );
};

export default MessageBar;








//MessageBar component using Multer for file uploads. 

// import { reducerCases } from '@/context/constants';
// import { useStateProvider } from '@/context/StateContext';
// import { ADD_IMAGE_MESSAGE_ROUTE, ADD_MESSAGE_ROUTE } from '@/utils/ApiRoutes';
// import EmojiPicker from 'emoji-picker-react';
// import React, { useState, useEffect, useRef } from 'react';
// import { BsEmojiSmile } from 'react-icons/bs';
// import { ImAttachment } from 'react-icons/im';
// import { MdSend } from 'react-icons/md';
// import PhotoPicker from '../common/PhotoPicker';
// import axios from 'axios';
// import { FaMicrophone } from 'react-icons/fa';
// import dynamic from 'next/dynamic';

// const CaptureAudio = dynamic(() => import("../common/CaptureAudio"), {
//   ssr: false, 
// })


// const MessageBar = () => {
//   const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvider();
//   const [message, setMessage] = useState('');
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const emojiPickerRef = useRef(null);
//   const [grabPhoto, setGrabPhoto] = useState(false);
//   const [showAudioRecorder, setShowAudioRecorder] = useState(false);

//   const photoPickerChange = async (e) => {
//     try {
//       const file = e.target.files[0];
//       const formData = new FormData();
//       formData.append('image', file);
//       const response = await axios.post(ADD_IMAGE_MESSAGE_ROUTE, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         params: {
//           from: userInfo.id,
//           to: currentChatUser.id,
//         },
//       });
//       if (response.status === 201) {
//         socket.current.emit('send-msg', {
//           to: currentChatUser?.id,
//           from: userInfo?.id,
//           message: response.data.message,
//         });
//         dispatch({
//           type: reducerCases.ADD_MESSAGE,
//           newMessage: {
//             ...response.data.message,
//           },
//           fromSelf: true,
//         });
//         console.log("sent drawing text")
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     const handleOutsideClick = (e) => {
//       if (e.target.id !== 'emoji-modal-window') {
//         if (
//           emojiPickerRef.current &&
//           !emojiPickerRef.current.contains(e.target)
//         ) {
//           setShowEmojiPicker(false);
//         }
//       }
//     };

//     document.addEventListener('click', handleOutsideClick);
//     return () => {
//       document.removeEventListener('click', handleOutsideClick);
//     };
//   }, []);

//   //Emoji modal function
//   const handleEmojiModal = () => {
//     setShowEmojiPicker(!showEmojiPicker);
//   };

//   const handleEmojiClick = (emoji) => {
//     setMessage((prev) => (prev += emoji.emoji));
//   };

//   useEffect(() => {
//     if (socket && socket.current) {
//       socket.current.on('connect', () => {
//         console.log('Connected to WebSocket');
//       });

//       socket.current.on('disconnect', () => {
//         console.log('Disconnected from WebSocket');
//       });
//     }
//   }, [socket]);

//   const sendMessage = async () => {
//     if (!message.trim()) return;
//     try {
//       const { data } = await axios.post(ADD_MESSAGE_ROUTE, {
//         to: currentChatUser?.id,
//         from: userInfo?.id,
//         message,
//       });

//       socket.current.emit('send-msg', {
//         to: currentChatUser?.id,
//         from: userInfo?.id,
//         message: data.msg,
//       });
//       console.log('Message sent:', data.msg);

//       dispatch({
//         type: reducerCases.ADD_MESSAGE,
//         newMessage: {
//           ...data.msg,
//           fromSelf: true,
//         },
//       });
//       setMessage('');
//     } catch (error) {
//       console.error(
//         'Error sending message:',
//         error.response?.data?.error || error.message
//       );
//     }
//   };

//   useEffect(() => {
//     const inputElement = document.querySelector('input[type="text"]');
//     if (inputElement) {
//       inputElement.addEventListener('focus', () => {
//         if (socket && socket.current) {
//           socket.current.emit('cursor-focus', { userId: userInfo.id });
//         }
//       });

//       inputElement.addEventListener('blur', () => {
//         if (socket && socket.current) {
//           socket.current.emit('cursor-blur', { userId: userInfo.id });
//         }
//       });
//     }

//     return () => {
//       if (inputElement) {
//         inputElement.removeEventListener('focus', () => {});
//         inputElement.removeEventListener('blur', () => {});
//       }
//     };
//   }, [userInfo]);

//   useEffect(() => {
//     if (grabPhoto) {
//       const data = document.getElementById('photo-picker');
//       data.click();
//       document.body.onfocus = (e) => {
//         setTimeout(() => {
//           setGrabPhoto(false);
//         }, 1000);
//       };
//     }
//   }, [grabPhoto]);

//   return (
//     <div className="xs:absolute xs:bottom-0 xs:left-0 xs:right-0 xs:z-20 xs:w-full  bg-panel-header-background px-4 h-20 flex items-center justify-center relative">
//       {
//         !showAudioRecorder && (
//           <>
//           <div className="xs:flex-col flex gap-3 items-center justify-center">
//             <BsEmojiSmile
//               className="text-panel-header-icon cursor-pointer text-2xl xs:text-md"
//               title="Emoji"
//               id="emoji-modal-window"
//               onClick={handleEmojiModal}
//             />
//             {showEmojiPicker && (
//               <div
//                 className="absolute bottom-24 left-16 z-30"
//                 id="emoji-modal"
//                 ref={emojiPickerRef}
//               >
//                 <EmojiPicker
//                   onEmojiClick={handleEmojiClick}
//                   theme="dark"
//                   emojiStyle="apple"
//                 />
//               </div>
//             )}
//             <ImAttachment
//               className="text-panel-header-icon cursor-pointer text-2xl xs:text-md"
//               title="Attach File"
//               onClick={() => setGrabPhoto(true)}
//             />
//           </div>
//           <div className="w-full rounded-lg h-10 flex items-center mx-3">
//             <input
//               type="text"
//               placeholder="Type a message"
//               className="xs:px-2 xs:h-12 bg-input-background text-sm focus:outline-none text-white px-5 h-10 rounded-lg py-4 w-full"
//               onChange={(e) => setMessage(e.target.value)}
//               value={message}
//             />
//           </div>
//           <div className="w-auto flex items-center justify-center">
//             <button onClick={sendMessage}>
//               {message.length ? (
//                 <MdSend
//                   className="text-panel-header-icon cursor-pointer text-2xl"
//                   title="Send Message"
//                 />
//               ) : (
//                 <FaMicrophone
//                   className=" text-panel-header-icon cursor-pointer text-2xl"
//                   title="Record"
//                   onClick={() => setShowAudioRecorder(true)}
//                 />
//               )}
//             </button>
//           </div>
//           </>
//         )
//       }
//       {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
//       {showAudioRecorder && <CaptureAudio hide={setShowAudioRecorder} />}
//     </div>
//   );
// };

// export default MessageBar;
