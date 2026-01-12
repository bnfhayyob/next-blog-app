'use client'
import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { assets } from '@/Assets/assets'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if(!formData.email || !formData.password){
      toast.error("Please fill in all fields")
      return
    }

    try {
      setLoading(true)
      const formDataObj = new FormData()
      formDataObj.append('email', formData.email)
      formDataObj.append('password', formData.password)

      const response = await axios.post('/api/auth', formDataObj)

      if(response.data.success){
        toast.success(response.data.msg || "Login successful")
        // Store auth token (simple implementation)
        localStorage.setItem('adminAuth', response.data.token)
        router.push('/admin')
      } else {
        toast.error(response.data.msg || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error(error.response?.data?.msg || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
        <div className='flex justify-center mb-6'>
          <Image src={assets.logo} width={150} alt='Logo'/>
        </div>

        <h1 className='text-2xl font-bold text-center mb-2'>Admin Login</h1>
        <p className='text-gray-600 text-center mb-6'>Sign in to access the admin panel</p>

        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
              Email Address
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none'
              placeholder='admin@blog.com'
              required
            />
          </div>

          <div className='mb-6'>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-2'>
              Password
            </label>
            <input
              type='password'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none'
              placeholder='Enter your password'
              required
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
