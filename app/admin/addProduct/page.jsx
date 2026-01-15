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
    const [imageUrl, setImageUrl] = useState('')
    const [imageType, setImageType] = useState('upload') // 'upload' or 'url'
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

        // Image validation based on type
        if(imageType === 'upload' && !image){
            toast.error("Please upload a blog image")
            return
        }

        if(imageType === 'url' && !imageUrl.trim()){
            toast.error("Please enter an image URL")
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

            // Send either file or URL based on selection
            if(imageType === 'upload'){
                formData.append('image',image)
            } else {
                formData.append('imageUrl', imageUrl)
            }

            const response = await axios.post('/api/blog',formData)

            if (response.data.success || response.data.status === 'success' || response.status === 200) {
                toast.success(response.data.msg || response.data.message || "Blog added successfully!")
                setImage(false)
                setImageUrl('')
                setImageType('upload')
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
            <p className='text-xl'>Blog Thumbnail</p>

            {/* Image Type Toggle */}
            <div className='flex gap-4 mt-4'>
                <button
                    type="button"
                    onClick={() => setImageType('upload')}
                    className={`px-4 py-2 rounded transition-colors ${imageType === 'upload' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                    Upload from Device
                </button>
                <button
                    type="button"
                    onClick={() => setImageType('url')}
                    className={`px-4 py-2 rounded transition-colors ${imageType === 'url' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                    Use Image URL
                </button>
            </div>

            {/* Upload Image Option */}
            {imageType === 'upload' && (
                <div className='mt-4'>
                    <label htmlFor="image" className='cursor-pointer'>
                        <Image className='border-2 border-dashed border-gray-300 rounded' src={!image?assets.upload_area:URL.createObjectURL(image)} width={140} alt='' height={70}/>
                    </label>
                    <input onChange={(e) =>setImage(e.target.files[0])} type="file" id='image' accept="image/*" hidden/>
                    <p className='text-sm text-gray-500 mt-2'>Click to upload an image from your device</p>
                </div>
            )}

            {/* Image URL Option */}
            {imageType === 'url' && (
                <div className='mt-4'>
                    <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className='w-full sm:w-[500px] px-4 py-3 border focus:border-black outline-none'
                        placeholder='Enter image URL (e.g., https://example.com/image.jpg)'
                    />
                    {imageUrl && (
                        <div className='mt-4'>
                            <p className='text-sm text-gray-500 mb-2'>Preview:</p>
                            <img
                                src={imageUrl}
                                alt="Preview"
                                className='max-w-[300px] max-h-[200px] border rounded object-cover'
                                onError={(e) => {
                                    e.target.style.display = 'none'
                                }}
                                onLoad={(e) => {
                                    e.target.style.display = 'block'
                                }}
                            />
                        </div>
                    )}
                </div>
            )}

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