
import Link from 'next/link'

export default function Nav() {
    return (
        <nav className='max-w flex justify-center fixed w-screen mt-16'>
          <div className='flex space-x-8'>
            <Link href="/" className='flex-1 hover:bg-primary hover:text-primary-content p-2 rounded-md'>Home</Link>
            <Link href="/token" className='flex-1 hover:bg-primary hover:text-primary-content p-2 rounded-md'>Token</Link>
            <Link href="/propose" className='flex-1 hover:bg-primary hover:text-primary-content p-2 rounded-md'>Propose</Link>
            <Link href="/vote" className='flex-1 hover:bg-primary hover:text-primary-content p-2 rounded-md'>Vote</Link>
            <Link href="/about" className='flex-1 hover:bg-primary hover:text-primary-content p-2 rounded-md'>About</Link>
          </div>
        </nav>    
    )
  }
  