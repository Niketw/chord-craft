// // import { useEffect, useState } from 'react';
// // import MidiWriter from 'midi-writer-js';
// // import httpClient from '../HttpClient';
// //
// // // Add a new function to download the MIDI file
// // const downloadMidiFile = (midiFile, fileName) => {
// //     const url = URL.createObjectURL(midiFile);
// //     const link = document.createElement('a');
// //     link.href = url;
// //     link.download = fileName;
// //     document.body.appendChild(link);
// //     link.click();
// //     document.body.removeChild(link);
// //     URL.revokeObjectURL(url);
// // };
// //
// // function uint8ArrayToBase64(uint8Array) {
// //     // Convert Uint8Array to a string using fromCharCode
// //     const binaryString = String.fromCharCode(...uint8Array);
// //
// //     // Encode the string to Base64
// //     return btoa(binaryString);
// // }
// //
// // const convertJsonToMidiFile = (jsonData) => {
// //     const track = new MidiWriter.Track();
// //
// //     // Handle tempo more robustly
// //     const tempo = jsonData.header?.tempos?.[0]?.bpm || 120;
// //     track.setTempo(tempo);
// //
// //     // Sort notes by start time (ticks) to ensure correct order
// //     const sortedNotes = jsonData.tracks[0].notes.sort((a, b) => a.ticks - b.ticks);
// //
// //     // Calculate the first note's tick to use as an offset
// //     const firstNoteTick = sortedNotes[0]?.ticks || 0;
// //
// //     sortedNotes.forEach(note => {
// //         const midiNote = new MidiWriter.NoteEvent({
// //             pitch: note.midi,
// //             duration: `T${note.durationTicks}`,
// //             velocity: Math.round(note.velocity * 100), // Ensure velocity is an integer
// //             startTick: note.ticks - firstNoteTick // Adjust start time relative to first note
// //         });
// //         track.addEvent(midiNote);
// //     });
// //
// //     const writer = new MidiWriter.Writer(track);
// //
// //     const midiBlob = new Blob([writer.buildFile()], { type: 'audio/midi' });
// //     const midiEnc = uint8ArrayToBase64(midiBlob);
// //     console.log(midiEnc);
// //     const midiFile = new File([midiBlob], `${selectedSong}_rec.mid`, { type: 'audio/midi' });
// //
// //     // Add download functionality
// // //     downloadMidiFile(midiFile, "dw_rec.mid");
// //
// //     return midiEnc;
// // };
// //
// // export default function Comparator({ recordedData, selectedSong }) {
// //     const [comparisonResults, setComparisonResults] = useState(null);
// //     const [visualization, setVisualization] = useState(null);
// //     const [visualization2, setVisualization2] = useState(null);
// //
// //     const sendRequestToBackend = async (file) => {
// //         try {
// //             if (!recordedData) {
// //                 console.error("No recorded data available");
// //                 return;
// //             }
// //
// //             recordedEnc = convertJsonToMidiFile(recordedData);
// //
// //             console.log("Creating FormData...");
// //             const formData = new FormData();
// //
// //             //const recordedjson = JSON.stringify(recordedData);
// //
// //             formData.append("played_file", recordedEnc);
// //             formData.append("song_name", selectedSong);
// //
// //             // Log FormData content for debugging
// //             for (let pair of formData.entries()) {
// //                 if (pair[0] === 'played_file') {
// //                     console.log(pair[0] + ": " + pair[1]);
// //                 } else {
// //                     console.log(pair[0] + ": " + pair[1]);
// //                 }
// //             }
// //
// //             const response = await httpClient.post("/comparator", formData, {
// //                 headers: { "Content-Type": "multipart/form-data" }, // Use multipart/form-data for FormData
// //             });
// //
// //             if (!response.ok) {
// //                 throw new Error(`HTTP error! status: ${response.status}`);
// //             }
// //
// //             const data = await response.data;
// //             console.log("Response received:", data);
// //
// //             if (data.accuracy) {
// //                 setComparisonResults(data.accuracy);
// //                 setVisualization(data.visualization);
// //                 setVisualization2(data.visualization2);
// //
// //                 alert("Comparison completed! Check the comparison results below.");
// //             }
// //             else {
// //                 console.error("Error: Expected 'accuracy' in response data");
// //                 alert("There was an issue with the comparison data.");
// //             }
// //
// //
// //         } catch (error) {
// //             console.error("Error sending request for comparison:", error);
// //             // More detailed error handling
// //             if (error.response) {
// //                 // The request was made and the server responded with a status code
// //                 // that falls out of the range of 2xx
// //                 console.error("Error response:", error.response.data);
// //                 console.error("Error status:", error.response.status);
// //                 alert(`Server error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
// //             } else if (error.request) {
// //                 // The request was made but no response was received
// //                 console.error("No response received:", error.request);
// //                 alert("No response received from server. Please check your connection.");
// //             } else {
// //                 // Something happened in setting up the request that triggered an Error
// //                 console.error("Error setting up request:", error.message);
// //                 alert(`Error: ${error.message}`);
// //             }
// //         }
// //     };
// //
// //     // Handle file input change
// //     const handleFileChange = (event) => {
// //         const file = event.target.files[0];
// //         if (file) {
// //             sendRequestToBackend(file);
// //         }
// //     };
// //
// //     // Effect for converting and downloading MIDI file on component render
// //     useEffect(() => {
// //         if (recordedData) {
// //             console.log("Converting JSON to MIDI file...");
// //             convertJsonToMidiFile(recordedData, selectedSong);
// //         }
// //     }, [recordedData, selectedSong]);
// //
// //     return (
// //         <div>
// //             <div className="file-input-container">
// //                 <input
// //                     type="file"
// //                     accept=".mid"
// //                     onChange={handleFileChange}
// //                     className="file-input"
// //                 />
// //             </div>
// //
// //             {comparisonResults && (
// //                 <div className="results-container">
// //                     <h2>Comparison Results</h2>
// //                     <div className="graph">
// //                         {visualization ? (
// //                             <img src={`data:image/svg+xml;base64,${visualization}`} alt="MIDI Comparison Graph" />
// //                         ) : (
// //                             <p>No graph available</p>
// //                         )}
// //                     </div>
// //                     <div className="graph">
// //                         {visualization2 ? (
// //                             <img src={`data:image/svg+xml;base64,${visualization2}`} alt="MIDI Accuracies Graph" />
// //                         ) : (
// //                             <p>No graph available</p>
// //                         )}
// //                     </div>
// //                 </div>
// //             )}
// //         </div>
// //     );
// // }
//
// import { useEffect, useState } from 'react';
// import MidiWriter from 'midi-writer-js';
// import httpClient from '../HttpClient';
//
// // Your existing utility functions remain the same
// const uint8ArrayToBase64 = (uint8Array) => {
//     const binaryString = String.fromCharCode(...uint8Array);
//     return btoa(binaryString);
// };
//
// const convertJsonToMidiFile = (jsonData) => {
//     const track = new MidiWriter.Track();
//     const tempo = jsonData.header?.tempos?.[0]?.bpm || 120;
//     track.setTempo(tempo);
//
//     const sortedNotes = jsonData.tracks[0].notes.sort((a, b) => a.ticks - b.ticks);
//     const firstNoteTick = sortedNotes[0]?.ticks || 0;
//
//     sortedNotes.forEach(note => {
//         const midiNote = new MidiWriter.NoteEvent({
//             pitch: note.midi,
//             duration: `T${note.durationTicks}`,
//             velocity: Math.round(note.velocity * 100),
//             startTick: note.ticks - firstNoteTick
//         });
//         track.addEvent(midiNote);
//     });
//
//     const writer = new MidiWriter.Writer(track);
// //     const midiBlob = new Blob([writer.buildFile()], { type: 'audio/midi' });
//     return uint8ArrayToBase64(writer.buildFile());
// };
//
// export default function Comparator({ recordedData, selectedSong }) {
//     const [comparisonResults, setComparisonResults] = useState(null);
//     const [visualization, setVisualization] = useState(null);
//     const [visualization2, setVisualization2] = useState(null);
//
//     const sendRequestToBackend = async () => {
//         try {
//             if (!recordedData) {
//                 console.error("No recorded data available");
//                 return;
//             }
//
//             // Convert the recorded data to base64
//             const recordedBase64 = convertJsonToMidiFile(recordedData);
//             console.log(recordedBase64)
//             console.log("Sending request to backend...");
//
//             // Create the request payload
//             const requestData = {
//                 played_file_base64: recordedBase64,
//                 song_name: selectedSong
//             };
//
//             // Send the request with JSON payload
//             const response = await httpClient.post("/comparator", requestData, {
//                 headers: {
//                     "Content-Type": "application/json"
//                 }
//             });
//
//             const data = response.data;
//             console.log("Response received:", data);
//
//             if (data.accuracy) {
//                 setComparisonResults(data.accuracy);
//                 setVisualization(data.visualization);
//                 setVisualization2(data.visualization2);
//                 alert("Comparison completed! Check the comparison results below.");
//             } else {
//                 console.error("Error: Expected 'accuracy' in response data");
//                 alert("There was an issue with the comparison data.");
//             }
//
//         } catch (error) {
//             console.error("Error sending request for comparison:", error);
//             if (error.response) {
//                 console.error("Error response:", error.response.data);
//                 console.error("Error status:", error.response.status);
//                 alert(`Server error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
//             } else if (error.request) {
//                 console.error("No response received:", error.request);
//                 alert("No response received from server. Please check your connection.");
//             } else {
//                 console.error("Error setting up request:", error.message);
//                 alert(`Error: ${error.message}`);
//             }
//         }
//     };
//
//     // Effect to trigger comparison when recordedData is available
//     useEffect(() => {
//         if (recordedData && selectedSong) {
//             sendRequestToBackend();
//         }
//     }, [recordedData, selectedSong]);
//
//     return (
//         <div>
//             {comparisonResults && (
//                 <div className="results-container">
//                     <h2>Comparison Results</h2>
//                     <div className="graph">
//                         {visualization ? (
//                             <img src={`data:image/svg+xml;base64,${visualization}`} alt="MIDI Comparison Graph" />
//                         ) : (
//                             <p>No graph available</p>
//                         )}
//                     </div>
//                     <div className="graph">
//                         {visualization2 ? (
//                             <img src={`data:image/svg+xml;base64,${visualization2}`} alt="MIDI Accuracies Graph" />
//                         ) : (
//                             <p>No graph available</p>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Award, Clock, Music, ThumbsUp, AlertTriangle } from 'lucide-react';
import httpClient from "../HttpClient";

