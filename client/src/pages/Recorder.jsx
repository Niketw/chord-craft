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


import React, { useState } from 'react';
import Header from "../components/Header.jsx";
import httpClient from "../HttpClient.js";

export default function Recorder() {
    // State to track the comparison results and visualization image
    const [fileSent, setFileSent] = useState(false);
    const [comparisonResults, setComparisonResults] = useState(null);
    const [visualization, setVisualization] = useState(null);

    // Function to send the MIDI file path to the backend for comparison
    const sendMidiToBackend = async () => {
        const midiFilePath = '../pages/Faded.mid'; // Path to the MIDI file

        try {
            // Send the MIDI file path to the backend using axios
            const response = await httpClient.post('/comparator', { path: midiFilePath });

            // Assuming the response contains comparison results and visualization (base64 image)
            console.log('Comparison result received:', response.data);

            // Set the comparison results and visualization
            setComparisonResults(response.data.accuracies);
            setVisualization(response.data.visualization);

            alert('Comparison completed! Check the comparison results below.');
            setFileSent(true);
        } catch (error) {
            console.error('Error sending MIDI file for comparison:', error);
            alert(`An error occurred: ${error.message}`);
        }
    };

    return (
        <>
            <Header />
            <section className="bg-craft_grey h-screen overflow-y-scroll px-24 py-32">
                <h2 className="text-primary">MIDI Comparator</h2>

                <div className="input_interface border border-primary px-3 flex gap-4 items-center mb-4">
                    <button className="btn-default" onClick={sendMidiToBackend} disabled={fileSent}>
                        {fileSent ? 'File Sent' : 'Send MIDI for Comparison'}
                    </button>
                </div>

                {/* Analysis Output Interface */}
                {comparisonResults && (
                    <div className="output_interface border border-primary rounded-3xl px-3">
                        <h4 className="text-primary w-44">Comparison Results</h4>
                        <div className="comparison-results">
                            {comparisonResults.map((segment, index) => (
                                <div key={index} className="segment-result mb-4">
                                    <h5>{segment.segment}</h5>
                                    <p>Pitch Accuracy: {segment.pitch_accuracy}%</p>
                                    <p>Tempo Accuracy: {segment.tempo_accuracy}%</p>
                                    <p>Dynamics Accuracy: {segment.dynamics_accuracy}%</p>
                                    <p>Rhythm Accuracy: {segment.rhythm_accuracy}%</p>
                                </div>
                            ))}
                        </div>

                        <h4 className="text-primary w-44">Graph</h4>
                        <div className="graph">
                            {visualization ? (
                                <img src={`data:image/png;base64,${visualization}`} alt="MIDI Comparison Graph" />
                            ) : (
                                <p>No graph available</p>
                            )}
                        </div>
                    </div>
                )}
            </section>
        </>
    );
}
