import React, { useEffect ,useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
const Doctors=() => {

  const {speciality}=useParams()
  
  const [filterDoc,setFilterDoc]=useState([])

  const {doctors}=useContext(AppContext)
  const Navigate=useNavigate()

  const applyFilter=()=>{
    if(speciality){
      setFilterDoc(doctors.filter(doc=>doc.speciality===speciality))
    }
    else{
      setFilterDoc(doctors)
    }
  }

  useEffect(()=>{
    applyFilter()
  },[doctors,speciality])
  return (
    <div>
      {/* <p className='text-gray-600 font-semibold'>Browse through the Doctors specialist</p> */}
      
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-8'>
        <div className='flex flex-col gap-2 text-sm '>
          <p onClick={()=>{(speciality)==='General physician'?Navigate('/doctors'):Navigate('/doctors/General physician')}} className={`border-1 rounded py-1 px-0.5 cursor-pointer  transition-all duration 300 ${speciality==="General physician"?"bg-indigo-300 text-black":""}`}>General Physician</p>
          <p onClick={()=>{(speciality)==='Gynecologist'?Navigate('/doctors'):Navigate('/doctors/Gynecologist')}} className={`border-1 rounded py-1 px-0.5 cursor-pointer hover:scale-105 transition-all duration 300 ${speciality==="Gynecologist"?"bg-indigo-300 text-black":""}`}>Gynecologist</p>
          <p onClick={()=>{(speciality)==='Dermatologist'?Navigate('/doctors'):Navigate('/doctors/Dermatologist')}} className={`border-1 rounded py-1 px-0.5 cursor-pointer hover:scale-105 transition-all duration 300 ${speciality==="Dermatologist"?"bg-indigo-300 text-black":""}`}>Dermotologist</p>
          <p onClick={()=>{(speciality)==='Pediatricians'?Navigate('/doctors'):Navigate('/doctors/Pediatricians')}} className={`border-1 rounded py-1 px-0.5 cursor-pointer hover:scale-105 transition-all duration 300 ${speciality==="Pediatricians"?"bg-indigo-300 text-black":""}`}>pediatriacians</p>
          <p onClick={()=>{(speciality)==='Neurologist'?Navigate('/doctors'):Navigate('/doctors/Neurologist')}} className={`border-1 rounded py-1 px-0.5 cursor-pointer hover:scale-105 transition-all duration 300 ${speciality==="Neurologist"?"bg-indigo-300 text-black":""}`}>Neurologist</p>
          <p onClick={()=>{(speciality)==='Gastroenterologist'?Navigate('/doctors'):Navigate('/doctors/Gastroenterologist')}} className={`border-1 rounded py-1 px-0.5 cursor-pointer hover:scale-105 transition-all duration 300 ${speciality==="Gastroenterologist"?"bg-indigo-300 text-black":""}`}>Gastroenterologist</p>
        </div>

        <div className='w-full grid grid-cols-auto gap-4 gap-y-6' style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {
            filterDoc.map((item,index)=>(
             
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
            
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Doctors
