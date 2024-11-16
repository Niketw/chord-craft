import Header_logo from '../vectors/header_logo.svg';
import log_out from '../vectors/logout.svg';
import httpClient from "../HttpClient.js";
import {useEffect, useState} from "react";
 
export default function Header(){

    const logoutUser = async () => {
        await httpClient.post('/logout');
        window.location.href = "/";
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


    return (
        <header className="px-16 py-4 absolute top-0 w-full z-50 bg-black">
            <nav className="flex justify-between items-center">
                <div className="flex items-center gap-12">
                    <a href="/"><img src={Header_logo}/></a>
                </div>
                <div className="flex gap-8">
                    <a href="/library" className="text-gray-400 hover:text-orange-400 transition-colors">Library</a>
                    <a href="/trending" className="text-gray-400 hover:text-orange-400 transition-colors">Trending</a>
                    <a href="/about" className="text-gray-400 hover:text-orange-400 transition-colors">About</a>
                </div>
                {user ? 
                    <div className="relative group">
                        <div className="w-10 h-10 rounded-full bg-gray-400 group-hover:w-48 transition-all duration-300 flex items-center justify-start overflow-hidden">
                            <div className="flex items-center gap-4 px-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <a href="/profile" className="text-black hover:text-gray-700">Profile</a>
                                    <button onClick={logoutUser} className="text-black hover:text-gray-700">Logout</button>
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
