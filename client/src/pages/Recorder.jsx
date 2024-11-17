// import React, { useState } from 'react';
// import Header from "../components/Header.jsx";
// import { saveAs } from 'file-saver';
//
// export default function Recorder() {
//     // State for tracking if the MIDI file has been sent
//     const [fileSent, setFileSent] = useState(false);
//
//     // Function to send a hardcoded MIDI file to the backend for comparison
//     const sendMidiToBackend = () => {
//         // Replace with the path or actual file data you want to use
//         fetch('../../../../../Songs/Faded.mid')
//             .then(response => response.blob())
//             .then(midiBlob => {
//                 console.log('Preparing to send MIDI file to backend for comparison...');
//                 const formData = new FormData();
//                 formData.append('midi', midiBlob, 'Faded.mid');
//
//                 // Send the MIDI file to the comparator endpoint
//                 fetch('/comparator', {
//                     method: 'POST',
//                     body: formData,
//                 })
//                     .then((response) => {
//                         if (!response.ok) {
//                             throw new Error('Network response was not ok');
//                         }
//                         return response.json(); // Assuming the backend returns comparison results as JSON
//                     })
//                     .then((comparisonResult) => {
//                         console.log('Comparison result received:', comparisonResult);
//                         alert('Comparison completed! Check the console for details.');
//                         setFileSent(true);
//                     })
//                     .catch((error) => {
//                         console.error('Error sending MIDI file for comparison:', error);
//                         alert('An error occurred while sending the MIDI file for comparison. Please try again.');
//                     });
//             })
//             .catch(error => {
//                 console.error('Error fetching the hardcoded MIDI file:', error);
//                 alert('Error loading the hardcoded MIDI file. Please check the file path.');
//             });
//     };
//
//     return (
//         <>
//             <Header />
//             <section className="bg-craft_grey h-screen overflow-y-scroll px-24 py-32">
//                 <h2 className="text-primary">MIDI Comparator</h2>
//                 <div className="input_interface border border-primary px-3 flex gap-4 items-center mb-4">
//                     <h4 className="text-primary w-44">Send MIDI File for Comparison</h4>
//                     <div className="flex gap-4">
//                         <button className="btn-default" onClick={sendMidiToBackend} disabled={fileSent}>
//                             {fileSent ? 'File Sent' : 'Send for Comparison'}
//                         </button>
//                     </div>
//                 </div>
//
//                 {/* Analysis Output Interface */}
//                 <div className="output_interface border border-primary rounded-3xl px-3">
//                     <h4 className="text-primary w-44">Comparison Results</h4>
//                     <div className="flex gap-4"></div>
//                     <h4 className="text-primary w-44">Graph</h4>
//                     <div className="flex gap-4"></div>
//                 </div>
//             </section>
//         </>
//     );
// }



// import React, { useState } from 'react';
// import Header from "../components/Header.jsx";
// import httpClient from "../HttpClient.js";
//
// export default function Recorder() {
//     // State for tracking the result of the comparison
//     const [fileSent, setFileSent] = useState(false);
//
//     // Function to send the MIDI file path to the backend for comparison
//     const sendMidiToBackend = async () => {
//         const midiFilePath = '../pages/Faded.mid'; // Path to the MIDI file
//
//         try {
//             // Send the path to the comparator endpoint using axios (httpClient)
//             const resp = await httpClient.post('/comparator', { path: midiFilePath });
//
//             // Assuming the response contains comparison results
//             console.log('Comparison result received:', response.data);
//             alert('Comparison completed! Check the console for details.');
//             setFileSent(true);
//         } catch (error) {
//             // Check for specific error status (e.g., if the file already exists)
//             if (error.response && error.response.status === 409) {
//                 alert('MIDI file already exists or there was a conflict');
//             } else {
//                 console.error('Error sending MIDI file path for comparison:', error);
//                 alert(`An error occurred: ${error.message}`);
//             }
//         }
//     };
//
//     return (
//         <>
//             <Header />
//             <section className="bg-craft_grey h-screen overflow-y-scroll px-24 py-32">
//                 <h2 className="text-primary">MIDI Comparator</h2>
//
//                 <div className="input_interface border border-primary px-3 flex gap-4 items-center mb-4">
//                     <button className="btn-default" onClick={sendMidiToBackend} disabled={fileSent}>
//                         {fileSent ? 'File Sent' : 'Send MIDI for Comparison'}
//                     </button>
//                 </div>
//
//                 {/* Analysis Output Interface */}
//                 <div className="output_interface border border-primary rounded-3xl px-3">
//                     <h4 className="text-primary w-44">Comparison Results</h4>
//                     <div className="flex gap-4"></div>
//                     <h4 className="text-primary w-44">Graph</h4>
//                     <div className="flex gap-4"></div>
//                 </div>
//             </section>
//         </>
//     );
// }


