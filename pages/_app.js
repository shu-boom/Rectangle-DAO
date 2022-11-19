import '../styles/globals.css'
import {config} from '../config.js';
import {DAppProvider} from '@usedapp/core'
import Nav from '../components/Nav';
import Connect from '../components/Connect';
import { useLocalStorage } from "usehooks-ts";
import {useEffect} from 'react';

function MyApp({ Component, pageProps }) {
  const [theme, setTheme] = useLocalStorage("theme", "dark");
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    document.querySelector("body").setAttribute("data-theme", theme);
    document.querySelector("html").setAttribute("data-theme", theme);
  }, [theme]);

  return (<>
      <DAppProvider config={config}>
        <input type="checkbox" className="toggle absolute top-2 right-2" onClick={toggleTheme}/>
        <Connect />
        <Nav />
        <Component {...pageProps} />
      </DAppProvider>
    </>
  )
}

export default MyApp
