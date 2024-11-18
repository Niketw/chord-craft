import Header from '../components/Header.jsx';
import Hero_logo from '../vectors/newlogo.svg';
import Ellipse from '../vectors/Ellipse 2.svg';
import { useState, useEffect } from 'react';

import httpClient from "../HttpClient.js";
import Footer from '../components/Footer';

const apiUrl = import.meta.env.VITE_API_URL;

export default function Landing() {
    useEffect(() => {
        document.title = "Home | ChordCraft"
    }, []);
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
                    <video 
                    autoPlay 
                    muted 
                    loop 
                    className="w-full h-full object-cover"
                >
                    <source src="https://fantastic-twilight-7bfa45.netlify.app/login.mp4" type="video/mp4" />
                </video>
                )}
            </div>

            {/* Hero content overlay */}
            <div className="relative h-full">
                <div className="w-full md:w-1/2 h-full flex items-center justify-center backdrop-blur-xl bg-blue-800/20 p-8 ">
                    <div className="text-center">
                        {user ? (
                            <>
                                <h4 className="text-primary text-xl mb-2">Welcome, {user.name}</h4>
                                <p className="text-gray-200 mb-6">Pick where you left off</p>
                                <div>
                                    <a href="/craft">
                                        <button className="btn-alter-default rounded-full hover:rounded-full bg-craft_pink">Compare audio</button>
                                    </a>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="hero grid items-center relative grid-cols-1 min-h-[400px]">
                                    <img src={Hero_logo} className="max-w-full h-auto"/>
                                </div>
                                <button className='btn-default rounded-full mb-6 hover:bg-secondary' onClick={getStarted}>Get Started</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>

        {user && (
            <section id="how-to">
                <section className="text-gray-400 bg-gradient-to-b from-blue-600/30 to-black/30 body-font">
                    <section className="text-gray-400 body-font">
                        <div className="container px-5 py-24 mx-auto flex flex-wrap">
                            <div className="flex flex-col text-center w-full mb-20">
                                <h1 className="text-2xl font-medium title-font mb-4 text-white tracking-widest">HOW TO USE:</h1>
                            </div>
                            <div className="flex relative pt-10 pb-20 sm:items-center md:w-2/3 mx-auto">
                                <div className="h-full w-6 absolute inset-0 flex items-center justify-center">
                                    <div className="h-full w-1 bg-gray-800 pointer-events-none"></div>
                                </div>
                                <div className="flex-shrink-0 w-6 h-6 rounded-full mt-10 sm:mt-0 inline-flex items-center justify-center bg-purple-500 text-white relative z-10 title-font font-medium text-sm">1</div>
                                <div className="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
                                    <div className="flex-shrink-0 w-24 h-24 bg-gray-800 text-purple-400 rounded-full inline-flex items-center justify-center">
                                        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-12 h-12" viewBox="0 0 24 24">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                        </svg>
                                    </div>
                                    <div className="flex-grow sm:pl-6 mt-6 sm:mt-0">
                                        <h4 className="font-medium title-font text-white mb-1 text-xl">Select Audio Track</h4>
                                        <p className="leading-relaxed">Click on "select" button to choose your track for learning.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex relative pb-20 sm:items-center md:w-2/3 mx-auto">
                                <div className="h-full w-6 absolute inset-0 flex items-center justify-center">
                                    <div className="h-full w-1 bg-gray-800 pointer-events-none"></div>
                                </div>
                                <div className="flex-shrink-0 w-6 h-6 rounded-full mt-10 sm:mt-0 inline-flex items-center justify-center bg-purple-500 text-white relative z-10 title-font font-medium text-sm">2</div>
                                <div className="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
                                    <div className="flex-shrink-0 w-24 h-24 bg-gray-800 text-purple-400 rounded-full inline-flex items-center justify-center">
                                        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-12 h-12" viewBox="0 0 24 24">
                                            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                                        </svg>
                                    </div>
                                    <div className="flex-grow sm:pl-6 mt-6 sm:mt-0">
                                        <h4 className="font-medium title-font text-white mb-1 text-xl">Record Yourself Playing</h4>
                                        <p className="leading-relaxed">Pull out your MIDI Keyboard, connect it to your system, hit "Record" and start playing!</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex relative pb-10 sm:items-center md:w-2/3 mx-auto">
                                <div className="h-full w-6 absolute inset-0 flex items-center justify-center">
                                    <div className="h-full w-1 bg-gray-800 pointer-events-none"></div>
                                </div>
                                <div className="flex-shrink-0 w-6 h-6 rounded-full mt-10 sm:mt-0 inline-flex items-center justify-center bg-purple-500 text-white relative z-10 title-font font-medium text-sm">3</div>
                                <div className="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
                                    <div className="flex-shrink-0 w-24 h-24 bg-gray-800 text-purple-400 rounded-full inline-flex items-center justify-center">
                                        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-12 h-12" viewBox="0 0 24 24">
                                            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                    </div>
                                    <div className="flex-grow sm:pl-6 mt-6 sm:mt-0">
                                        <h4 className="font-medium title-font text-white mb-1 text-xl">Results!</h4>
                                        <p className="leading-relaxed">Submit your recording and be greeted with your results. It includes a comprehensive feedback on how you played throughout the track and where you can improve!</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </section>
            </section>
        )}

        <section id="our-team" className="text-gray-400 bg-gradient-to-b from-black/10 to-craft_gradient_blue/30 body-font">
            <div className="container px-5 py-24 mx-auto">
                <div className="flex flex-col text-center w-full mb-20">
                    <h1 className="text-2xl font-medium title-font mb-4 text-white tracking-widest">OUR TEAM</h1>
                    <p className="lg:w-2/3 mx-auto leading-relaxed text-base">All of us worked hard for SE</p>
                </div>
                <div className="flex flex-wrap -m-4">
                    <div className="p-4 lg:w-1/2">
                        <div className="h-full flex sm:flex-row flex-col items-center sm:justify-start justify-center text-center sm:text-left">
                            <img alt="team" className="flex-shrink-0 rounded-full w-48 h-48 object-cover object-center sm:mb-0 mb-4" src="https://media.licdn.com/dms/image/v2/D5603AQFJVrvzO3K0tA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1709459642342?e=1737590400&v=beta&t=lTPbgAwv4H0fJyP0lxTrXfElEynZvvDNLGOItukg-pQ"/>
                            <div className="flex-grow sm:pl-8">
                                <h2 className="title-font font-medium text-lg text-white">Wasil Iftekhar</h2>
                                <h4 className="text-gray-500 mb-3">IIT2023001</h4>
                                <p className="mb-4">Backend Engineer</p>
                                <span className="inline-flex">
                                    <a className="text-gray-500">
                                        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                                        </svg>
                                    </a>
                                    <a className="ml-2 text-gray-500">
                                        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                                        </svg>
                                    </a>
                                    <a className="ml-2 text-gray-500">
                                        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                                        </svg>
                                    </a>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 lg:w-1/2">
                        <div className="h-full flex sm:flex-row flex-col items-center sm:justify-start justify-center text-center sm:text-left">
                            <img alt="team" className="flex-shrink-0 rounded-full w-48 h-48 object-cover object-center sm:mb-0 mb-4" src="https://media.licdn.com/dms/image/v2/D5603AQGbZi0CfUZYlg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1731121250053?e=1737590400&v=beta&t=a1IEYUWuyp1l5QUjJwsnMUZvo0FzXyktDPiLsvMKMrA"/>
                            <div className="flex-grow sm:pl-8">
                                <h2 className="title-font font-medium text-lg text-white">Ayan Mahata</h2>
                                <h4 className="text-gray-500 mb-3">IIT2023002</h4>
                                <p className="mb-4">Frontend Engineer</p>
                                <span className="inline-flex">
                                    <a className="text-gray-500">
                                        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                                        </svg>
                                    </a>
                                    <a className="ml-2 text-gray-500">
                                        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                                        </svg>
                                    </a>
                                    <a className="ml-2 text-gray-500">
                                        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                                        </svg>
                                    </a>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 lg:w-1/2">
                        <div className="h-full flex sm:flex-row flex-col items-center sm:justify-start justify-center text-center sm:text-left">
                            <img alt="team" className="flex-shrink-0 rounded-full w-48 h-48 object-cover object-center sm:mb-0 mb-4" src="https://avatars.githubusercontent.com/u/161603557?v=4"/>
                            <div className="flex-grow sm:pl-8">
                                <h2 className="title-font font-medium text-lg text-white">Aniket Inamdar</h2>
                                <h4 className="text-gray-500 mb-3">IIT2023003</h4>
                                <p className="mb-4">Team Lead - Laid the groundwork for our project</p>
                                <span className="inline-flex">
                                    <a className="text-gray-500">
                                        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                                        </svg>
                                    </a>
                                    <a className="ml-2 text-gray-500">
                                        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                                        </svg>
                                    </a>
                                    <a className="ml-2 text-gray-500">
                                        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                                        </svg>
                                    </a>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 lg:w-1/2">
                        <div className="h-full flex sm:flex-row flex-col items-center sm:justify-start justify-center text-center sm:text-left">
                            <img alt="team" className="flex-shrink-0 rounded-full w-48 h-48 object-cover object-center sm:mb-0 mb-4" src="https://images.samsung.com/is/image/samsung/assets/latin_en/smartphones/galaxy-s23-ultra/images/galaxy-s23-ultra-highlights-kv.jpg"/>
                            <div className="flex-grow sm:pl-8">
                                <h2 className="title-font font-medium text-lg text-white">Vivek Gadhia</h2>
                                <h4 className="text-gray-500 mb-3">IIT2023004</h4>
                                <p className="mb-4">Database Expert</p>
                                <span className="inline-flex">
                                    <a className="text-gray-500">
                                        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                                        </svg>
                                    </a>
                                    <a className="ml-2 text-gray-500">
                                        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                                        </svg>
                                    </a>
                                    <a className="ml-2 text-gray-500">
                                        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                                        </svg>
                                    </a>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 lg:w-1/2">
                        <div className="h-full flex sm:flex-row flex-col items-center sm:justify-start justify-center text-center sm:text-left">
                            <img alt="team" className="flex-shrink-0 rounded-full w-48 h-48 object-cover object-center sm:mb-0 mb-4" src="https://media.licdn.com/dms/image/v2/D5603AQFg5QIssJFWvg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1695400020411?e=1737590400&v=beta&t=fi75i746orFbulHq2zASmwbzXVbX1eorkQExvWuxuGY"/>
                            <div className="flex-grow sm:pl-8">
                                <h2 className="title-font font-medium text-lg text-white">Chirag Jain</h2>
                                <h4 className="text-gray-500 mb-3">IIT2023005</h4>
                                <p className="mb-4">UI/UX Designer</p>
                                <span className="inline-flex">
                                    <a className="text-gray-500">
                                        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                                        </svg>
                                    </a>
                                    <a className="ml-2 text-gray-500">
                                        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                                        </svg>
                                    </a>
                                    <a className="ml-2 text-gray-500">
                                        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                                        </svg>
                                    </a>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 lg:w-1/2">
                        <div className="h-full flex sm:flex-row flex-col items-center sm:justify-start justify-center text-center sm:text-left">
                            <img alt="team" className="flex-shrink-0 rounded-full w-48 h-48 object-cover object-center sm:mb-0 mb-4" src="https://media.licdn.com/dms/image/v2/D5603AQH7DA1VvCCIwA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1714840418429?e=1737590400&v=beta&t=IMpnh355rTCYaO8zhgR3wYLdQr2Xiy7Lk_u-rP1ldMQ"/>
                            <div className="flex-grow sm:pl-8">
                                <h2 className="title-font font-medium text-lg text-white">Samay Jain</h2>
                                <h4 className="text-gray-500 mb-3">IIT2023069</h4>
                                <p className="mb-4">Full Stack Engineer</p>
                                <span className="inline-flex">
                                    <a className="text-gray-500">
                                        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                                        </svg>
                                    </a>
                                    <a className="ml-2 text-gray-500">
                                        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                                        </svg>
                                    </a>
                                    <a className="ml-2 text-gray-500">
                                        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                                        </svg>
                                    </a>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <Footer/>
        </>
    )
}