const MidiComparison = ({ originalMidi, recordedMidi, selectedSong}) => {
  const [scores, setScores] = useState({
    noteAccuracy: 0,
    timingAccuracy: 0,
    rhythmAccuracy: 0,
    overallScore: 0
  });

  const [details, setDetails] = useState({
    totalNotes: 0,
    correctNotes: 0,
    timingErrors: 0,
    missedNotes: 0,
    extraNotes: 0
  });

  useEffect(() => {
    if (!originalMidi || !recordedMidi) return;

    // Extract notes from both MIDI objects
    const originalNotes = originalMidi.tracks[0].notes;
    const recordedNotes = recordedMidi.tracks[0].notes;

    // Compare notes and timing
    const comparison = comparePerformances(originalNotes, recordedNotes);
    setScores(comparison.scores);
    setDetails(comparison.details);

     if (comparison.scores) {
    postClickIncrement();
  }

  }, [originalMidi, recordedMidi]);

  const comparePerformances = (originalNotes, recordedNotes) => {
    const timingThreshold = 100; // Timing tolerance in ticks
    const details = {
      totalNotes: originalNotes.length,
      correctNotes: 0,
      timingErrors: 0,
      missedNotes: 0,
      extraNotes: 0
    };

    // Create a map of original notes for faster lookup
    const originalNoteMap = new Map();
    originalNotes.forEach(note => {
      const key = `${note.midi}_${Math.floor(note.ticks / timingThreshold)}`;
      originalNoteMap.set(key, note);
    });

    // Compare recorded notes with original notes
    recordedNotes.forEach(recordedNote => {
      const timeSlot = Math.floor(recordedNote.ticks / timingThreshold);
      let found = false;

      // Check nearby time slots for matching notes
      for (let i = -1; i <= 1; i++) {
        const key = `${recordedNote.midi}_${timeSlot + i}`;
        if (originalNoteMap.has(key)) {
          found = true;
          details.correctNotes++;

          // Check timing accuracy
          const originalNote = originalNoteMap.get(key);
          const timingDiff = Math.abs(recordedNote.ticks - originalNote.ticks);
          if (timingDiff > timingThreshold / 2) {
            details.timingErrors++;
          }

          break;
        }
      }

      if (!found) {
        details.extraNotes++;
      }
    });

    details.missedNotes = details.totalNotes - details.correctNotes;

    // Calculate scores
    const scores = {
      noteAccuracy: (details.correctNotes / details.totalNotes) * 100,
      timingAccuracy: ((details.correctNotes - details.timingErrors) / details.totalNotes) * 100,
      rhythmAccuracy: ((details.totalNotes - details.extraNotes) / details.totalNotes) * 100,
      overallScore: 0
    };

    // Calculate weighted overall score
    scores.overallScore = (
      scores.noteAccuracy * 0.4 +
      scores.timingAccuracy * 0.4 +
      scores.rhythmAccuracy * 0.2
    );

    return { scores, details };
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const chartData = [
    { name: 'Note Accuracy', value: scores.noteAccuracy },
    { name: 'Timing Accuracy', value: scores.timingAccuracy },
    { name: 'Rhythm Accuracy', value: scores.rhythmAccuracy }
  ];


  const postClickIncrement = async () => {
  try {
    const response = await httpClient.post('/increment-clicks', {
      comparisonDone: true,
      song_name: selectedSong // assuming you want to include selectedSong in the request body
    });

    if (response.status !== 200) {
      throw new Error('Failed to increment clicks');
    }

    console.log('Clicks incremented successfully');
  } catch (error) {
    console.error('Error incrementing clicks:', error);
  }
};



  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Overall Score */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Overall Performance</h2>
        <div className={`text-6xl font-bold ${getScoreColor(scores.overallScore)}`}>
          {Math.round(scores.overallScore)}%
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <Music className="text-blue-500" />
            <h3 className="font-semibold">Note Accuracy</h3>
          </div>
          <p className={`text-2xl font-bold ${getScoreColor(scores.noteAccuracy)}`}>
            {Math.round(scores.noteAccuracy)}%
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="text-purple-500" />
            <h3 className="font-semibold">Timing Accuracy</h3>
          </div>
          <p className={`text-2xl font-bold ${getScoreColor(scores.timingAccuracy)}`}>
            {Math.round(scores.timingAccuracy)}%
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <ThumbsUp className="text-green-500" />
            <h3 className="font-semibold">Rhythm Accuracy</h3>
          </div>
          <p className={`text-2xl font-bold ${getScoreColor(scores.rhythmAccuracy)}`}>
            {Math.round(scores.rhythmAccuracy)}%
          </p>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Detailed Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-600">Total Notes</p>
            <p className="text-xl font-semibold">{details.totalNotes}</p>
          </div>
          <div>
            <p className="text-gray-600">Correct Notes</p>
            <p className="text-xl font-semibold text-green-500">{details.correctNotes}</p>
          </div>
          <div>
            <p className="text-gray-600">Timing Errors</p>
            <p className="text-xl font-semibold text-yellow-500">{details.timingErrors}</p>
          </div>
          <div>
            <p className="text-gray-600">Missed Notes</p>
            <p className="text-xl font-semibold text-red-500">{details.missedNotes}</p>
          </div>
          <div>
            <p className="text-gray-600">Extra Notes</p>
            <p className="text-xl font-semibold text-orange-500">{details.extraNotes}</p>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Performance Breakdown</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#4f46e5" name="Accuracy %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MidiComparison;