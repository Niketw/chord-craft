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
                <div className="w-full md:w-1/2 h-full flex items-center justify-center backdrop-blur-sm bg-violet-950/70 p-8 rounded-br-3xl">
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
            {/* Glow effect */}
            <div className="absolute top-0 left-0 w-96 h-96 -translate-x-1/2 -translate-y-1/2 bg-pink-500/30 rounded-full blur-3xl"></div>
            <h1 className="text-6xl font-extrabold text-center pt-16 bg-gradient-to-r from-pink-100 to-blue-100 rounded-bl-3xl rounded-br-3xl">About Us</h1>
            <div className="flex h-[calc(100%-8rem)]">
                {/* Left half - Team info */}
                <div className="w-1/2 p-12 flex items-center">
                    <p className="text-lg leading-relaxed text-gray-700 text-balance text-pretty" style={{fontSize: 'clamp(1rem, 2vw, 1.5rem)'}}>
                        We are a passionate team of musicians and developers dedicated to helping musicians improve their craft. 
                        Our innovative platform combines cutting-edge technology with musical expertise to provide detailed analysis 
                        and feedback on your performances. Whether you're a beginner learning your first piece or an advanced musician 
                        fine-tuning your skills, our tools are designed to help you reach your full potential. We believe in the power 
                        of technology to enhance musical education and make learning more accessible and engaging for everyone.
                    </p>
                </div>

                {/* Right half - Image slideshow */}
                <div className="w-1/2 p-12 relative overflow-hidden rounded-2xl">
                    <div className="slideshow h-full relative">
                        <img src="https://picsum.photos/800/500" alt="Team at work" className="w-full h-full object-cover rounded-2xl absolute transition-opacity duration-1000 ease-in-out" style={{animation: 'fade1 12s infinite'}}/>
                        <img src="https://picsum.photos/800/500" alt="Recording session" className="w-full h-full object-cover rounded-2xl absolute transition-opacity duration-1000 ease-in-out" style={{animation: 'fade2 12s infinite'}}/>
                        <img src="https://picsum.photos/800/500" alt="Development meeting" className="w-full h-full object-cover rounded-2xl absolute transition-opacity duration-1000 ease-in-out" style={{animation: 'fade3 12s infinite'}}/>
                        <img src="https://picsum.photos/800/500" alt="Music practice" className="w-full h-full object-cover rounded-2xl absolute transition-opacity duration-1000 ease-in-out" style={{animation: 'fade4 12s infinite'}}/>
                        <img src="https://picsum.photos/800/500" alt="Team collaboration" className="w-full h-full object-cover rounded-2xl absolute transition-opacity duration-1000 ease-in-out" style={{animation: 'fade5 12s infinite'}}/>
                        <img src="https://picsum.photos/800/500" alt="Studio setup" className="w-full h-full object-cover rounded-2xl absolute transition-opacity duration-1000 ease-in-out" style={{animation: 'fade6 12s infinite'}}/>
                    </div>
                    <style>
                        {`
                            @keyframes fade1 {
                                0%, 16.66% { opacity: 1; }
                                16.67%, 100% { opacity: 0; }
                            }
                            @keyframes fade2 {
                                0% { opacity: 0; }
                                16.66%, 33.32% { opacity: 1; }
                                33.33%, 100% { opacity: 0; }
                            }
                            @keyframes fade3 {
                                0%, 33.32% { opacity: 0; }
                                33.33%, 49.99% { opacity: 1; }
                                50%, 100% { opacity: 0; }
                            }
                            @keyframes fade4 {
                                0%, 49.99% { opacity: 0; }
                                50%, 66.65% { opacity: 1; }
                                66.66%, 100% { opacity: 0; }
                            }
                            @keyframes fade5 {
                                0%, 66.65% { opacity: 0; }
                                66.66%, 83.32% { opacity: 1; }
                                83.33%, 100% { opacity: 0; }
                            }
                            @keyframes fade6 {
                                0%, 83.32% { opacity: 0; }
                                83.33%, 99.99% { opacity: 1; }
                                100% { opacity: 0; }
                            }
                        `}
                    </style>
                </div>
            </div>
        </section>
        
        <section>

        </section>
        <Footer />
        </>
    )
}
