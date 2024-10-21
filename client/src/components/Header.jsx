import Header_logo from '../vectors/header_logo.svg';
import log_out from '../vectors/logout.svg';
import httpClient from "../HttpClient.js";
 
export default function Header(props){

    const logoutUser = async () => {
        await httpClient.post('/logout');
        window.location.href = "/";
    };


    return (
        <header className="px-16 py-8 absolute top-0 w-full z-50 flex justify-between items-center">
            <a href="/"><img src={Header_logo}/></a>
            {props.user ? <button onClick={logoutUser} className='btn-alter-default text-primary'>logout</button>
                :
                <a href="/login"><button className='btn-alter-default text-primary'>login</button></a> }
        </header>
    )
}
