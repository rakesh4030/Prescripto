import React, { useContext, useState } from 'react'
import {assets} from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

function Navbar() {
    const Navigate = useNavigate();
    const { token, setToken, setUser } = useContext(AppContext)

    const [showMenu,setShowMenu]=useState(false)

  return (
    <div className='flex item-center justify-between text-sm py-4 border-b mb-5 mt-5 border-b-grey-500'>
      <img className='w-44 cursor-pointer item-center'onClick={()=>Navigate('/')} src={assets.logo} alt=""/>
      <ul className='hidden md:flex item-start gap-5 font-medium text-lg'>
        <NavLink to='/' className={({isActive}) => isActive ? 'active' : ''}>
            <li className='py-1' >Home</li>
            <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto transition-opacity duration-300 hidden'/>
        </NavLink>

        <NavLink to='/doctors' className={({isActive}) => isActive ? 'active' : ''}>
            <li className='py-1'>Doctors</li>
            <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto transition-opacity duration-300 hidden'/>
        </NavLink>

        <NavLink to='/about' className={({isActive}) => isActive ? 'active' : ''}>
            <li className='py-1'>About</li>
            <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto transition-opacity duration-300 hidden'/>
        </NavLink>

        <NavLink to='/contact' className={({isActive}) => isActive ? 'active' : ''}>
            <li className='py-1'>Contact</li>
            <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto transition-opacity duration-300 hidden'/>
        </NavLink>
      </ul>

      <div className='flex item-center gap-4 '>

        {
        token
        ?<div className='flex items-center gap-2 cursor-pointer group relative'>
               <img className='w-8 rounded-full 'src={assets.profile_pic} alt="" />
               <img className='w-2.5 right-0' src={assets.dropdown_icon} alt="" />
               <div className='absolute top-0 right-1 ml-6 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                    <div className='min-w-48 bg-stone-100 rounded flex flex-col p-4 gap-3'>
                        <p className='hover:text-black cursor-pointer' onClick={()=>Navigate('/myprofile')}>My profile</p>
                        <p className='hover:text-black cursor-pointer' onClick={()=>Navigate('/myappointments')}>My Appointments</p>
                        <p className='hover:text-black cursor-pointer' onClick={() => { setToken(''); setUser(null); Navigate('/') }}>Logout</p>
                    </div>
               </div>
        </div>
 
        : <div>
        <button onClick={()=>Navigate('/login')} className='bg-sky-400 text-white rounded-full px-3 py-2 cursor-pointer hidden md:block'>Get Started</button>
        </div>
        }
        <img onClick={()=>setShowMenu(true)} className='w-6 md:hidden ' src={assets.menu_icon} alt="" />
          
          {/* mobile menu  */}
          <div className={`${showMenu?'fixed w-full':'h-0 w-0'} md:hidden right-0 top-0 bottom-0 overflow-hidden bg-white transition-all`}>
            <div className='flex items-center justify-between px-5 py-6'>
              <img src={assets.logo} alt="" />
              <img onClick={()=>setShowMenu(false)} src={assets.cross_icon} alt="" />
            </div>
            <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
              <NavLink  onClick={()=>setShowMenu(false)} to='/' ><p className='px-4 py-2 rounded full inline-block'>Home</p></NavLink>
              <NavLink  onClick={()=>setShowMenu(false)} to='/doctors'><p className='px-4 py-2 rounded full inline-block'>All Doctors </p></NavLink>
              <NavLink  onClick={()=>setShowMenu(false)} to='/about'><p className='px-4 py-2 rounded full inline-block'>About</p></NavLink>
              <NavLink  onClick={()=>setShowMenu(false)} to='/contact'><p className='px-4 py-2 rounded full inline-block'>Contact</p></NavLink>
            </ul>
          </div>

      </div>
    </div>
  )
}

export default Navbar
