import Header from '../components/Header.jsx';
import Hero_logo from '../vectors/Hero_logo.svg';
import Ellipse from '../vectors/Ellipse 2.svg';
import { useState, useEffect } from 'react';

import httpClient from "../HttpClient.js";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Landing() {
    const [user, setUser] = useState(null);

    const getStarted = () => {
        window.location.href = "/register";
    }

    useEffect(() => {
        (async () => {
            try {
                const resp = await httpClient.get('/@me');
                setUser(resp.data);
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);


    return (
        <>
        <Header />
        <section className="bg-white h-screen relative overflow-hidden">
            {/* Background image */}
            <div className="absolute inset-0 w-full h-full">
                <img src="https://i.ibb.co/26nvzhX/dude.jpg" className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-white bg-opacity-50"></div>
            </div>

            {/* Hero content overlay */}
            <div className="relative h-full">
                <div className="w-full md:w-1/2 h-full flex items-center justify-center backdrop-blur-sm bg-black/70 p-8 rounded-br-3xl">
                    <div className="text-center">
                        {user ? (
                            <>
                                <h4 className="text-primary text-xl mb-2">Welcome, {user.name}</h4>
                                <p className="text-gray-400 mb-6">Pick where you left off</p>
                                <div>
                                    <a href="/recorder">
                                        <button className="btn-alter-default rounded-full hover:rounded-full">Compare audio</button>
                                    </a>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="hero grid items-center relative grid-cols-1 min-h-[400px]">
                                    <img src={Hero_logo} className="max-w-full h-auto"/>
                                </div>
                                <button className='btn-default rounded-full mb-6' onClick={getStarted}>Get Started</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
        <section className="bg-white h-screen">

        </section>
        </>
    )
}
