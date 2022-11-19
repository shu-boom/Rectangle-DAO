import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useEthers} from '@usedapp/core'
import Rectangle from '../components/Rectangle'

export default function Home() {
  const { account } = useEthers()
  return (
        <div class={styles.container}>
          <Head>
            <title>Rectangle DAO</title>
          </Head>
          <main className='flex flex-row relative top-28 h-screen'>
              <div className="basis-2/3 bg-red-400">
                <Rectangle/>
              </div>
              <div className="basis-1/3  bg-yellow-400">Components</div>
          </main>
        </div>
  )
}
