import { useEffect, useState } from 'react';
import MidiWriter from 'midi-writer-js';
import httpClient from '../HttpClient';

// Add a new function to download the MIDI file
const downloadMidiFile = (midiFile, fileName) => {
    const url = URL.createObjectURL(midiFile);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

const convertJsonToMidiFile = (jsonData, selectedSong) => {
    const track = new MidiWriter.Track();

    // Handle tempo more robustly
    const tempo = jsonData.header?.tempos?.[0]?.bpm || 120;
    track.setTempo(tempo);

    // Sort notes by start time (ticks) to ensure correct order
    const sortedNotes = jsonData.tracks[0].notes.sort((a, b) => a.ticks - b.ticks);

    // Calculate the first note's tick to use as an offset
    const firstNoteTick = sortedNotes[0]?.ticks || 0;

    sortedNotes.forEach(note => {
        const midiNote = new MidiWriter.NoteEvent({
            pitch: note.midi,
            duration: `T${note.durationTicks}`,
            velocity: Math.round(note.velocity * 100), // Ensure velocity is an integer
            startTick: note.ticks - firstNoteTick // Adjust start time relative to first note
        });
        track.addEvent(midiNote);
    });

    const writer = new MidiWriter.Writer(track);

    const midiBlob = new Blob([writer.buildFile()], { type: 'audio/midi' });
    const midiFile = new File([midiBlob], `${selectedSong}_rec.mid`, { type: 'audio/midi' });

    // Add download functionality
    downloadMidiFile(midiFile, "dw_rec.mid");

    return midiFile;
};

export default function Comparator({ recordedData, selectedSong }) {
    const [comparisonResults, setComparisonResults] = useState(null);
    const [visualization, setVisualization] = useState(null);
    const [visualization2, setVisualization2] = useState(null);

    const sendRequestToBackend = async (file) => {
        try {
            if (!recordedData) {
                console.error("No recorded data available");
                return;
            }

            console.log("Creating FormData...");
            const formData = new FormData();

            formData.append("played_file", file);
            formData.append("song_name", selectedSong);

            // Log FormData content for debugging
            for (let pair of formData.entries()) {
                if (pair[0] === 'played_file') {
                    console.log(pair[0] + ": " + pair[1].name);
                } else {
                    console.log(pair[0] + ": " + pair[1]);
                }
            }

            console.log(recordedData);

            const response = await httpClient.post("/comparator", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

            const data = await response.data;
            console.log("Response received:", data);

            if (data.accuracy) {
                setComparisonResults(data.accuracy);
                setVisualization(data.visualization);
                setVisualization2(data.visualization2);

                alert("Comparison completed! Check the comparison results below.");
            }
            else {
                console.error("Error: Expected 'accuracy' in response data");
                alert("There was an issue with the comparison data.");
            }


        } catch (error) {
            console.error("Error sending request for comparison:", error);
            // More detailed error handling
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error("Error response:", error.response.data);
                console.error("Error status:", error.response.status);
                alert(`Server error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
            } else if (error.request) {
                // The request was made but no response was received
                console.error("No response received:", error.request);
                alert("No response received from server. Please check your connection.");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error setting up request:", error.message);
                alert(`Error: ${error.message}`);
            }
        }
    };

    // Handle file input change
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            sendRequestToBackend(file);
        }
    };

    // Effect for converting and downloading MIDI file on component render
    useEffect(() => {
        if (recordedData) {
            console.log("Converting JSON to MIDI file...");
            convertJsonToMidiFile(recordedData, selectedSong);
        }
    }, [recordedData, selectedSong]);

    return (
        <div>
            <div className="file-input-container">
                <input
                    type="file"
                    accept=".mid"
                    onChange={handleFileChange}
                    className="file-input"
                />
            </div>

            {comparisonResults && (
                <div className="results-container">
                    <h2>Comparison Results</h2>
                    <div className="graph">
                        {visualization ? (
                            <img src={`data:image/svg+xml;base64,${visualization}`} alt="MIDI Comparison Graph" />
                        ) : (
                            <p>No graph available</p>
                        )}
                    </div>
                    <div className="graph">
                        {visualization2 ? (
                            <img src={`data:image/svg+xml;base64,${visualization2}`} alt="MIDI Accuracies Graph" />
                        ) : (
                            <p>No graph available</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}