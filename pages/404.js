import Link from "next/link"
import styles from '../styles/Home.module.css'
import Head from 'next/head'

export default function NotFound() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Rectangle DAO - 404</title>
            </Head>
            <div className="h-[35rem] grid justify-center content-center">
                <div className="flex space-x-2">
                    <h1>404 - Not Found!</h1>
                    <Link href='/'><h2 className="underline underline-offset-4">Please go back!</h2></Link>
                </div>
            </div>
        </div>
    )
}
