import { useEffect, useState } from 'react';
import httpClient from '../HttpClient.js';  // Make sure you have the correct import for your httpClient
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function LibraryPage() {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch the songs from the backend
    const fetchSongs = async () => {
        try {
            const response = await httpClient.get('/library-items');  // GET request to fetch songs
            if (response.data) {
                setSongs(response.data); // Directly set the response data as songs
            } else {
                alert('No songs available.');
            }
        } catch (error) {
            console.error('Error fetching song list:', error);
            alert(`An error occurred while fetching the song list: ${error.message}`);
        } finally {
            setLoading(false);  // Set loading to false after the fetch attempt
        }
    };

    useEffect(() => {
        fetchSongs(); // Call the function when the component is mounted
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

return (
    <>
        <Header />
        <section className="bg-craft_black min-h-screen p-8 mt-8">
            <div className="bg-craft_grey text-primary p-8 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {songs.map((song) => (
                        <div key={song.id} className="flex flex-col items-center justify-center"> {/* Added 'justify-center' */}
                            <div className="flex items-center justify-center w-full max-w-xs h-56 overflow-hidden rounded-lg mt-4"> {/* Added dynamic height */}
                                <img
                                    src={song.image} // Base64 image
                                    alt={song.title}
                                    className="w-auto h-full object-scale-down block mx-auto object-contain" // Ensures the image fits inside the container
                                />
                            </div>
                            <h3 className="mt-3 text-lg font-semibold text-center">{song.title}</h3>
                            <p className="text-base text-gray-400 text-center">{song.subtitle}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
        <Footer />
    </>
);


}
