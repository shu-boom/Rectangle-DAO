
import Link from 'next/link'
import Connect from './Connect'
import { useLocalStorage } from "usehooks-ts";
import {useEffect} from 'react';



export default function Nav() {
    const [theme, setTheme] = useLocalStorage("theme", "light");
    
    const toggleTheme = () => {
      setTheme(theme === "dark" ? "light" : "dark");
    };

    useEffect(() => {
      document.querySelector("body").setAttribute("data-theme", theme);
      document.querySelector("html").setAttribute("data-theme", theme);
    }, [theme]);

    return (
        <nav className='flex justify-center fixed w-screen mt-2 mb-4 z-10'>
          <div>
            <input type="checkbox" className="toggle fixed top-2 left-4" onClick={toggleTheme}/>
          </div>
          <div className='flex space-x-8'>
            <Link href="/" className='flex-1 hover:bg-primary cursor-pointer hover:text-primary-content p-2 rounded-md'>Home</Link>
            <Link href="/token" className='flex-1 hover:bg-primary  cursor-pointer hover:text-primary-content p-2 rounded-md w-fit'>Tokens</Link>
            <Link href="/propose" className='flex-1 hover:bg-primary  cursor-pointer hover:text-primary-content p-2 rounded-md'>Proposals</Link>
            <Link href="/about" className='flex-1 hover:bg-primary cursor-pointer hover:text-primary-content p-2 rounded-md'>About</Link>
          </div>
          <div>
            <Connect />
          </div>
        </nav>    
    )
  }
  