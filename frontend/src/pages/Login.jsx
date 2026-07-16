import React,{useContext,useState} from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext.jsx'

function Login() {
  const { setToken, setUser } = useContext(AppContext)

  const [state,setState]= useState('Sign Up')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [name,setName]=useState('')
  const navigate = useNavigate()

  const onSubmitHandler =async (event) => {
    event.preventDefault()
    const backend = import.meta.env.VITE_BACKEND_URL || ''
    if(!backend){
      toast.error('Backend URL not configured. Restart dev server after editing .env')
      console.error('VITE_BACKEND_URL is empty')
      return
    }
    try {
      if(state === 'Sign Up'){
        console.log('POST', `${backend}/api/user/register`, { name, email })
        const res = await axios.post(`${backend}/api/user/register`, { name, email, password })
        console.log('register response', res)
        if(res.data?.success){
          toast.success('Account created — please login')
          setState('Login')
          setPassword('')
        } else {
          const msg = res.data?.message || 'Registration failed'
          toast.error(msg)
          if(msg === 'User already exists'){
            setState('Login')
          }
        }
      } else {
        console.log('POST', `${backend}/api/user/login`, { email })
        const res = await axios.post(`${backend}/api/user/login`, { email, password })
        console.log('login response', res)
        if(res.data?.success){
          const token = res.data.token
          localStorage.setItem('token', token)
          setToken(token)
          setUser(res.data.user)
          toast.success('Logged in')
          navigate('/myprofile')
        } else {
          toast.error(res.data?.message || 'Login failed')
        }
      }
    } catch(err){
      console.error('Auth error', err, err?.response?.data)
      const msg = err?.response?.data?.message || err.message || 'Request failed'
      toast.error(msg)
      if(msg === 'User already exists'){
        setState('Login')
      }
    }
  }
  return (
    <form action="" onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
          <div className='flex flex-col gap-3 m-auto items-center p-8 min-w-[340px] sm:min-w-96 border-amber-100 rounded-xl text-zinc-600 text-sm shadow-2xl'>
            <p className='text-2xl font-semibold'>{state==='Sign Up' ? "Create Account" : "Login"}</p>
            <p>{state==='Sign Up' ? "Sing Up" : "login"} to book an appointment</p>
           {
            state==="Sign Up" && <div className='w-full  '>
              <p>Full Name</p>
              <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" onChange={(e)=>setName(e.target.value)} value={name} required />
            </div >

           }
           
            
            <div className='w-full '>
              <p>Email</p>
              <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="email" onChange={(e)=>setEmail(e.target.value)} value={email} required/>
            </div>

            <div className='w-full '>
              <p>Password</p>
              <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="password" onChange={(e)=>setPassword(e.target.value)} value={password} required/>
            </div>

            <button type="submit" className='bg-primary text-white w-full py-2 rounded-md text-base cursor-pointer'>{state==='Sign Up'?"Create Account" : "Login"}</button>
          {
            state==="Sign Up"
            ? <p>Already have an account? <span onClick={()=>setState('Login')} className='text-blue-600 underline cursor-pointer'>Login here</span></p>
            : <p>Create a new account? <span onClick={()=>setState('Sign Up')} className='text-blue-600 underline cursor-pointer' >register here</span></p>
          }
          </div>
    </form>
  )
}

export default Login
