import Header from '../components/Header';
import Footer from '../components/Footer';
import {useEffect, useState} from 'react';
import httpClient from "../HttpClient.js";


export default function History() {
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await httpClient.get('/songs/history');
                setSongs(response.data);
            } catch (error) {
                console.error('Error fetching song history:', error);
            }
        };
        fetchSongs();
    }, []);

    return (
        <>
            <Header />
            <section className="bg-craft_black min-h-screen py-24 px-8">
                <div className="container mx-auto">
                    <h1 className="text-xl font-bold text-white mb-8">Your Song History</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {songs.map((song) => (
                            <div key={song.id} className="bg-gray-800 rounded-2xl p-6 hover:shadow-lg transition duration-300">
                                <h2 className="text-xl font-semibold text-white mb-2">{song.title}</h2>
                                <p className="text-gray-400">{song.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}