import { useState, useEffect } from "react";
import Header from "../components/Header";
import { Midi } from '@tonejs/midi';
import MidiCanvas from "../components/MidiCanvas";
import httpClient from "../HttpClient";

export default function Crafter() {
    const [midiData, setMidiData] = useState(null);
    const [selectedSong, setSelectedSong] = useState(null);

    const [songs, setSongs] = useState([]);
    
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
    }, [0]);

    function base64ToArrayBuffer(base64String) {

        let binaryString = atob(base64String); // Decode Base64 string
      
        let array = new Uint8Array(binaryString.length); // Create a Uint8Array
      
        for (let i = 0; i < binaryString.length; i++) {
      
          array[i] = binaryString.charCodeAt(i); // Set each byte
      
        }
      
        return array.buffer; // Return the ArrayBuffer
      
      }
    
      

    

    const handleDropdownSelect = async (event) => {
    const filename = event.target.value;

    // Retrieve the selected option
    const selectedOption = event.target.options[event.target.selectedIndex];
    const filedata = selectedOption.getAttribute("data-song-data");

    if (!filename) {
        console.log('No file selected');
        return;
    }

    try {
        // Convert base64 data to an ArrayBuffer
        let arrayBuffer = base64ToArrayBuffer(filedata);

        // Parse the MIDI data
        const midi = new Midi(arrayBuffer);
        setMidiData(midi);

        console.log(arrayBuffer);

        // Set the selected song
        setSelectedSong(filename);
    } catch (err) {
        console.log('Error loading MIDI file: ' + err.message);
    }
};


    
    return(
        <>
            <Header />
            <section className="bg-craft_black min-h-screen px-24 py-16">

                <div className="px-4 py-2  mt-12 mb-4 flex justify-center">
                   <select onChange={handleDropdownSelect} defaultValue="">
                    <option value="" disabled>
                        Select a file
                    </option>
                    {songs.map((song, index) => (
                        <option key={index} value={song.name} data-song-data={song.data}>
                            {song.name}
                        </option>
                    ))}
                </select>


                    
                </div>
                


                {midiData && <MidiCanvas midiData={midiData} selectedSong={selectedSong}/> }
            </section>
        </>
    )
}