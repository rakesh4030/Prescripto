import React from 'react'
import { assets, specialityData } from '../assets/assets';
import { Link } from 'react-router-dom';
function SpecialityMenu() {
  return (
    <div className='flex flex-col items-center gap-4 text-gray-600 py-16'id='speciality'>
       <h1 className='text-3xl font-medium'>Find By Speciality</h1>
      <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors, schedule your appointment hossle-free</p>
      <div className='flex flex-row justify-center gap-5 py-3 w-full overflow-scroll'>
            {specialityData.map((item,index)=>(
                <Link className='flex flex-col items-center text-xs cursor-pointer flex- shrink-0 hover: translate-y- [-10px] transition-all duration-500 ' key={index} to={`/doctors/${item.speciality}`}>
                    <img src={item.image} alt="" />
                    <p>{item.speciality}</p>
                </Link>
            ))}
      </div>
    </div>
  )
}

export default SpecialityMenu;
