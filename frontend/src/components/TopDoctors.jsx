import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'


function TopDoctors() {
    const Navigate=useNavigate()  
    const {doctors}=useContext(AppContext)  
  return (
    <div className='flex flex-col gap-4 items-center my-16 text-gray-900 md:mx-10'>
       <h1 className='text-3xl font-medium'>Top Doctors to Book</h1>
       <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors.</p>
       <div
  className="w-full grid gap-6 pt-5 px-3 sm:px-0"
  style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {doctors.slice(0,10).map((item,index)=>(
            <div onClick={()=>Navigate(`/appointments/${item._id}`)} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
                <img className='bg-blue-50' src={item.image} alt="" />

                <div className='p-4'>
                    <div className={`flex items-center gap-2 text-sm ${item.available === false ? 'text-red-500' : 'text-green-500'}`}>
                        <p className={`w-2 h-2 rounded-full ${item.available === false ? 'bg-red-500' : 'bg-green-500'}`}></p>
                        <p>{item.available === false ? 'Not Available' : 'Available'}</p>
                    </div>

                    <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                    <p className='text-sm text-gray-600'>{item.speciality}</p>
                </div>
            </div>
        ))}
       </div>
       <button className='bg-blue-400 text-white px-12 py-3 rounded-full mt-10 cursor-pointer' onClick={()=>{Navigate('/doctors');scrollTo(0,0)}}>View All</button>
    </div>
  )
}

export default TopDoctors
