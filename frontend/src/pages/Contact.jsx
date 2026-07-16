import React from 'react'
import { assets } from '../assets/assets'

function Contact() {
  return (
    <div >
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>CONTACT <span className='text-gray-700 font-semibold'>US</span></p>
       </div>
       <div className='flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm pt-8'>
        <img className='w-full max-w-[400px] ' src={assets.contact_image} alt="" />

        <div className='flex flex-col justify-center gap-6 items-start'>
          <p className='font-semibold text-lg text-gray-600 '>OUR OFFICE</p>
          <p className=' text-gray-500 '>Jntu Metro Station,<br /> HYDERABAD, 500081,India</p>
          <p className=' text-gray-500 '>TEL:8***0</p>
          <p className='font-semibold text-lg text-gray-600 '>Carrers At Prescripto</p>
          <p className=' text-gray-600'>Learn more About out teams and job openings.</p>

          <button className='border border-black px-8 py-4 rounded-full bg-primary cursor-pointer text-white'>Explore Jobs</button>
        </div>
       </div>

      
    </div>
  )
}

export default Contact
