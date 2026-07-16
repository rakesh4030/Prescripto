import React from 'react'
import  {Route, Routes} from 'react-router-dom'
import Home from './pages/Home'
import Contact from './pages/Contact'
import About from './pages/About'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import MyAppointments from './pages/MyAppointments'
import Myprofile from './pages/Myprofile'
import Navbar from './components/Navbar'
import Appointments from './pages/Appointments'
import Footer from './components/Footer'
const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
         <Navbar/>
         <Routes>
             <Route path='/' element={<Home/>}/>
             <Route path='/contact' element={<Contact/>}/>
             <Route path='/about' element={<About/>}/>
             <Route path='/doctors/:speciality?' element={<Doctors/>}/>
             {/* <Route path='/appointments' element={<Appointments/>}/> */}
             <Route path='/login' element={<Login/>}/>
             <Route path='/myappointments' element={<MyAppointments/>}/>
             <Route path='/my-appointments' element={<MyAppointments/>}/>
             <Route path='/appointments/:docId' element={<Appointments/>}/>
             <Route path='/myprofile' element={<Myprofile/>}/>
         </Routes>

         <Footer/>
    </div>
  )
}

export default App
