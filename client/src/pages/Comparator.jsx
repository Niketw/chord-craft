import React, { useState, useRef, useEffect } from 'react';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null); // Persist mediaRecorder across renders
  const playbackRef = useRef(null);
  const audioChunks = useRef([]); // Store audio chunks across renders

  const handleMicClick = async () => {
    if (!isRecording) {
      // Start recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.start();

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        audioChunks.current = []; // Reset chunks for future recordings
      };

      setIsRecording(true); // Update state to reflect recording status
    } else {
      // Stop recording
      mediaRecorderRef.current.stop();
      setIsRecording(false); // Update state to reflect stopped recording
    }
  };

  const handleAnalyzeClick = () => {
    // Placeholder for analysis logic
    console.log("Analyze clicked");
  };

  useEffect(() => {
    if (audioBlob && playbackRef.current) {
      const audioUrl = URL.createObjectURL(audioBlob);
      playbackRef.current.src = audioUrl;
    }
  }, [audioBlob]); // Update audio player source when blob is available

  return (
    <section className="bg-craft_grey h-screen overflow-y-scroll px-24 py-32">
      <h2 className="text-primary">Compare audio</h2>

      {/* Original Track Player */}
      <div className="player_interface border border-primary px-3 flex gap-4 mb-4 items-center">
        <h4 className="text-primary w-44">Original Track</h4>
        <div className="flex gap-4">
          <button className="btn-default">PLAY</button>
          <button className="btn-default">PAUSE</button>
        </div>
      </div>

      {/* User Track Recorder and Analyzer */}
      <div className="input_interface border border-primary px-3 flex gap-4 items-center mb-4">
        <h4 className="text-primary w-44">Your Track</h4>
        <div className="flex gap-4">
          <button id="mic" className="btn-default" onClick={handleMicClick}>
            {isRecording ? 'Stop Recording' : 'Record'}
          </button>
          <button id="analyze" className="btn-alter-default" onClick={handleAnalyzeClick}>Analyze</button>
          <audio className="playback ml-8" ref={playbackRef} controls />
        </div>
      </div>

      {/* Analysis Output Interface */}
      <div className="output_interface border border-primary px-3">
        <h4 className="text-primary w-44">Score</h4>
        <div className="flex gap-4"></div>
        <h4 className="text-primary w-44">Graph</h4>
        <div className="flex gap-4"></div>
      </div>
    </section>
  );
};

export default AudioRecorder;
