import Link from 'next/link'
import styles from '../styles/Home.module.css'
import Head from 'next/head'

export default function About() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Rectangle DAO - Welcome</title>
            </Head>
            <main className="relative top-16 w-screen h-screen overflow-y-hidden">
                <div className="mt-8 flex flex-col space-y-6">
                    <div className="flex justify-center">
                        <div className='mb-4'>
                            <h1 className='text-3xl'>Welcome to Rectangle DAO</h1>
                        </div>
                    </div>
                    <div className="m-96">
                        <p>
                            This DAO allows users to vote with RECT tokens and change the dimensions of the rectangle available on homepage. This DAO uses RECT tokens for supporting all operations. RECT tokens are free and can be obtained from the tokens page. Each account can have a maxmium of 100,000 RECT tokens.
                        </p>
                        <br></br>
                        <p>
                            For simplicity, there are no restrictions on creating proposals. Additionally, queuing and executing successful proposals do not require RECT balances and anyone can trigger queue and execution operations. 
                            RECT tokens have a fixed supply of 1 million and 750,000 are up for crowdsale. Voting requires users to have RECT tokens and and users can vote with their RECT tokens on the proposals page. Currently, This DAO only supports self delegation on each transfer. However, this could be improved in future. 
                        </p>
                        <br></br>
                        <p>
                            All code related to this DAO is freely available under MIT license on the GitHub Repository. Pull requests are more than welcome. 
                        </p>
                    </div>
                    <div className="flex justify-center">
                        <div className="alert alert-info shadow-lg w-fit">
                            <div>
                                <a href='https://github.com/shu-boom/Rectangle-DAO'>Rectangle DAO code</a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