// import React, { useState } from 'react';
// import Header from "../components/Header.jsx";
// import httpClient from "../HttpClient.js";
//
// export default function Recorder() {
//     // State to track the comparison results and visualization image
//     const [fileSent, setFileSent] = useState(false);
//     const [comparisonResults, setComparisonResults] = useState(null);
//     const [visualization, setVisualization] = useState(null);
//
//     // Function to send the MIDI file path to the backend for comparison
//     const sendMidiToBackend = async () => {
//         const midiFilePath = '../pages/Faded.mid'; // Path to the MIDI file
//
//         try {
//
//             const response = await httpClient.post('/comparator', { path: midiFilePath });
//             if (Array.isArray(response.data.accuracies)) {
//                 setComparisonResults(response.data.accuracies);
//                 setVisualization(response.data.visualization);
//             } else {
//                 console.error("Error: Expected 'accuracies' to be an array.");
//                 alert("There was an issue with the comparison data.");
//             }
//             // Assuming the response contains comparison results and visualization (base64 image)
//             console.log('Comparison result received:', response.data);
//             alert('Comparison completed! Check the comparison results below.');
//             setFileSent(true);
//         } catch (error) {
//             console.error('Error sending MIDI file for comparison:', error);
//             alert(`An error occurred: ${error.message}`);
//         }
//     };
//
//     return (
//         <>
//             <Header />
//             <section className="bg-craft_grey h-screen overflow-y-scroll px-24 py-32">
//                 <h2 className="text-primary">MIDI Comparator</h2>
//
//                 <div className="input_interface border border-primary px-3 flex gap-4 items-center mb-4">
//                     <button className="btn-default" onClick={sendMidiToBackend} disabled={fileSent}>
//                         {fileSent ? 'File Sent' : 'Send MIDI for Comparison'}
//                     </button>
//                 </div>
//
//                 {/* Analysis Output Interface */}
//                 {comparisonResults && (
//                     <div className="output_interface border border-primary rounded-3xl px-3">
//                         <h4 className="text-primary w-44">Comparison Results</h4>
//                         <div className="comparison-results">
//                             {comparisonResults.map((segment, index) => (
//                                 <div key={index} className="segment-result mb-4">
//                                     <h5>{segment.segment}</h5>
//                                     <p>Pitch Accuracy: {segment.pitch_accuracy}%</p>
//                                     <p>Tempo Accuracy: {segment.tempo_accuracy}%</p>
//                                     <p>Dynamics Accuracy: {segment.dynamics_accuracy}%</p>
//                                     <p>Rhythm Accuracy: {segment.rhythm_accuracy}%</p>
//                                 </div>
//                             ))}
//                         </div>
//
//                         <h4 className="text-primary w-44">Graph</h4>
//                         <div className="graph">
//                             {visualization ? (
//                                 <img src={`data:image/png;base64,${visualization}`} alt="MIDI Comparison Graph" />
//                             ) : (
//                                 <p>No graph available</p>
//                             )}
//                         </div>
//                     </div>
//                 )}
//             </section>
//         </>
//     );
// }

