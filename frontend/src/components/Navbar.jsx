import React from 'react'
import { useAuthStore } from '../store/useAuthStore.js'

import { LogOut, MessageSquare, Settings, User } from 'lucide-react'

import { Link } from 'react-router-dom'

const Navbar = () => {
  const {authUser, logout} = useAuthStore()

  return (
    <>
      <header className='bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80'>
        <div className='container mx-auto px-4 h-16'>
          <div className='flex items-center justify-between h-full'>
            {/* Logo */}
            <div className='flex items-center gap-8'>
              <Link to='/' className="flex items-center gap=2.5 hover:opacity-80 transition-all">
                <div className='size-9 rounded-lg bg-primary/10 flex items-center justify-center'>
                  <MessageSquare className='size-5 text-primary'/>
                </div>
                <h1 className='text-lg font-bold pl-2'>Let's Talk</h1>
              </Link>
            </div>

            {/* Right side */}
            <div className='flex items-center gap-2'>
              <Link to='/settings' className='btn btn-sm gap-2 transition-colors' >
                <Settings className='size-4'/>
                <span className='hidden sm:inline'>Settings</span>
              </Link>

              {authUser && (
                <Link to='/profile' className='btn btn-sm gap-2 transition-colors' >
                  <User className='size-4'/>
                  <span className='hidden sm:inline'>Profile</span>
                </Link>
              )}

              {authUser && (
                <button className='btn btn-sm gap-2 transition-colors' onClick={logout}>
                  <LogOut className='size-4'/>
                  <span className='hidden sm:inline'>Logout</span>
                </button>
              )}

            </div>


          </div>
        </div>
      </header>
    </>
  )
}

export default Navbar