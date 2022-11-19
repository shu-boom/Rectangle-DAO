import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useEthers} from '@usedapp/core'


export default function Home() {
  const { account } = useEthers()
  return (
        <div className={styles.container}>
          <Head>
            <title>Rectangle DAO</title>
          </Head>
          <main>
            <button className="btn btn-primary">Button</button>
            <p>{account}</p>
          </main>
        </div>
  )
}
