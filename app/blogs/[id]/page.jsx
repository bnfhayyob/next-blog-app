'use client'
import { assets, blog_data } from '@/Assets/assets'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import Footer from '@/Components/Footer';
import { toast } from 'react-toastify';

const page = () => {

    const [data,setData] = useState(null)
    const [loading,setLoading] = useState(true)
    const [error,setError] = useState(null)
    const params = useParams()
    const id = params.id

    const fetchBlogData = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await axios.get('/api/blog',{params:{id:id}})
            if(response.data.success === false){
                setError(response.data.msg || "Blog not found")
                toast.error(response.data.msg || "Blog not found")
            } else {
                setData(response.data.blog)
            }
        } catch (error) {
            console.error("Error fetching blog:", error)
            const errorMsg = error.response?.data?.msg || "Failed to load blog. Please try again."
            setError(errorMsg)
            toast.error(errorMsg)
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchBlogData()
    },[])
    
  if(loading){
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-xl text-gray-600'>Loading blog...</p>
      </div>
    )
  }

  if(error){
    return (
      <div className='min-h-screen flex flex-col items-center justify-center'>
        <p className='text-xl text-red-600 mb-4'>{error}</p>
        <Link href='/' className='text-blue-600 underline'>Go back to home</Link>
      </div>
    )
  }

  return (data?<>
    <div className='bg-gray-200 py-5 px-5 md:px-12 lg:px-28'>
        <div className='flex justify-between items-center'>
            <Link href='/'>
                <Image src={assets.logo} width={180} alt='' className='w-[130px] sm:w-auto'/>
            </Link>
            <button className='flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-black shadow-[-7px_7px_0px_#000000]'>Get started <Image src={assets.arrow} alt=''/> </button>
        </div>
        <div className='text-center my-24'>
            <h1 className='text-2xl sm:text-5xl font-semibold max-w-[700px] mx-auto'>{data.title}</h1>
            <Image className='mx-auto mt-6 border border-white rounded-full' src={data.authorImg} width={60} height={60} alt=''/>
            <p className='mt-1 pb-2 text-lg max-w-[740px] mx-auto'>{data.author}</p>
        </div>
    </div>
    <div className='mx-5 max-w-[800px] md:mx-auto mt-[-100px] mb-10'>
        <Image className='border-4 border-white' src={data.image} width={1280} height={720} alt=''/>
        <div className='blog-content' dangerouslySetInnerHTML={{__html:data.description}}></div>
            <div className='my-24'>
            <p className='text-black font-semibold my-4'>Share this Article on Social Media</p>
            <div className='flex'>
                <Image src={assets.facebook_icon} width={50} alt=''/>
                <Image src={assets.twitter_icon} width={50} alt=''/>
                <Image src={assets.googleplus_icon} width={50} alt=''/>
            </div>
        </div>
    </div>
    <Footer/>
    </>:<></>
  )
}

export default page