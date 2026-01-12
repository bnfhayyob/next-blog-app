import React, { useEffect, useState } from 'react'
import BlogItem from './BlogItem'
import { blog_data } from '@/Assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const BlogList = () => {

    const [menu,setMenu] = useState('All')
    const [blogs,setBlogs] = useState([])
    const [loading,setLoading] = useState(true)
    const [error,setError] = useState(null)

    const fetchBlogs = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await axios.get('/api/blog')
        if(response.data.success !== false){
          setBlogs(response.data.blogs || [])
        } else {
          setError(response.data.msg || "Failed to fetch blogs")
          toast.error(response.data.msg || "Failed to fetch blogs")
        }
      } catch (error) {
        console.error("Error fetching blogs:", error)
        const errorMsg = error.response?.data?.msg || "Failed to load blogs. Please try again."
        setError(errorMsg)
        toast.error(errorMsg)
      } finally {
        setLoading(false)
      }
    }

    useEffect(()=>{
      fetchBlogs()
    },[])

  return (
    <div>
        <div className='flex justify-center gap-6 my-10'>
            <button onClick={()=>setMenu('All')} className={menu==="All"?'bg-black text-white py-1 px-4 rounded-sm':''}>All</button>
            <button onClick={()=>setMenu('Technology')} className={menu==="Technology"?'bg-black text-white py-1 px-4 rounded-sm':''}>Technology</button>
            <button onClick={()=>setMenu('Startup')} className={menu==="Startup"?'bg-black text-white py-1 px-4 rounded-sm':''}>Startup</button>
            <button onClick={()=>setMenu('Lifestyle')} className={menu==="Lifestyle"?'bg-black text-white py-1 px-4 rounded-sm':''}>Lifestyle</button>
        </div>

        {loading ? (
          <div className='flex justify-center items-center min-h-[300px]'>
            <p className='text-xl text-gray-600'>Loading blogs...</p>
          </div>
        ) : error ? (
          <div className='flex justify-center items-center min-h-[300px]'>
            <p className='text-xl text-red-600'>{error}</p>
          </div>
        ) : (
          <div className='flex flex-wrap justify-around gap-1 gap-y-10 mb-16 xl:mx-24'>
            {blogs.filter((item)=>menu==="All"?true:item.category===menu).map((item, index)=>{
              return <BlogItem key={index} id={item._id} image={item.image} title={item.title} description={item.description} category={item.category}/>
            })}
            {blogs.filter((item)=>menu==="All"?true:item.category===menu).length === 0 && (
              <p className='text-xl text-gray-600'>No blogs found in this category.</p>
            )}
          </div>
        )}
    </div>
  )
}

export default BlogList