//
// import React, { useState } from 'react';
// import Header from "../components/Header.jsx";
// import httpClient from "../HttpClient.js";
//
// export default function Recorder() {
//     // State to track the comparison results and visualization image
//     const [fileSent, setFileSent] = useState(false);
//     const [comparisonResults, setComparisonResults] = useState(null);
//     const [visualization, setVisualization] = useState(null);
//
//     // Function to send the POST request to the backend for comparison
//     const sendRequestToBackend = async () => {
//         try {
//             console.log("bhej raha hoon");
//             // Send POST request to /comparator endpoint
//             const response = await httpClient.post('/comparator');
//             console.log("bhej chuka hoon");
//             // Check if the response contains 'accuracies' as an array
//             if (Array.isArray(response.data.accuracies)) {
//                 setComparisonResults(response.data.accuracies);
//                 setVisualization(response.data.visualization);
//             } else {
//                 console.error("Error: Expected 'accuracies' to be an array.");
//                 alert("There was an issue with the comparison data.");
//             }
//             console.log(visualization);
//
//             // Log the response data
//             console.log('Comparison result received:', response.data);
//
//             // Notify user that the comparison is complete
//             alert('Comparison completed! Check the comparison results below.');
//
//             // Disable the button after the request is sent
//             setFileSent(true);
//         } catch (error) {
//             console.error('Error sending request for comparison:', error);
//             alert(`An error occurred: ${error.message}`);
//         }
//     };
//
//     return (
//         <>
//             <Header />
//             <section className="bg-craft_grey h-screen overflow-y-scroll px-24 py-32">
//                 <h2 className="text-primary">MIDI Comparator</h2>
//
//                 <div className="input_interface border border-primary px-3 flex gap-4 items-center mb-4">
//                     {/* Button to send the request to the backend */}
//                     <button className="btn-default" onClick={sendRequestToBackend} disabled={fileSent}>
//                         {fileSent ? 'Comparison Complete' : 'Start Comparison'}
//                     </button>
//                 </div>
//
//                 {/* Analysis Output Interface */}
//                 {comparisonResults && (
//                     <div className="output_interface border border-primary rounded-3xl px-3">
//                         <h4 className="text-primary w-44">Comparison Results</h4>
//                         <div className="comparison-results">
//                             {comparisonResults.map((segment, index) => (
//                                 <div key={index} className="segment-result mb-4">
//                                     <h5>{segment.segment}</h5>
//                                     <p>Pitch Accuracy: {segment.pitch_accuracy}%</p>
//                                     <p>Tempo Accuracy: {segment.tempo_accuracy}%</p>
//                                     <p>Dynamics Accuracy: {segment.dynamics_accuracy}%</p>
//                                     <p>Rhythm Accuracy: {segment.rhythm_accuracy}%</p>
//                                 </div>
//                             ))}
//                         </div>
//
//                         <h4 className="text-primary w-44">Graph</h4>
//                         <div className="graph">
//                             {visualization ? (
//                                 <img src={`data:image/svg+xml;base64,${visualization}`} alt="MIDI Comparison Graph" />
//                             ) : (
//                                 <p>No graph available</p>
//                             )}
//                         </div>
//                     </div>
//                 )}
//             </section>
//         </>
//     );
// }
//



