
import Link from 'next/link'

export default function Nav() {
    return (
      <nav className='max-w'>
        <ul className='flex justify-center content-center space-x-5 my-16'>
          <Link href="/"><li className='flex-4 hover:bg-primary hover:text-primary-content p-2 rounded-md'>Home</li></Link>
          <Link href="/token"><li className='flex-1 hover:bg-primary hover:text-primary-content p-2 rounded-md'>Token</li></Link>
          <Link href="/propose"><li className='flex-1 hover:bg-primary hover:text-primary-content p-2 rounded-md'>Propose</li></Link>
          <Link href="/vote"><li className='flex-1 hover:bg-primary hover:text-primary-content p-2 rounded-md'>Vote</li></Link>
          <Link href="/about"><li className='flex-1 hover:bg-primary hover:text-primary-content p-2 rounded-md'>About</li></Link>
        </ul>
      </nav>
    )
  }
  