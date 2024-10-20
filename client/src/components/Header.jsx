import Header_logo from '../vectors/header_logo.svg';
import log_out from '../vectors/logout.svg';
 
export default function Header(props){
    return (
        <header className="px-16 py-8 absolute top-0 w-full z-50 flex justify-between items-center">
            <a href="/"><img src={Header_logo}/></a>
            {props.user ? <p className='text-primary'>logout</p> : <p className='text-primary'></p>}
        </header>
    )
}
