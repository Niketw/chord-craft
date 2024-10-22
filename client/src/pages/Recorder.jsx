import React, { useState, useRef, useEffect } from 'react';
import Header from "../components/Header.jsx";

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
                        <button id="mic" className="btn-default" onClick={toggleMic}>
                            {isRecording ? 'Stop Recording' : 'Record'}
                        </button>
                        <button id="analyze" className="btn-alter-default" onClick={analyzeAudio}>Analyze</button>
                        <audio className="playback ml-8" controls src={audioURL}></audio>
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
