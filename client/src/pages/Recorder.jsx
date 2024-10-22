import React, { useState, useRef, useEffect } from 'react';
import Header from "../components/Header.jsx";

<<<<<<< HEAD:client/src/pages/Recorder.jsx
export default function Recorder() {
    const [canRecord, setCanRecord] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState(null);
    const [audioURL, setAudioURL] = useState(null);
    const recorderRef = useRef(null);
    const streamRef = useRef(null);
    const chunksRef = useRef([]);

    const setupStream = (mediaStream) => {
        streamRef.current = mediaStream;
        const recorder = new MediaRecorder(mediaStream);
        recorderRef.current = recorder;

        recorder.ondataavailable = (e) => {
            chunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
            setRecordedBlob(blob);
            chunksRef.current = [];
            const url = window.URL.createObjectURL(blob);
            setAudioURL(url);

            // Stop microphone stream
            mediaStream.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
            setCanRecord(false);
            setIsRecording(false);
        };

        setCanRecord(true);
    };

    const toggleMic = () => {
        if (isRecording) {
            // Stop recording
            recorderRef.current.stop();
            setIsRecording(false);
        } else {
            // Start recording
            if (!canRecord) {
                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then(setupStream)
                    .then(() => {
                        recorderRef.current.start();
                        setIsRecording(true);
                    })
                    .catch((err) => {
                        console.error('Error accessing microphone:', err);
                        alert('Could not access microphone. Please check your settings.');
                    });
            } else {
                recorderRef.current.start();
                setIsRecording(true);
            }
        }
    };

    const analyzeAudio = () => {
        if (!recordedBlob) {
            console.error('No audio recorded to analyze');
            alert('Please record audio before analyzing.');
            return;
        }

        console.log('Analyzing audio...');
        const formData = new FormData();
        formData.append('audio', recordedBlob, 'recording.ogg');

        fetch('/audio-to-midi', {
            method: 'POST',
            body: formData,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.blob();
            })
            .then((midiBlob) => {
                const midiURL = window.URL.createObjectURL(midiBlob);
                const link = document.createElement('a');
                link.href = midiURL;
                link.download = 'converted_audio.mid';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                console.log('MIDI file downloaded successfully');
            })
            .catch((error) => {
                console.error('Error analyzing audio:', error);
                alert('An error occurred while analyzing the audio. Please try again.');
            });
    };

    return (
        <>
        <Header />
            <section className="bg-craft_grey h-screen overflow-y-scroll px-24 py-32">
                <h2 className="text-primary">Compare audio</h2>
=======
const Comparator = () => {
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
      <>
          <Header />
    <section className="bg-craft_grey h-screen overflow-y-scroll px-24 py-32">
      <h2 className="text-primary">Compare audio</h2>
>>>>>>> d24db36117468572df276014ff24980c5b8a8a18:client/src/pages/Comparator.jsx

      {/* Original Track Player */}
      <div className="player_interface px-3 flex gap-4 mb-4 items-center">
        <h4 className="text-primary w-44">Original Track</h4>
        <div className="flex gap-4">
          <button className="btn-default">PLAY</button>
          <button className="btn-default">PAUSE</button>
        </div>
      </div>

<<<<<<< HEAD:client/src/pages/Recorder.jsx
                {/* User Track Recorder and Analyzer */}
                <div className="input_interface border border-primary px-3 flex gap-4 items-center mb-4">
                    <h4 className="text-primary w-44">Your Track</h4>
                    <div className="flex gap-4">
                        <button id="mic" className="btn-default" onClick={toggleMic}>
                            {isRecording ? 'Stop Recording' : 'Record'}
                        </button>
                        <button id="analyze" className="btn-alter-default" onClick={analyzeAudio}>Analyze</button>
                        <audio className="playback ml-8" controls src={audioURL}></audio>
                    </div>
                </div>
=======
      {/* User Track Recorder and Analyzer */}
      <div className="input_interface px-3 flex gap-4 items-center mb-4">
        <h4 className="text-primary w-44">Your Track</h4>
        <div className="flex gap-4">
          <button id="mic" className="btn-default" onClick={handleMicClick}>
            {isRecording ? 'Stop Recording' : 'Record'}
          </button>
          <button id="analyze" className="btn-alter-default" onClick={handleAnalyzeClick}>Analyze</button>
          <audio className="playback ml-8" ref={playbackRef} controls />
        </div>
      </div>
>>>>>>> d24db36117468572df276014ff24980c5b8a8a18:client/src/pages/Comparator.jsx

      {/* Analysis Output Interface */}
      <div className="output_interface border border-primary rounded-3xl px-3">
        <h4 className="text-primary w-44">Score</h4>
        <div className="flex gap-4"></div>
        <h4 className="text-primary w-44">Graph</h4>
        <div className="flex gap-4"></div>
      </div>
    </section>
          </>
  );
};

export default Comparator;
