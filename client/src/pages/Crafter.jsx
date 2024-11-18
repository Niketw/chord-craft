import { useState, useEffect } from "react";
import Header from "../components/Header";
import { Midi } from '@tonejs/midi';
import MidiCanvas from "../components/MidiCanvas";
import httpClient from "../HttpClient";

export default function Crafter() {
    const [midiData, setMidiData] = useState(null);
    const [songs, setSongs] = useState([]);
    const [selectedSong, setSelectedSong] = useState(null);

    
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

    

    const handleDropdownSelect = async (event) => {
        const file = event.target.value;
        if (!file) {
            console.log('No file selected');
            return
        };
    
        try {
            // const response = await fetch(filePath);
            console.log(typeof(file));
            
            // const arrayBuffer = await file.arrayBuffer();
            // const midi = new Midi(arrayBuffer);
            // setMidiData(midi);
            // console.log(arrayBuffer);
            // setSelectedSong(file);
        } catch (err) {
            console.log('Error loading MIDI file: ' + err.message);
        }
    }

    
    return(
        <>
            <Header />
            <section className="bg-craft_black min-h-screen px-24 py-16">

                <div className="px-4 py-2  mt-12 mb-4 flex justify-center">
                    <select onChange={handleDropdownSelect} defaultValue="">
                        <option value="" disabled>Select a file</option>
                        {songs.map((file, index) => (
                        <option key={index} value={file}>{file}</option>
                        ))}
                    </select>
                </div>
                


                {midiData && <MidiCanvas midiData={midiData} selectedSong={selectedSong}/> }
            </section>
        </>
    )
}