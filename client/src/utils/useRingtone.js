// src/hooks/useRingtone.js
import { useState } from 'react';

const useRingtone = () => {
  const [isRingTonePlaying, setIsRingTonePlaying] = useState(false);
  const [ringToneAudio, setRingToneAudio] = useState(null);

  const playRingtone = () => {
    if (!isRingTonePlaying) {
      const audio = new Audio('/call-sound.mp3');
      audio.loop = true;
      audio.play();
      setRingToneAudio(audio);
      setIsRingTonePlaying(true);
    }
  };

  const stopRingtone = () => {
    if (isRingTonePlaying && ringToneAudio) {
      ringToneAudio.pause();
      ringToneAudio.currentTime = 0;
      setIsRingTonePlaying(false);
      setRingToneAudio(null);
    }
  };

  return { playRingtone, stopRingtone };
};

export default useRingtone;