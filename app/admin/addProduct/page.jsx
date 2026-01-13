'use client'
import { assets } from '@/Assets/assets'
import axios from 'axios'
import Image from 'next/image'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import dynamic from 'next/dynamic'

const Editor = dynamic(() => import('@/Components/Editor'), { ssr: false })

const page = () => {

    const [image, setImage] = useState(false)
    const [loading, setLoading] = useState(false)
    const [data,setData] = useState({
        title:"",
        description:"",
        category:"Startup",
        author:"Alex Bennett",
        authorImg:"/author_img.png"
    })

    const onchangeHandler = (event) =>{
        const name = event.target.name
        const value = event.target.value
        setData(data=>({...data,[name]:value}))
        console.log(data)
    }

    const onEditorChange = (content) => {
        setData(data=>({...data, description: content}))
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()

        // Form validation
        if(!data.title.trim()){
            toast.error("Blog title is required")
            return
        }

        if(data.title.length < 5){
            toast.error("Blog title must be at least 5 characters")
            return
        }

        if(!data.description.trim()){
            toast.error("Blog description is required")
            return
        }

        if(data.description.length < 50){
            toast.error("Blog description must be at least 50 characters")
            return
        }

        if(!data.author.trim()){
            toast.error("Author name is required")
            return
        }

        if(!image){
            toast.error("Please upload a blog image")
            return
        }

        try {
            setLoading(true)
            const formData = new FormData()
            formData.append('title',data.title)
            formData.append('description',data.description)
            formData.append('category',data.category)
            formData.append('author',data.author)
            formData.append('authorImg',data.authorImg)
            formData.append('image',image)

            const response = await axios.post('/api/blog',formData)

            if (response.data.success || response.data.status === 'success' || response.status === 200) {
                toast.success(response.data.msg || response.data.message || "Blog added successfully!")
                setImage(false)
                setData({
                    title:"",
                    description:"",
                    category:"Startup",
                    author:"Alex Bennett",
                    authorImg:"/author_img.png"
                })
            } else {
                toast.error(response.data.msg || response.data.message || "Failed to add blog")
            }
        } catch (error) {
            console.error("Error adding blog:", error)
            toast.error(error.response?.data?.msg || "Failed to add blog. Please try again.")
        } finally {
            setLoading(false)
        }
    }

  return (
    <>
        <form onSubmit={onSubmitHandler} className='pt-5 px-5 sm:pt-15 sm:pl-16'>
            <p className='text-xl'>Upload thumbnail</p>
            <label htmlFor="image" className='cursor-pointer'>
                <Image className='mt-4 border-2 border-dashed border-gray-300 rounded' src={!image?assets.upload_area:URL.createObjectURL(image)} width={140} alt='' height={70}/>
            </label>
            <input onChange={(e) =>setImage(e.target.files[0])} type="file" id='image' accept="image/*" hidden required/>

            <p className='text-xl mt-4'>Blog title <span className='text-red-500'>*</span></p>
            <input name='title' onChange={onchangeHandler} value={data.title} className='w-full sm:w-[500px] mt-4 px-4 py-3 border focus:border-black outline-none' type="text" placeholder='Enter blog title (min 5 characters)..' required minLength={5}/>

            <p className='text-xl mt-4'>Blog Description <span className='text-red-500'>*</span></p>
            <div className='mt-4 w-full'>
                <Editor
                    value={data.description}
                    onChange={onEditorChange}
                    placeholder='Write your blog content here (min 50 characters)...'
                />
            </div>

            <p className='text-xl mt-4'>Author Name <span className='text-red-500'>*</span></p>
            <input name='author' onChange={onchangeHandler} value={data.author} className='w-full sm:w-[500px] mt-4 px-4 py-3 border focus:border-black outline-none' type="text" placeholder='Enter author name..' required/>

            <p className='text-xl mt-4'>Blog category</p>
            <select name="category" onChange={onchangeHandler} value={data.category} className='w-40 pt-4 px-4 py-3 border text-gray-500 focus:border-black outline-none'>
                <option value="Startup">Startup</option>
                <option value="Technology">Technology</option>
                <option value="Lifestyle">Lifestyle</option>
            </select>
            <br />
            <button type='submit' disabled={loading} className='mt-8 w-40 h-12 bg-black text-white hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'>
                {loading ? 'Adding...' : 'ADD'}
            </button>
        </form>
    </>
  )
}

export default page