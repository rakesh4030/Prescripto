import { createContext, useEffect, useState } from 'react'
import { doctors } from '../assets/assets'
import axios from 'axios'

export const AppContext = createContext()

const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [user, setUser] = useState(null)
  const currencySymbol = '$'

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      const fetchUser = async () => {
        try {
          const response = await axios.get(`${backendUrl}/api/user/get-profile`, {
            headers: { token }
          })
          if (response.data?.success) {
            setUser(response.data.user)
          } else {
            setUser(null)
          }
        } catch (error) {
          console.error('Failed to load profile:', error)
          setUser(null)
        }
      }
      fetchUser()
    } else {
      localStorage.removeItem('token')
      setUser(null)
    }
  }, [backendUrl, token])

  const value = {
    doctors,
    currencySymbol,
    backendUrl,
    token,
    setToken,
    user,
    setUser
  }

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppContextProvider
