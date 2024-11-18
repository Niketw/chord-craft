import { useEffect, useState } from 'react';
import MidiWriter from 'midi-writer-js';
import httpClient from '../HttpClient';

export default function Comparator({ recordedData, selectedSong }) { 
    const [comparisonResults, setComparisonResults] = useState(null);
    const [visualization, setVisualization] = useState(null);
    const [visualization2, setVisualization2] = useState(null);

    const convertJsonToMidiFile = (jsonData) => {
        const track = new MidiWriter.Track();

        const tempo = jsonData.header.tempos[0].bpm;
        track.setTempo(tempo);

        jsonData.tracks[0].notes.forEach(note => {
            const midiNote = new MidiWriter.NoteEvent({
                pitch: note.midi,
                duration: `T${note.durationTicks}`,
                velocity: note.velocity * 100, 
                startTick: note.ticks
            });
            track.addEvent(midiNote);
        });

        const writer = new MidiWriter.Writer(track);

        const midiBlob = new Blob([writer.buildFile()], { type: 'audio/midi' });
        const midiFile = new File([midiBlob], 'recorded.mid', { type: 'audio/midi' });

        return midiFile;
    };

    useEffect(() => {
        const sendRequestToBackend = async () => {
            try {
                if (!recordedData) {
                    console.error("No recorded data available");
                    return;
                }

                console.log("Converting JSON to MIDI file...");
                const midiFile = convertJsonToMidiFile(recordedData);

                console.log("Creating FormData...");
                const formData = new FormData();

                formData.append("played_file", midiFile);
                formData.append("song_name", selectedSong);

                // Log FormData content for debugging
                for (let pair of formData.entries()) {
                    if (pair[0] === 'played_file') {
                        console.log(pair[0] + ": " + pair[1].name);
                    } else {
                        console.log(pair[0] + ": " + pair[1]);
                    }
                }

                const response = await httpClient.post("/comparator", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response;
                console.log("Response received:", data);

                const incrementClickCount = async (songName) => {
                    try {
                        const response = await httpClient.post("/increment-clicks", { song_name: songName });

                        if (response.data) {
                            console.log("Click count updated:", response.data);
                        }
                    } catch (error) {
                        console.error("Error incrementing click count:", error);
                    }
                };

                if (data.accuracy) {
                    setComparisonResults(data.accuracy);
                    setVisualization(data.visualization);
                    setVisualization2(data.visualization2);
                } else {
                    console.error("Error: Expected 'accuracy' in response data");
                    alert("There was an issue with the comparison data.");
                }

                alert("Comparison completed! Check the comparison results below.");
            } catch (error) {
                console.error("Error sending request for comparison:", error);
                alert(`An error occurred: ${error.message}`);
            }
        };

        if (recordedData) {
            sendRequestToBackend();
        }
    }, [recordedData]);

    return (
        <div>
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