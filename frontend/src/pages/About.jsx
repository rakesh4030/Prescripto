import React from 'react'
import { assets } from '../assets/assets'

function About() {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-700'>
        <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
      </div>

      <div className='flex flex-col text-gray-600 md:flex-row my-10 gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
        <div className='w-full flex flex-col justify-center gap-6 md:w-2/4 text-lg text-gray-600'>
          <p>Welcome to Prescripto, your trusted partner for hassle-free doctor appointments. 
            We connect patients with qualified healthcare professionals, helping you 
            schedule consultations quickly, safely, and effortlessly.</p>
          <b className='text-gray-800'>Our Vision</b>
          <p>An efficient appointment system also improves the 
            overall quality of healthcare services. By maintaining 
            accurate records, sending reminders, and enabling better coordination between 
            doctors and patients, such systems enhance communication, reduce missed appointments, 
            and support a smoother 
            healthcare experience for everyone involved.</p>
          
          
        </div>
      </div>

      <div className='text-xl my-4'>
        <p>WHY <span className='text-gray-700 font-semibold'>CHOOSE US</span></p>
      </div>

      <div className='flex flex-col md:flex-row mb-20 gap-3'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-blue-600 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Efficiency</b>
          <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-blue-500 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Convenience</b>
          <p>Access to anetwork of trusted healthcare professionals in your area.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-blue-600 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Personalization</b>
          <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
        </div>
      </div>
    </div>
  )
}

export default About