// import React, { useState, useEffect } from 'react';
// import Header from "../components/Header.jsx";
// import httpClient from "../HttpClient.js";
//
// export default function Recorder() {
//     // State to track the comparison results, visualization image, and song list
//     const [fileSent, setFileSent] = useState(false);
//     const [comparisonResults, setComparisonResults] = useState(null);
//     const [visualization, setVisualization] = useState(null);
//     const [songs, setSongs] = useState([]);  // For storing the list of available songs
//     const [selectedSong, setSelectedSong] = useState('');  // To track the selected song
//
//     // Fetch the list of songs from the backend when the component mounts
//     useEffect(() => {
//         const fetchSongs = async () => {
//             try {
//                 const response = await httpClient.get('/songs');  // GET request to fetch songs
//                 if (response.data.songs) {
//                     setSongs(response.data.songs);
//                 } else {
//                     alert('No songs available.');
//                 }
//             } catch (error) {
//                 console.error('Error fetching song list:', error);
//                 alert(`An error occurred while fetching the song list: ${error.message}`);
//             }
//         };
//
//         fetchSongs();  // Call the function to fetch songs
//     }, []);
//
//     // Function to send the POST request to the backend for comparison
//     const sendRequestToBackend = async () => {
//         try {
//             if (!selectedSong) {
//                 alert('Please select a song first.');
//                 return;
//             }
//
//             console.log("Sending request...");
//             // Send POST request to /comparator endpoint with selected song name
//             const response = await httpClient.post('/comparator', {
//                 song_name: selectedSong,  // Send the selected song name to the backend
//             });
//             console.log("Request sent.");
//
//             // Check if the response contains 'accuracies' as an array
//             if (Array.isArray(response.data.accuracies)) {
//                 setComparisonResults(response.data.accuracies);
//                 setVisualization(response.data.visualization);
//             } else {
//                 console.error("Error: Expected 'accuracies' to be an array.");
//                 alert("There was an issue with the comparison data.");
//             }
//
//             // Log the response data
//             console.log('Comparison result received:', response.data);
//
//             // Notify user that the comparison is complete
//             alert('Comparison completed! Check the comparison results below.');
//
//             // Disable the button after the request is sent
//             setFileSent(true);
//         } catch (error) {
//             console.error('Error sending request for comparison:', error);
//             alert(`An error occurred: ${error.message}`);
//         }
//     };
//
//     return (
//         <>
//             <Header />
//             <section className="bg-craft_grey h-screen overflow-y-scroll px-24 py-32">
//                 <h2 className="text-primary">MIDI Comparator</h2>
//
//                 <div className="input_interface border border-primary px-3 flex gap-4 items-center mb-4">
//                     {/* Dropdown to select a song */}
//                     <select
//                         className="btn-default"
//                         value={selectedSong}
//                         onChange={(e) => setSelectedSong(e.target.value)}
//                     >
//                         <option value="">Select a Song</option>
//                         {songs.map((song, index) => (
//                             <option key={index} value={song}>{song}</option>
//                         ))}
//                     </select>
//
//                     {/* Button to send the request to the backend */}
//                     <button className="btn-default" onClick={sendRequestToBackend} disabled={fileSent}>
//                         {fileSent ? 'Comparison Complete' : 'Start Comparison'}
//                     </button>
//                 </div>
//
//                 {/* Analysis Output Interface */}
//                 {comparisonResults && (
//                     <div className="output_interface border border-primary rounded-3xl px-3">
//                         <h4 className="text-primary w-44">Comparison Results</h4>
//                         <div className="comparison-results">
//                             {comparisonResults.map((segment, index) => (
//                                 <div key={index} className="segment-result mb-4">
//                                     <h5>{segment.segment}</h5>
//                                     <p>Pitch Accuracy: {segment.pitch_accuracy}%</p>
//                                     <p>Tempo Accuracy: {segment.tempo_accuracy}%</p>
//                                     <p>Dynamics Accuracy: {segment.dynamics_accuracy}%</p>
//                                     <p>Rhythm Accuracy: {segment.rhythm_accuracy}%</p>
//                                 </div>
//                             ))}
//                         </div>
//
//                         <h4 className="text-primary w-44">Graph</h4>
//                         <div className="graph">
//                             {visualization ? (
//                                 <img src={`data:image/svg+xml;base64,${visualization}`} alt="MIDI Comparison Graph" />
//                             ) : (
//                                 <p>No graph available</p>
//                             )}
//                         </div>
//                     </div>
//                 )}
//             </section>
//         </>
//     );
// }


import React, { useState, useEffect } from 'react';
import Header from "../components/Header.jsx";
import httpClient from "../HttpClient.js";
import Footer from '../components/Footer';

