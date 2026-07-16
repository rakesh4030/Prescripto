import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

function Banner() {

  const Navigate=useNavigate();
  return (
    <div className='bg-primary  w-full flex rounded-lg  sm:px-10 md:px-5  lg:px-8'>
       
       <div className='flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5'>
            <div className='text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-white'>
                <p className='mt-7'>Book Appointment </p>
                <p>with 100+ Trusted Doctors</p>
            </div>
            <button className='bg-white text-sm sm:text-gray-600 px-7 py-3 mt-6 hover:scale-105 transition-all rounded-full md:text-md cursor-pointer' onClick={()=>{Navigate('/login');scrollTo(0,0)}}>create account</button>
       </div>
       
        <div className='hidden md:block md:w-1/2 lg:w-[370px] relative'>
            <img className=' absolute bottom-0 right-0 h-96'src={assets.appointment_img} alt="" />
        </div>


    </div>
  )
}

export default Banner
