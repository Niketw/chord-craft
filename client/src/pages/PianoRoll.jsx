import React, { useEffect, useState, useRef } from 'react';
import Metronome from '../components/Metronome';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const START_OCTAVE = 2;
const END_OCTAVE = 6;
const PIXEL_PER_SECOND = 100;
const NOTE_HEIGHT = 20;

const PianoRoll = ({ midiData }) => {
  const [allNotes, setAllNotes] = useState([]);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [bpm, setBpm] = useState(midiData.tempos); // Default BPM
  const animationFrameRef = useRef();
  const lastTimeRef = useRef();
  const containerRef = useRef();
  
  // Generate all possible notes from C0 to B8
  const getAllNotes = () => {
    const notes = [];
    for (let octave = END_OCTAVE; octave >= START_OCTAVE; octave--) {
      NOTES.slice().reverse().forEach(note => {
        notes.push(`${note}${octave}`);
      });
    }
    return notes;
  };

  useEffect(() => {
    if (midiData) {
      setAllNotes(getAllNotes());
      // Find the latest note end time to set total duration
      const maxDuration = Math.max(
        ...midiData.tracks.flatMap(track =>
          track.notes.map(note => note.time + note.duration)
        )
      );
      // Add some padding (e.g., 2 seconds)
      setDuration(maxDuration + 2);
      
      // Set initial BPM from MIDI file if available
      if (midiData.header?.tempos?.length > 0) {
        setBpm(midiData.header.tempos[0].bpm);
      }
    }
  }, [midiData]);

  // Playback animation
  const animate = (timestamp) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = timestamp;
    }

    const deltaTime = (timestamp - lastTimeRef.current) / 1000;
    lastTimeRef.current = timestamp;

    // Calculate time increment based on BPM
    const timeIncrement = deltaTime * (bpm / 60); // Scale with BPM
    
    setCurrentTime(prevTime => {
      const newTime = prevTime + timeIncrement;
      if (newTime >= duration) {
        setIsPlaying(false);
        return 0;
      }
      return newTime;
    });

    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = null;
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, bpm]);

  // Playback controls
  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Auto-scroll playhead into view
  useEffect(() => {
    if (containerRef.current) {
      const playheadPosition = currentTime * PIXEL_PER_SECOND;
      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      const scrollPosition = container.scrollLeft;

      // If playhead is outside visible area, scroll to it
      if (playheadPosition < scrollPosition || playheadPosition > scrollPosition + containerWidth - 100) {
        container.scrollLeft = playheadPosition - 100;
      }
    }
  }, [currentTime]);

  if (!midiData) return null;

  const width = Math.max(duration * PIXEL_PER_SECOND, 1000); // Ensure minimum width
  const height = allNotes.length * NOTE_HEIGHT;

  // Convert note name to Y position
  const getNoteY = (noteName) => {
    return allNotes.indexOf(noteName) * NOTE_HEIGHT;
  };

   

  return (
    <div>
      {/* Playback Controls */}
      <div className="flex items-center gap-4 mb-4 p-2 bg-gray-100 rounded">
        <div className="flex gap-2">
          <button
            onClick={isPlaying ? handlePause : handlePlay}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={handleStop}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Stop
          </button>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm">BPM:</label>
          <input
            type="number"
            value={bpm}
            onChange={(e) => setBpm(Math.max(0, Math.min(999, Number(e.target.value))))}
            className="w-20 px-2 py-1 border rounded text-black"
          />
        </div>

        {/* Metronome */}
        <Metronome bpm={bpm} isPlaying={isPlaying} currentTime={currentTime}/>
        
        <div className="text-sm">
          Time: {currentTime.toFixed(2)}s / {duration.toFixed(2)}s
        </div>
      </div>

      {/* Piano Roll */}
      <div className="flex overflow-x-auto" ref={containerRef}>
        {/* Piano Keys */}
        <div className="sticky left-0 z-10 bg-white">
          {allNotes.map((note) => (
            <div
              key={note}
              className={`border-b border-r ${
                note.includes('#') ? 'bg-black text-white' : 'bg-white'
              }`}
              style={{
                height: NOTE_HEIGHT,
                width: 60,
                borderRight: '1px solid #ccc'
              }}
            >
              <span className="text-xs pl-1">{note}</span>
            </div>
          ))}
        </div>

        {/* Piano Roll Grid and Notes */}
        <div className="relative" style={{ width, height }}>
          {/* Grid lines */}
          {allNotes.map((note, index) => (
            <div
              key={note}
              className="border-b"
              style={{
                position: 'absolute',
                top: index * NOTE_HEIGHT,
                width: width,
                height: NOTE_HEIGHT,
                backgroundColor: note.includes('#') ? '#f0f0f0' : 'white'
              }}
            />
          ))}

          {/* Vertical time markers */}
          {Array.from({ length: Math.ceil(duration) + 1 }).map((_, index) => (
            <div
              key={index}
              className="border-r absolute"
              style={{
                left: index * PIXEL_PER_SECOND,
                height: '100%',
                borderColor: index % 4 === 0 ? '#666' : '#eee'
              }}
            >
              {index % 4 === 0 && (
                <span className="text-xs text-gray-500 absolute -top-4">
                  {index}s
                </span>
              )}
            </div>
          ))}

          {/* Playhead */}
          <div
            className="absolute top-0 w-0.5 bg-red-500 z-20"
            style={{
              left: currentTime * PIXEL_PER_SECOND,
              height: '100%',
              pointerEvents: 'none'
            }}
          />

          {/* Notes */}
          {midiData.tracks.map((track, trackIndex) =>
            track.notes.map((note, noteIndex) => (
              <div
                key={`${trackIndex}-${noteIndex}`}
                className="absolute rounded"
                style={{
                  left: note.time * PIXEL_PER_SECOND,
                  top: getNoteY(note.name),
                  width: note.duration * PIXEL_PER_SECOND,
                  height: NOTE_HEIGHT - 1,
                  backgroundColor: `rgba(${50 + trackIndex * 50}, 100, 200, ${note.velocity})`,
                  border: '1px solid rgba(0,0,0,0.2)'
                }}
                title={`${note.name} (${note.duration.toFixed(2)}s)`}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PianoRoll;