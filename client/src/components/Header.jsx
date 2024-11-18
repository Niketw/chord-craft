import Header_logo from '../vectors/newsmalllogo.svg';
import log_out from '../vectors/logout.svg';
import httpClient from "../HttpClient.js";
import {useEffect, useState} from "react";
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

export default function Header(){

    const logoutUser = async () => {
        try {
            await httpClient.post('/logout');
            toast.success('Successfully logged out!', {
                duration: 2000,
                position: 'top-right',
                style: {
                    background: '#dd9613',
                    color: '#fff',
                },
            });
            
            // Short delay before redirect to show the toast
            setTimeout(() => {
                window.location.href = "/";
            }, 1000);
        } catch (error) {
            console.error('Logout failed:', error);
            toast.error('Failed to logout', {
                duration: 3000,
                position: 'top-right',
                style: {
                    background: '#FF4B4B',
                    color: '#fff',
                },
            });
        }
    };

    const [user, setUser] = useState(null);

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

    const authRoutes = ['/login', '/register', '/verify'];
    const isAuthRoute = authRoutes.includes(window.location.pathname);

    return (
        <header className="px-16 py-5 absolute top-0 w-full z-50 bg-gradient-to-b from-black to-craft_grey">
            <Toaster />
            <nav className="flex justify-between items-center">
                <div className="flex items-center gap-12">
                    <a href="/"><img src={Header_logo}/></a>
                </div>
                <div className="flex gap-8">
                    {isAuthRoute ? (
                        <a href="/" className="text-gray-400 hover:text-craft_pink transition-colors">Home</a>
                    ) : (
                        <>
                            {window.location.pathname === '/library' || window.location.pathname === '/craft' || window.location.pathname === '/crafter' ? (
                                <>
                                    <a href="/" className="text-gray-400 hover:text-craft_pink transition-colors">Home</a>
                                    {user && <a href="/library" className="text-gray-400 hover:text-craft_pink transition-colors">Library</a>}
                                </>
                            ) : (
                                <>
                                    {user && <a href="/library" className="text-gray-400 hover:text-craft_pink transition-colors">Library</a>}
                                    {user ? 
                                        <a href="/#how-to" className="text-gray-400 hover:text-craft_pink transition-colors" onClick={(e) => {
                                            e.preventDefault();
                                            document.querySelector('#how-to')?.scrollIntoView({behavior: 'smooth'});
                                        }}>Guide</a>
                                        :
                                        <a href="/register" className="text-gray-400 hover:text-craft_pink transition-colors">Guide</a>
                                    }
                                    <a href="/#our-team" className="text-gray-400 hover:text-craft_pink transition-colors" onClick={(e) => {
                                        e.preventDefault();
                                        document.querySelector('#our-team')?.scrollIntoView({behavior: 'smooth'});
                                    }}>About</a>
                                </>
                            )}
                        </>
                    )}
                </div>
                {user ? 
                    <div className="relative group">
                        <div className="w-10 h-10 rounded-full bg-pink-600 group-hover:w-32 transition-all duration-300 flex items-center justify-start overflow-hidden">
                            <div className="flex items-center gap-4 px-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="white">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <button onClick={logoutUser} className="text-white hover:text-gray-100">Logout</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <a href="/login">
                        <button className='text-gray-400 hover:text-white transition-colors'>
                            Login
                        </button>
                    </a>
                }
            </nav>
        </header>
    )
}
