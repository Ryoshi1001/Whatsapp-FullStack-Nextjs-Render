let ringtoneAudio = null;

export const playRingtone = () => {
  if (!ringtoneAudio) {
    ringtoneAudio = new Audio('/call-sound.mp3');
    ringtoneAudio.loop = true;
  }
  ringtoneAudio.play();
};

export const stopRingtone = () => {
  if (ringtoneAudio) {
    ringtoneAudio.pause();
    ringtoneAudio.currentTime = 0;
  }
};



  // const [isRingTonePlaying, setIsRingTonePlaying] = useState(false); 
  // const [ringToneAudio, setRingToneAudio] = useState(null); 

 
  // const playRingtone = () => {
  //   if(!isRingTonePlaying) {
  //     const audio = new Audio('/call-sound.mp3'); 
  //     audio.loop = true; 
  //     audio.play(); 
  //     setIsRingTonePlaying(true); 
  //     setRingToneAudio(audio); 
  //   }
  // }; 
  
  // const stopRingtone = () => {
  //   console.log("stopping ringtone from main.jsx")
  //   if(isRingTonePlaying && ringToneAudio) {
  //     ringToneAudio.pause(); 
  //     ringToneAudio.currentTime = 0;
  //     setIsRingTonePlaying(false); 
  //     setRingToneAudio(null); 
  //   }
  // }; 