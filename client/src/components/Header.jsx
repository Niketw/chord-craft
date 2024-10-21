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
        <header className="px-16 py-8 absolute top-0 w-full z-50 flex justify-between items-center">
            <a href="/"><img src={Header_logo}/></a>
            {user ? <button onClick={logoutUser} className='btn-alter-default text-primary'>logout</button>
                :
                <a href="/login"><button className='btn-alter-default text-primary'>login</button></a> }
        </header>
    )
}
