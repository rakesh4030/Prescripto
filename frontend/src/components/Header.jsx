import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

function Header() {
  const navigate = useNavigate()

  return (
    <div className="bg-primary rounded-lg  flex flex-col md:flex-row flex-wrap px-6 md:px-10  ">
      {/* Left part */}
      <div className='md:w-1/2 flex flex-col items-start   gap-4 m-auto py-15 px-10 md:py-[8vw] '>
        <p className='text-3xl md:text-4xl lg:text-5xl text-white font-semoid leading-tight '>Book Appointment <br /> with Trusted Doctors</p>

        <div className='flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light'>
            <img className='w-20' src={assets.group_profiles} alt="" />
            <p className='text-white'>Simply browse through our extensive list of Trusted doctors,<br />schedule your appointment hassle-free</p>
        </div>
            <button onClick={() => navigate('/bookappointment')} className='flex items-center gap-2 bg-white px-8 py-3 rounded-full  text-gray-600 text-sm m-auto md:m-0  hover:scale-105 transition-all duration-300'>
                Book Appointment <img src={assets.arrow_icon} alt="" />
            </button>

        
      </div>

      {/* right part */}

      <div className='md:w-1/2 relative'>
            <img className='w-full md:absolute bottom-0 h-auto rounded-lg' src={assets.header_img} alt="" />
      </div>
    </div>
  )
}

export default Header
