import '../styles/globals.css'
import {config} from '../config.js';
import {DAppProvider} from '@usedapp/core'
import Nav from '../components/Nav';

function MyApp({ Component, pageProps }) {
 
  return (<>
      <DAppProvider config={config}>
        <Nav />
        <Component {...pageProps} />
      </DAppProvider>
    </>
  )
}

export default MyApp
