import { assets } from '@/Assets/assets'
import Image from 'next/image'
import React, { useState, useRef } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'

const Header = () => {

  const [email,setEmail] = useState("")
  const [loading,setLoading] = useState(false)
  const subscribeFormRef = useRef(null)

  const handleGetStarted = () => {
    // Smooth scroll to subscription form
    if(subscribeFormRef.current){
      subscribeFormRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
      // Focus on email input after scrolling
      setTimeout(() => {
        const emailInput = subscribeFormRef.current.querySelector('input[type="email"]')
        if(emailInput) emailInput.focus()
      }, 500)
    }
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if(!email.trim()){
      toast.error("Please enter your email address")
      return
    }

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('email',email)
      const response = await axios.post('/api/email',formData)

      if (response.data.success || response.data.status === 'success' || response.status === 200){
        toast.success(response.data.msg || response.data.message || "Successfully subscribed!")
        setEmail("")
      } else {
        toast.error(response.data.msg || response.data.message || "Subscription failed")
      }
    } catch (error) {
      console.error("Subscription error:", error)
      toast.error(error.response?.data?.msg || "Failed to subscribe. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='py-5 px-5 md:px-12 lg:px-28'>
        <div className='flex justify-between items-center'>
            <Image src={assets.logo} width={180} alt='' className='w-[130px] sm:w-auto'/>
            <button
              onClick={handleGetStarted}
              className='flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-solid border-black shadow-[-7px_7px_0px_#000000] hover:bg-black hover:text-white transition-colors duration-300'
            >
              Get started <Image src={assets.arrow} alt=''/>
            </button>
        </div>
        <div className='text-center my-8'>
            <h1 className='text-3xl sm:text-5xl font-medium'>Latest Blogs</h1>
            <p className='mt-10 max-w-[740px] m-auto text-xs sm:text-base'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Necessitatibus porro recusandae omnis delectus animi perferendis dolores illum amet quod, nostrum voluptatem, officiis repudiandae quas rerum natus velit, numquam eaque saepe!</p>
            <form
              ref={subscribeFormRef}
              onSubmit={onSubmitHandler}
              className='flex justify-between max-w-[500px] scale-75 sm:scale-100 mx-auto mt-10 border border-black shadow-[-7px_7px_0px_#000000]'
            >
                <input
                  onChange={(e)=>setEmail(e.target.value)}
                  value={email}
                  type="email"
                  placeholder='Enter Your Email'
                  className='pl-4 outline-none flex-1'
                  required
                />
                <button
                  type='submit'
                  disabled={loading}
                  className='border-l border-black py-4 px-4 sm:px-8 active:bg-gray-600 active:text-white hover:bg-gray-800 hover:text-white transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
                >
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </button>
            </form>
        </div>
    </div>
  )
}

export default Header