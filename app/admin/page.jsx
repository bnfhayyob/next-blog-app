'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const page = () => {
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalSubscribers: 0,
    loading: true
  })

  const fetchStats = async () => {
    try {
      const [blogsResponse, emailsResponse] = await Promise.all([
        axios.get('/api/blog'),
        axios.get('/api/email')
      ])

      setStats({
        totalBlogs: blogsResponse.data.blogs?.length || 0,
        totalSubscribers: emailsResponse.data.emails?.length || 0,
        loading: false
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
      toast.error("Failed to load dashboard statistics")
      setStats(prev => ({...prev, loading: false}))
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if(stats.loading){
    return (
      <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16'>
        <h1 className='text-2xl font-semibold mb-8'>Dashboard Overview</h1>
        <p className='text-gray-600'>Loading statistics...</p>
      </div>
    )
  }

  return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16'>
      <h1 className='text-2xl font-semibold mb-8'>Dashboard Overview</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1000px]'>

        {/* Total Blogs Card */}
        <div className='bg-white border border-gray-300 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-500 text-sm font-medium mb-1'>Total Blogs</p>
              <h2 className='text-3xl font-bold text-gray-900'>{stats.totalBlogs}</h2>
            </div>
            <div className='bg-blue-100 p-3 rounded-full'>
              <svg className='w-8 h-8 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' />
              </svg>
            </div>
          </div>
          <p className='text-xs text-gray-500 mt-3'>Published blog posts</p>
        </div>

        {/* Total Subscribers Card */}
        <div className='bg-white border border-gray-300 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-500 text-sm font-medium mb-1'>Total Subscribers</p>
              <h2 className='text-3xl font-bold text-gray-900'>{stats.totalSubscribers}</h2>
            </div>
            <div className='bg-green-100 p-3 rounded-full'>
              <svg className='w-8 h-8 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
              </svg>
            </div>
          </div>
          <p className='text-xs text-gray-500 mt-3'>Email subscriptions</p>
        </div>

        {/* Categories Card */}
        <div className='bg-white border border-gray-300 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-500 text-sm font-medium mb-1'>Categories</p>
              <h2 className='text-3xl font-bold text-gray-900'>3</h2>
            </div>
            <div className='bg-purple-100 p-3 rounded-full'>
              <svg className='w-8 h-8 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' />
              </svg>
            </div>
          </div>
          <p className='text-xs text-gray-500 mt-3'>Technology, Startup, Lifestyle</p>
        </div>

      </div>

      {/* Quick Actions */}
      <div className='mt-10 max-w-[1000px]'>
        <h2 className='text-xl font-semibold mb-4'>Quick Actions</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <a href='/admin/addProduct' className='bg-black text-white p-4 rounded-lg hover:bg-gray-800 transition-colors'>
            <h3 className='font-semibold text-lg mb-1'>Add New Blog</h3>
            <p className='text-sm text-gray-300'>Create and publish a new blog post</p>
          </a>
          <a href='/admin/blogList' className='bg-white border border-gray-300 p-4 rounded-lg hover:bg-gray-50 transition-colors'>
            <h3 className='font-semibold text-lg mb-1'>Manage Blogs</h3>
            <p className='text-sm text-gray-600'>View and manage all blog posts</p>
          </a>
        </div>
      </div>
    </div>
  )
}

export default page
