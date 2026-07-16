import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext.jsx'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

function Myprofile() {
  const { user, token, backendUrl, setUser } = useContext(AppContext)
  const [isEdit, setIsEdit] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: '',
    dob: '',
    address: { line1: '', line2: '' }
  })

  // Initialize form data when user data loads
  useEffect(() => {
    if (user) {
      let dobValue = ''
      // Convert timestamp to YYYY-MM-DD format
      if (user.dob) {
        const date = new Date(user.dob)
        dobValue = date.toISOString().split('T')[0]
      }
      
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        gender: user.gender || '',
        dob: dobValue,
        address: user.address || { line1: '', line2: '' }
      })
    }
  }, [user])

  if (!token || !user) {
    return (
      <div className='p-8'>
        <p className='text-xl font-medium'>Please log in to view your profile.</p>
      </div>
    )
  }

  const handleInputChange = (field, value) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1]
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [addressField]: value }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      
      // Ensure all required fields are present
      const dataToSave = {
        name: formData.name || '',
        phone: formData.phone || '',
        gender: formData.gender || '',
        dob: formData.dob || '',
        address: {
          line1: formData.address?.line1 || '',
          line2: formData.address?.line2 || ''
        }
      }
      
      console.log('Saving profile data:', dataToSave)
      
      const { data } = await axios.post(
        backendUrl + '/api/user/update-profile',
        dataToSave,
        { headers: { token } }
      )

      if (data.success) {
        console.log('Profile saved successfully:', data.user)
        // Update user data in context
        setUser(data.user)
        
        // Update form data with new values
        let dobValue = ''
        if (data.user.dob) {
          const date = new Date(data.user.dob)
          dobValue = date.toISOString().split('T')[0]
        }
        
        setFormData({
          name: data.user.name || '',
          phone: data.user.phone || '',
          gender: data.user.gender || '',
          dob: dobValue,
          address: data.user.address || { line1: '', line2: '' }
        })
        
        setIsEdit(false)
        toast.success('Profile updated successfully!')
      } else {
        toast.error(data.message || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Update profile error:', error)
      const errorMsg = error.response?.data?.message || error.message || 'Failed to update profile'
      toast.error(errorMsg)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEdit(false)
    // Reset form data to original user data
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        gender: user.gender || '',
        dob: user.dob || '',
        address: user.address || { line1: '', line2: '' }
      })
    }
  }

  const profileImage = user.image || assets.profile_pic
  const address = formData.address || { line1: '', line2: '' }

  return (
    <div className='max-w-2xl'>
      {/* Profile Header */}
      <div className='flex items-start justify-between mb-6'>
        <div className='flex items-center gap-4'>
          <img className='w-24 rounded-lg' src={profileImage} alt='' />
          <div>
            {isEdit ? (
              <input
                type='text'
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className='text-3xl font-medium text-neutral-800 border-b-2 border-blue-500 outline-none py-2'
                placeholder='Enter name'
              />
            ) : (
              <p className='font-medium text-3xl text-neutral-800 mt-4'>{formData.name || 'User'}</p>
            )}
          </div>
        </div>
        <div className='flex gap-2'>
          {isEdit ? (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`px-6 py-2 rounded-lg text-white font-medium transition ${
                  isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                className='px-6 py-2 rounded-lg bg-gray-400 text-white font-medium hover:bg-gray-500 transition'
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className='px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition'
            >
              Edit
            </button>
          )}
        </div>
      </div>

      <hr className='bg-zinc-400 h-[1px] border-none mb-4' />

      {/* Contact Information */}
      <div className='mb-8'>
        <p className='text-neutral-500 underline mb-4'>CONTACT INFORMATION</p>
        {isEdit ? (
          <div className='grid grid-cols-[1fr_2fr] gap-4 text-neutral-700'>
            <label className='font-medium'>Email id:</label>
            <p className='text-blue-500'>{user.email}</p>
            
            <label className='font-medium'>Phone:</label>
            <input
              type='text'
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className='border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500'
              placeholder='Enter phone number'
            />

            <label className='font-medium'>Address Line 1:</label>
            <input
              type='text'
              value={address.line1}
              onChange={(e) => handleInputChange('address.line1', e.target.value)}
              className='border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500'
              placeholder='Street address'
            />

            <label className='font-medium'>Address Line 2:</label>
            <input
              type='text'
              value={address.line2}
              onChange={(e) => handleInputChange('address.line2', e.target.value)}
              className='border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500'
              placeholder='City, state, zip code'
            />
          </div>
        ) : (
          <div className='grid grid-cols-[1fr_4fr] gap-y-2 text-neutral-700'>
            <p className='font-medium'>Email id:</p>
            <p className='text-blue-500'>{user.email}</p>
            <p className='font-medium'>Phone:</p>
            <p className='text-blue-400'>{formData.phone || 'Not set'}</p>
            <p className='font-medium'>Address:</p>
            <p className='text-gray-500'>
              {address.line1}
              <br />
              {address.line2}
            </p>
          </div>
        )}
      </div>

      {/* Basic Information */}
      <div>
        <p className='text-neutral-500 underline mb-4'>BASIC INFORMATION</p>
        {isEdit ? (
          <div className='grid grid-cols-[1fr_2fr] gap-4 text-neutral-700'>
            <label className='font-medium'>Gender:</label>
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className='border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500'
            >
              <option value=''>Select gender</option>
              <option value='Male'>Male</option>
              <option value='Female'>Female</option>
              <option value='Other'>Other</option>
            </select>

            <label className='font-medium'>Date of Birth:</label>
            <input
              type='date'
              value={formData.dob}
              onChange={(e) => handleInputChange('dob', e.target.value)}
              className='border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500'
            />
          </div>
        ) : (
          <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 text-neutral-700'>
            <p className='font-medium'>Gender:</p>
            <p className='text-gray-500'>{formData.gender || 'Not set'}</p>
            <p className='font-medium'>Date of Birth:</p>
            <p className='text-gray-500'>{formData.dob || 'Not set'}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Myprofile
