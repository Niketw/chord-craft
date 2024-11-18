import Header from '../components/Header.jsx';
import Hero_logo from '../vectors/newlogo.svg';
import Ellipse from '../vectors/Ellipse 2.svg';
import { useState, useEffect } from 'react';

import httpClient from "../HttpClient.js";
import Footer from '../components/Footer';

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

    //UI starts here


    return (
        <>
        <Header />
        <section className="bg-white h-screen relative overflow-hidden">
            {/* Background video */}
            <div className="absolute inset-0 w-full h-full">
                {!user && (
                    <video 
                        autoPlay 
                        muted 
                        loop 
                        className="w-full h-full object-cover"
                    >
                        <source src="https://fantastic-twilight-7bfa45.netlify.app/newusers.mp4" type="video/mp4" />
                    </video>
                )}
                {user && (
                    <img src="https://i.ibb.co/26nvzhX/dude.jpg" className="w-full h-full object-cover"/>
                )}
            </div>

            {/* Hero content overlay */}
            <div className="relative h-full">
                <div className="w-full md:w-1/2 h-full flex items-center justify-center backdrop-blur-sm bg-blue-800/20 p-8 rounded-br-3xl">
                    <div className="text-center">
                        {user ? (
                            <>
                                <h4 className="text-primary text-xl mb-2">Welcome, {user.name}</h4>
                                <p className="text-gray-200 mb-6">Pick where you left off</p>
                                <div>
                                    <a href="/craft">
                                        <button className="btn-alter-default rounded-full hover:rounded-full bg-pink-600">Compare audio</button>
                                    </a>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="hero grid items-center relative grid-cols-1 min-h-[400px]">
                                    <img src={Hero_logo} className="max-w-full h-auto"/>
                                </div>
                                <button className='btn-default rounded-full mb-6 hover:bg-pink-300' onClick={getStarted}>Get Started</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>

        <section className="bg-white h-screen relative">

        </section>
        
        <section>

        </section>
        <Footer />
        </>
    )
}
