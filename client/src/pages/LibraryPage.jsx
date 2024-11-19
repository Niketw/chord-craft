import { useEffect, useState } from 'react';
import httpClient from '../HttpClient.js';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function LibraryPage() {
    useEffect(() => {
        document.title = "Library | ChordCraft";
    }, []);

    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOption, setSortOption] = useState("trending");  // Track selected sort option

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

    // Sorting logic
    const sortSongs = (option) => {
        let sortedSongs = [...songs];
        if (option === "alphabetical") {
            sortedSongs.sort((a, b) => a.title.localeCompare(b.title));
        } else if (option === "artist") {
            sortedSongs.sort((a, b) => a.artist.localeCompare(b.artist));
        } else if (option === "trending") {
            sortedSongs.sort((a, b) => b.clicks - a.clicks); // Assuming `clicks` indicates trending
        }
        return sortedSongs;
    };

    // Update the sorted songs based on the selected option
    const sortedSongs = sortSongs(sortOption);

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
                    {/* Dropdown for sorting options */}
                    <div className="mb-4">
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="bg-craft_black text-white border border-gray-700 p-2 rounded-lg"
                        >
                            <option value="trending">Trending</option>
                            <option value="alphabetical">Alphabetical Order</option>
                            <option value="artist">Artist</option>
                        </select>
                    </div>

                    {/* Song grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {sortedSongs.map((song) => (
                            <div
                                key={song.id}
                                className="bg-craft_black p-6 rounded-xl shadow-lg cursor-pointer hover:bg-action/10 hover:scale-105 transition-transform duration-200 border border-gray-700"
                                onClick={() => {
                                    // Store the selected song in localStorage
                                    localStorage.setItem('selectedSong', song.title);
                                    // Redirect to craft page
                                    window.location.href = '/craft';
                                }}
                            >
                                <div className="flex items-center justify-center w-full max-w-xs h-56 overflow-hidden rounded-lg">
                                    <img
                                        src={song.image}
                                        alt={song.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="mt-4 px-2">
                                    <h3 className="text-lg font-semibold text-white">{song.title}</h3>
                                    <p className="text-sm text-gray-400">{song.artist}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}
