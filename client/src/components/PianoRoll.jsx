import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import Metronome from './Metronome';
import Comparator from './comparator';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const START_OCTAVE = 3;
const END_OCTAVE = 5;
const PIXEL_PER_SECOND = 100;
const NOTE_HEIGHT = 10;

const PianoRoll = forwardRef(({ midiData, selectedSong }, ref) => {
    const [allNotes, setAllNotes] = useState([]);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [bpm, setBpm] = useState(midiData?.header?.tempos?.[0]?.bpm || 120);
    const [recordedData, setRecordedData] = useState();
    
    // Refs for animation and recording
    const animationFrameRef = useRef();
    const lastTimeRef = useRef();
    const containerRef = useRef();
    const recordingStartTimeRef = useRef(0);
    const activeNotesRef = useRef(new Map());
    const recordedNotesRef = useRef([]);

    useImperativeHandle(ref, () => ({
        handleNoteOn,
        handleNoteOff
    }));

  // Recording methods
  const startRecording = () => {
    recordingStartTimeRef.current = currentTime;
    activeNotesRef.current.clear();
    recordedNotesRef.current = [];
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Complete any still-active notes
    activeNotesRef.current.forEach((noteData, midi) => {
      completeNote(midi, currentTime);
    });
    activeNotesRef.current.clear();
    
    // Here you can handle the recorded data
    setRecordedData(formatRecording());
    
    // console.log('Recorded MIDI data:', recordedData);
    // return recordedData;
  };

  const handleNoteOn = (event) => {
    console.log(event.note.identifier);
    
    if (!isRecording || !isPlaying) return;
    
    const relativeTime = currentTime - recordingStartTimeRef.current;
    const noteData = {
      time: relativeTime,
      midi: event.note.number,
      velocity: event.note.attack,
      name: event.note.identifier
    };
    
    activeNotesRef.current.set(event.note.number, noteData);
  };

  const handleNoteOff = (event) => {
    if (!isRecording || !isPlaying) return;
    
    const midi = event.note.number;
    const noteData = activeNotesRef.current.get(midi);
    
    if (noteData) {
      completeNote(midi, currentTime);
    }
  };

  const completeNote = (midi, endTime) => {
    const noteData = activeNotesRef.current.get(midi);
    if (!noteData) return;

    const duration = endTime - recordingStartTimeRef.current - noteData.time;
    
    recordedNotesRef.current.push({
      duration: duration,
      durationTicks: Math.round(duration * 384),
      midi: midi,
      name: noteData.name,
      ticks: Math.round(noteData.time * 384),
      time: noteData.time,
      velocity: noteData.velocity
    });

    activeNotesRef.current.delete(midi);
  };

  const formatRecording = () => {
    return {
      header: {
        keySignatures: [],
        meta: [],
        name: "Recorded Piano",
        ppq: 384,
        tempos: [{
          bpm: bpm,
          ticks: 0
        }],
        timeSignatures: [{
          ticks: 0,
          timeSignature: [4, 4],
          measures: 0
        }]
      },
      tracks: [{
        channel: 0,
        controlChanges: {},
        pitchBends: [],
        instrument: {
          family: "piano",
          number: 0,
          name: "acoustic grand piano"
        },
        name: "Recorded Track",
        notes: recordedNotesRef.current,
        endOfTrackTicks: Math.max(...recordedNotesRef.current.map(n => n.ticks + n.durationTicks))
      }]
    };
  };

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
      const maxDuration = Math.max(
        ...midiData.tracks.flatMap(track =>
          track.notes.map(note => note.time + note.duration)
        )
      );
      setDuration(maxDuration + 2);
    }
  }, [midiData]);

  // Playback animation
  const animate = (timestamp) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = timestamp;
    }

    const deltaTime = (timestamp - lastTimeRef.current) / 1000;
    lastTimeRef.current = timestamp;

    const timeIncrement = deltaTime * (bpm / 60);
    
    setCurrentTime(prevTime => {
      const newTime = prevTime + timeIncrement;
      if (newTime >= duration) {
        setIsPlaying(false);
        if (isRecording) {
          stopRecording();
        }
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
  const handlePlay = () => {
    setIsPlaying(true);
    if (!isRecording) {
      startRecording();
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleStop = () => {
    setIsPlaying(false);
    if (isRecording) {
      stopRecording();
    }
    setCurrentTime(0);
  };

  // Auto-scroll playhead
  useEffect(() => {
    if (containerRef.current) {
      const playheadPosition = currentTime * PIXEL_PER_SECOND;
      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      const scrollPosition = container.scrollLeft;

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
      <div className="flex items-center gap-4 mb-1 py-2 px-8 border border-secondary text-primary justify-between rounded-md">
        <div className="flex gap-2">
          <button
            onClick={isPlaying ? handlePause : handlePlay}
            className="px-4 py-2 btn-default">
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={handleStop}
            className="px-4 py-2 btn-alter-default">
            Stop
          </button>
        </div>
        <div className="flex items-center gap-2">
            <div>
                <label className="text-base">BPM:</label>
                <input
                    type="number"
                    value={bpm}
                    onChange={(e) => setBpm(Math.max(0, Math.min(999, Number(e.target.value))))}
                    className="w-20 px-2 py-1 border rounded"
                />
            </div>
        
            <Metronome bpm={bpm} isPlaying={isPlaying} currentTime={currentTime}/>
        
            <div className="text-sm">
            Time: {currentTime.toFixed(2)}s / {duration.toFixed(2)}s
            </div>
        </div>
        <div className={`px-2 py-1 rounded ${isRecording ? 'bg-red-500' : 'bg-gray-300'}`}>
        {isRecording ? 'Recording' : 'Not Recording'}
        </div>
      </div>

      {/* Piano Roll */}
      <div className="flex overflow-x-auto border border-secondary" ref={containerRef}>
        {/* Piano Keys */}
        <div className="sticky left-0 z-10 bg-white">
          {allNotes.map((note) => (
            <div
              key={note}
              className={`border-b border-r ${
                note.includes('#') ? 'bg-black text-white' : 'bg-white'
              } text-[5px]`}
              style={{
                height: NOTE_HEIGHT,
                width: 60,
                borderRight: '1px solid #ccc'
              }}
            >
              <span className="pl-1">{note}</span>
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

          {recordedData && <Comparator recordedData={recordedData} selectedSong={selectedSong} /> }
      
    </div>
  );
});

export default PianoRoll;