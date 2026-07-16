import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'

function Appointments() {

   const {docId}=useParams()
  const {doctors,currencySymbol,token,backendUrl}=useContext(AppContext)
  const navigate = useNavigate()
   const daysOfWeek =['SUN','MON','TUE','WED','THRU','FRI','SAT']

  const [docInfo,setDocInfo]=useState(null)
  const [docSlots,setDocSlots]=useState([])
  const [availableSlots,setAvailableSlots]=useState([])
   const [slotIndex,setSlotIndex]=useState(0)
   const [slotTime,setSlotTime]=useState('')
   const [isProcessing, setIsProcessing] = useState(false)
   const [showPaymentModal, setShowPaymentModal] = useState(false)
   const [paymentData, setPaymentData] = useState(null)

  const processPaymentFake = async (appointmentId, paymentAmount, doctorName) => {
    try {
      setPaymentData({
        appointmentId,
        amount: paymentAmount,
        doctorName,
        status: 'processing'
      })
      setShowPaymentModal(true)

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Verify payment in demo mode
      const { data: verifyData } = await axios.post(
        backendUrl + '/api/user/verify-payment-demo',
        { appointmentId },
        { headers: { token } }
      )

      if (verifyData.success) {
        setPaymentData(prev => ({ ...prev, status: 'success' }))
        await new Promise(resolve => setTimeout(resolve, 1500))
        toast.success('✓ Payment Confirmed! Appointment booked.')
        setShowPaymentModal(false)
        navigate('/myappointments')
      } else {
        setPaymentData(prev => ({ ...prev, status: 'failed' }))
        toast.error(verifyData.message || 'Payment confirmation failed')
      }
    } catch (error) {
      console.error('Payment error', error)
      setPaymentData(prev => ({ ...prev, status: 'failed' }))
      toast.error('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const bookAppointment = async () =>{
    try{
      if(!token){
        toast.warn('Login to book appointment')
        navigate('/login')
        return
      }
      if(!slotTime){
        toast.warn('Please select a time slot')
        return
      }
      if(!docId){
        toast.error('Doctor ID is missing. Please open the appointment page again.')
        console.error('Missing docId for booking')
        return
      }
      if(!docSlots[slotIndex] || !docSlots[slotIndex][0]){
        toast.error('No available slots loaded. Please refresh the page.')
        console.error('Selected docSlots row is missing', slotIndex, docSlots)
        return
      }

      const selectedDay = docSlots[slotIndex][0].datetime
      const day = selectedDay.getDate()
      const month = selectedDay.getMonth()+1
      const year = selectedDay.getFullYear()
      const slotDate = `${day}_${month}_${year}`

      if(!slotDate){
        toast.error('Booking date is invalid. Please select a slot again.')
        console.error('Computed slotDate invalid', { selectedDay, slotIndex, docSlots })
        return
      }

      setIsProcessing(true)
      console.log('Booking request', { backendUrl, token, docId, slotDate, slotTime })
      const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docId, slotDate, slotTime }, { headers: { token } })
      console.log('Booking response', data)
      
      if(data.success){
        toast.success('Processing payment...')
        // Process fake payment for 25% advance
        await processPaymentFake(
          data.appointment._id,
          data.paymentRequired.amount,
          docInfo.name
        )
      } else {
        toast.error(data.message)
        setIsProcessing(false)
      }
    }catch(error){
      console.error('Booking error', error)
      const msg = error?.response?.data?.message || error.message || 'Booking failed'
      toast.error(msg)
      setIsProcessing(false)
    }
  }
   
   const fetchDocInfo= async ()=>{
     console.log('fetchDocInfo called - docId:', docId, 'doctors length:', doctors.length)
     if (doctors.length === 0 || !docId) return;
    const docInfo=doctors.find(doc=> doc._id===docId)
    setDocInfo(docInfo)
    console.log('Found doctor:', docInfo);
    
   }

   const getAvailableSlots = async () =>{
      const newDocSlots = []

      let today=new Date()
      for(let i=0;i<7;i++){
        //getting date with index
        let currentDate=new Date(today)
        currentDate.setDate(today.getDate()+i)
        // setting end time of the date with index
        let endTime=new Date()
        endTime.setDate(today.getDate()+i)
        endTime.setHours(21,0,0,0)

        // setting hours
        if(today.getDate()===currentDate.getDate()){
          currentDate.setHours(currentDate.getHours()>10?currentDate.getHours()+1:10)
          currentDate.setMinutes(currentDate.getMinutes()>30?30:0)
        }
        else{
          currentDate.setHours(10)
          currentDate.setMinutes(0)
        }
       let timeSlots=[]
        while(currentDate<endTime){
          let formattedTime=currentDate.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})
          
          // add slot to arrray
          timeSlots.push({
            datetime:new Date(currentDate),
            time:formattedTime
          })
          // increment current time by 30 miutes
          currentDate.setMinutes(currentDate.getMinutes()+30)
        }

        newDocSlots.push(timeSlots)
      }

      setDocSlots(newDocSlots)

      // fetch booked slots from backend and compute available slots
      try{
        const { data } = await axios.get(backendUrl + '/api/user/get-booked-slots', { params: { docId } })
        const booked = (data && data.slots) || []

        const bookedSet = new Set(booked.map(b => `${b.slotDate}__${b.slotTime.toLowerCase()}`))

        const avail = newDocSlots.map(daySlots => daySlots.filter(s => {
          const d = s.datetime
          const day = d.getDate()
          const month = d.getMonth()+1
          const year = d.getFullYear()
          const slotDate = `${day}_${month}_${year}`
          const key = `${slotDate}__${s.time.toLowerCase()}`
          return !bookedSet.has(key)
        }))

        setAvailableSlots(avail)
      }catch(err){
        console.error('Failed to fetch booked slots', err)
        setAvailableSlots(newDocSlots)
      }
   }

   useEffect(()=>{ 
   fetchDocInfo()
   }
   ,[doctors,docId])

  useEffect(()=>{
    getAvailableSlots()
  },[docInfo])
  useEffect(()=>{
   console.log(docSlots)
  },[docSlots])
  if(!docInfo){
    return (
      <div className='p-8'>
        <p className='text-lg font-medium'>Doctor not found or doctors list is empty.</p>
        <p className='text-sm text-gray-600 mt-2'>Go back to the <a href='/' className='text-blue-600 underline'>doctors</a> page.</p>
      </div>
    )
  }

  return (
    <div> 
      {/* -------- Doctor details-------- */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div >
          <img className='bg-primary rounded-lg sm:max-w-72   w-full ' src={docInfo.image} alt="" />
        </div>

        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 '>
          {/* Doc info  */}
          <p className='flex item-center gap-2 text-2xl font-medium text-gray-900 '>{docInfo.name} 
            < img src={assets.verified_icon} className='sm:w-4 lg:w-4' alt="" /></p>

          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
             <p>{docInfo.degree}-{docInfo.speciality}</p>
             <button className='py-.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
          </div>

          {/* doctor About  */}
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
              About <img src={assets.info_icon} alt="" />
            </p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>
          <p className='text-gray-500 font-medium mt-4'>
            Appointment Fee: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span></p>
        </div>
      </div>
            {/* booking Slots */}

            <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
              <p>Booking Slots</p>
              <div className='flex gap-3 items-center w-full overflow-scroll '>
                 {
                  docSlots.length && docSlots.map((item,index)=>(
                      <div onClick={()=>setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex===index?'bg-primary text-white':'border border-gray-200'}`} key={index}>
                         <p>{item[0]&&daysOfWeek[item[0].datetime.getDay()]}</p>
                         <p>{item[0]&&item[0].datetime.getDate()}</p>
                      </div>
                  ))
                 }
              </div>
               

               <div className='flex items-center gap-4 w-full overflow-scroll mt-3 '>
                {
                  docSlots.length && (
                    availableSlots[slotIndex] && availableSlots[slotIndex].length>0 ? (
                      availableSlots[slotIndex].map((item,index)=>(
                        <p onClick={()=>(setSlotTime(item.time))} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time===slotTime?'bg-primary text-white':'text-gray-400 border border-gray-300 '}`} key={index}>
                           {item.time.toLowerCase()}
                        </p>
                      ))
                    ) : (
                      <p className='text-sm text-gray-500'>No available slots</p>
                    )
                  )
                }
               </div>

               <button 
                 onClick={bookAppointment} 
                 disabled={isProcessing}
                 className={`${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-blue-600'} text-white text-sm font-light py-3 px-14 rounded-full mt-4 transition-all duration-300`}
               >
                 {isProcessing ? 'Processing Payment...' : 'Book an Appointment'}
               </button>
               <p className='text-xs text-gray-600 mt-2'>
                 <span className='font-medium'>Note:</span> 25% advance payment ({currencySymbol}{Math.ceil(docInfo.fees * 0.25)}) is required to confirm your appointment
               </p>

               {/* Fake Payment Modal */}
               {showPaymentModal && (
                 <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                   <div className='bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl'>
                     <div className='text-center'>
                       {paymentData.status === 'processing' && (
                         <>
                           <div className='mb-4'>
                             <div className='inline-block'>
                               <div className='w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin'></div>
                             </div>
                           </div>
                           <h3 className='text-xl font-semibold text-gray-800 mb-2'>Processing Payment</h3>
                           <p className='text-gray-600 mb-4'>Please wait while we process your payment...</p>
                           <div className='bg-gray-100 rounded p-4'>
                             <p className='text-sm text-gray-700'>
                               <span className='font-medium'>Amount:</span> {currencySymbol}{paymentData.amount}
                             </p>
                             <p className='text-sm text-gray-700 mt-2'>
                               <span className='font-medium'>Doctor:</span> Dr. {paymentData.doctorName}
                             </p>
                           </div>
                         </>
                       )}
                       {paymentData.status === 'success' && (
                         <>
                           <div className='mb-4 text-5xl'>✓</div>
                           <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                             <svg className='w-8 h-8 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                               <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7'></path>
                             </svg>
                           </div>
                           <h3 className='text-xl font-semibold text-green-600 mb-2'>Payment Successful!</h3>
                           <p className='text-gray-600 mb-4'>Your advance payment has been confirmed.</p>
                           <div className='bg-green-50 rounded p-4'>
                             <p className='text-sm text-gray-700'>
                               <span className='font-medium'>Amount Paid:</span> {currencySymbol}{paymentData.amount}
                             </p>
                             <p className='text-sm text-gray-700 mt-2'>
                               <span className='font-medium'>Status:</span> Confirmed
                             </p>
                           </div>
                         </>
                       )}
                       {paymentData.status === 'failed' && (
                         <>
                           <div className='mb-4'>
                             <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto'>
                               <svg className='w-8 h-8 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                 <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12'></path>
                               </svg>
                             </div>
                           </div>
                           <h3 className='text-xl font-semibold text-red-600 mb-2'>Payment Failed</h3>
                           <p className='text-gray-600 mb-4'>Unable to process your payment. Please try again.</p>
                           <button
                             onClick={() => setShowPaymentModal(false)}
                             className='w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition'
                           >
                             Try Again
                           </button>
                         </>
                       )}
                     </div>
                   </div>
                 </div>
               )}
            </div>

            {/* Listing Related Doctors */}
            <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>

    </div>
  )
}

export default Appointments