export default function Recorder() {
    // State to track the comparison results, visualization image, and song list
    const [fileSent, setFileSent] = useState(false);
    const [comparisonResults, setComparisonResults] = useState(null);
    const [visualization, setVisualization] = useState(null);
    const [visualization2, setVisualization2] = useState(null);
    const [songs, setSongs] = useState([]);  // For storing the list of available songs
    const [selectedSong, setSelectedSong] = useState('');  // To track the selected song
    const [newSong, setNewSong] = useState(null);  // To store the uploaded new song file

    // Fetch the list of songs from the backend when the component mounts
    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await httpClient.get('/songs');  // GET request to fetch songs
                if (response.data.songs) {
                    setSongs(response.data.songs);
                } else {
                    alert('No songs available.');
                }
            } catch (error) {
                console.error('Error fetching song list:', error);
                alert(`An error occurred while fetching the song list: ${error.message}`);
            }
        };

        fetchSongs();  // Call the function to fetch songs
    }, []);

    // Function to handle file selection for a new song upload
    const handleFileChange = (event) => {
        const file = event.target.files[0];  // Get the selected file
        setNewSong(file);
        setSelectedSong('');  // Clear the selected song from the dropdown if a new song is uploaded
    };

    // Function to send the POST request to the backend for comparison
    const sendRequestToBackend = async () => {
    try {
        if (!newSong) {
            alert("Please upload a file first.");
            return;
        }


        console.log("Sending file to backend...");

        let formData = new FormData();
        formData.append("played_file", newSong);  // Attach the uploaded file

        if (selectedSong) {
            formData.append("song_name", selectedSong);  // Attach the selected song name
        }

        // Log FormData content to the console for debugging
        for (let pair of formData.entries()) {
            if (pair[0] === 'played_file') {
                console.log(pair[0] + ": " + pair[1].name);  // Log the file name if it's 'played_file'
            } else {
                console.log(pair[0] + ": " + pair[1]);  // Log song_name as text
            }
        }

        const response = await httpClient.post("/comparator", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("Request sent.");
        console.log(response.data)
        if (response.data.accuracy) {
        setComparisonResults(response.data.accuracy);
            setVisualization(response.data.visualization);
            setVisualization2(response.data.visualization2);
        } else {
            console.error("Error: Expected 'accuracies' to be an array.");
            alert("There was an issue with the comparison data.");
        }

        console.log("Comparison result received:", response.data);
        alert("Comparison completed! Check the comparison results below.");
        setFileSent(true);
    } catch (error) {
        console.error("Error sending request for comparison:", error);
        alert(`An error occurred: ${error.message}`);
    }
};

    return (
        <>
            <Header />
            <section className="bg-craft_grey h-screen overflow-y-scroll px-24 py-32">
                <h2 className="text-primary">MIDI Comparator</h2>

                <div className="input_interface border border-primary px-3 flex gap-4 items-center mb-4">
                    {/* Dropdown to select a song */}
                    <select
                        className="btn-default"
                        value={selectedSong}
                        onChange={(e) => setSelectedSong(e.target.value)}
                    >
                        <option value="">Select a Song</option>
                        {songs.map((song, index) => (
                            <option key={index} value={song}>{song}</option>
                        ))}
                    </select>

                    {/* File input for uploading a new song */}
                    <input
                        type="file"
                        accept=".mid,.midi"
                        onChange={handleFileChange}
                        className="btn-default"
                    />

                    {/* Button to send the request to the backend */}
                    <button className="btn-default" onClick={sendRequestToBackend} disabled={fileSent}>
                        {fileSent ? 'Comparison Complete' : 'Start Comparison'}
                    </button>
                </div>

                {/* Analysis Output Interface */}
                {comparisonResults && (
                    <div className="output_interface border border-primary rounded-3xl px-3">
                        <h4 className="text-primary w-44">Comparison Results</h4>
                        <div className="comparison-results">
                            <p>Pitch Accuracy: {comparisonResults.pitch_accuracy}%</p>
                            <p>Tempo Accuracy: {comparisonResults.tempo_accuracy}%</p>
                            <p>Dynamics Accuracy: {comparisonResults.dynamics_accuracy}%</p>
                            <p>Rhythm Accuracy: {comparisonResults.rhythm_accuracy}%</p>
                        </div>

                        <h4 className="text-primary w-44">Graph</h4>
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
            </section>
            <Footer />
        </>
    );
}
