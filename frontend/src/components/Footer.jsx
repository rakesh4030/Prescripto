import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

function Footer() {
   const Navigate=useNavigate()
  return (
    <div className= 'w-full bg-blue-300 rounded-2xl'>
       
       <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm px-3 py-2'>
            {/* left section */}
         <div >
            <img className='mb-5 w-40 cursor-pointer' onClick={()=>{Navigate('/'),scrollTo(0,0)}} src={assets.logo} alt="" />
            <p className='w-full md:w-2/3 text-gray-600 leading-6'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto aspernatur maiores tenetur culpa consequatur quaerat?</p>


         </div>

         {/* center section */}
         <div >
            
            <p className='text-lg font-medium mb-5 ml-0'>COMPANY</p>
            <ul className='flex flex-col gap-2 text-gray-500 ' >
                <li onClick={()=>{Navigate('/'); scrollTo(0,0)}} className='cursor-pointer'>Home</li>
                <li onClick={()=>{Navigate('/about'); scrollTo(0,0)}} className='cursor-pointer'>About Us</li>
                <li onClick={()=>{Navigate('/contact'); scrollTo(0,0)}} className='cursor-pointer'>Contact Us</li>
                <li >Privacy Policy</li>
            </ul>
         </div>

         {/* right section */}
         <div>
            
          <p className='text-lg font-medium mb-5 ml-0'>GET IN TOUCH</p>
          <ul>
            <li>+91-8**30</li>
            <li>kalerakesh4030@gmail.com</li>
          </ul>

         </div>

         

       </div>

       <div >
            <hr />
            <p className=' text-center mx-14 py-2 text-sm'>copyright 2026@ Prescripto -All Rights Reserved</p>
         </div>
         


    </div>
  )
}

export default Footer
