import React, { useState, useRef, useEffect } from 'react';
import Header from "../components/Header.jsx";

export default function Comparator() {
    const [isRecording, setIsRecording] = useState(false);
    const [canRecord, setCanRecord] = useState(false);
    const [recorder, setRecorder] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [recordedBlob, setRecordedBlob] = useState(null);
    const playbackRef = useRef(null);

    useEffect(() => {
        // Handle what happens when recorder stops
        if (recorder) {
            recorder.ondataavailable = (e) => {
                setAudioChunks(prev => [...prev, e.data]);
            };

            recorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                setRecordedBlob(audioBlob);
                setAudioChunks([]);
                const audioURL = URL.createObjectURL(audioBlob);
                if (playbackRef.current) {
                    playbackRef.current.src = audioURL;
                }
                setCanRecord(false);
                setIsRecording(false);
            };
        }
    }, [recorder, audioChunks]);

    // Handle recording toggle
    const handleMicClick = () => {
        if (isRecording) {
            recorder.stop();
            setIsRecording(false);
        } else {
            if (!canRecord) {
                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then((mediaStream) => {
                        const mediaRecorder = new MediaRecorder(mediaStream);
                        setRecorder(mediaRecorder);
                        setCanRecord(true);
                        mediaRecorder.start();
                        setIsRecording(true);
                    })
                    .catch((err) => {
                        console.error('Microphone access error:', err);
                        alert('Microphone access denied. Please check your settings.');
                    });
            } else {
                recorder.start();
                setIsRecording(true);
            }
        }
    };

    // Handle audio analysis
    const handleAnalyzeClick = () => {
        if (!recordedBlob) {
            alert('Please record audio before analyzing.');
            return;
        }

        const formData = new FormData();
        formData.append('audio', recordedBlob, 'recording.webm');

        fetch('/audio-to-midi', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.blob())
            .then(midiBlob => {
                const midiURL = URL.createObjectURL(midiBlob);
                const link = document.createElement('a');
                link.href = midiURL;
                link.download = 'converted_audio.mid';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(err => {
                console.error('Audio analysis error:', err);
                alert('Error analyzing audio. Try again later.');
            });
    };

    return (
        <>
            <Header />
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
                        <audio className="playback ml-8" ref={playbackRef} controls></audio>
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
        </>
    );
}
