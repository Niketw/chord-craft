import React, { useState, useEffect, useRef } from 'react';

const Metronome = ({ bpm, isPlaying, currentTime }) => {
  const [beatCount, setBeatCount] = useState(3);
  const intervalRef = useRef(null);
  const clickInterval = 60000 / bpm;

  // Audio Context for generating a click sound
  const audioContextRef = useRef(null);

  const playClick = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const osc = audioContextRef.current.createOscillator();
    const gain = audioContextRef.current.createGain();

    osc.connect(gain);
    gain.connect(audioContextRef.current.destination);

    osc.frequency.value = 250; // Frequency of the click sound
    gain.gain.value = 1.5; // Volume of the click

    osc.start();
    osc.stop(audioContextRef.current.currentTime + 0.1); // Short click duration (0.1 seconds)

    setBeatCount((prev) => (prev + 1) % 4);
  };

  // Effect to start/stop the metronome based on `isPlaying`
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(playClick, clickInterval);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current); // Clean up on unmount
  }, [isPlaying, clickInterval]);

  return (
    <div style={{ textAlign: 'center' }}>
      <p>Beat: {beatCount + 1} / 4</p>
    </div>
  );
};

export default Metronome;
