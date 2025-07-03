'use client'
import { assets } from '@/Assets/assets'
import axios from 'axios'
import Image from 'next/image'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const page = () => {

    const [image, setImage] = useState(false)
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

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('title',data.title)
        formData.append('description',data.description)
        formData.append('category',data.category)
        formData.append('author',data.author)
        formData.append('authorImg',data.authorImg)
        formData.append('image',image)

        const response = await axios.post('/api/blog',formData)
        // Check for common variations
        if (response.data.success || response.data.status === 'success' || response.status === 200) {
            toast.success(response.data.msg || response.data.message || "Success!")
            setImage(false)
            setData({
                title:"",
                description:"",
                category:"Startup",
                author:"Alex Bennett",
                authorImg:"/author_img.png"
            })
        } else {
            toast.error(response.data.msg || response.data.message || "Error")
        }
    }

  return (
    <>
        <form onSubmit={onSubmitHandler} className='pt-5 px-5 sm:pt-15 sm:pl-16'>
            <p className='text-xl'>Upload thumbnnail</p>
            <label htmlFor="image">
                <Image className='mt-4' src={!image?assets.upload_area:URL.createObjectURL(image)} width={140} alt='' height={70}/>
            </label>
            <input onChange={(e) =>setImage(e.target.files[0])} type="file" id='image' hidden required/>
            <p className='text-xl mt-4'>Blog title</p>
            <input name='title' onChange={onchangeHandler} value={data.title} className='w-full sm:w-[500px] mt-4 px-4 py-3 border' type="text" placeholder='type here..' required/>
            <p className='text-xl mt-4'>Blog Description</p>
            <textarea name='description' onChange={onchangeHandler} value={data.description} className='w-full sm:w-[500px] mt-4 px-4 py-3 border' type="text" placeholder='write content here..' rows={6} required/>
            <p className='text-xl mt-4'>Blog category</p>
            <select name="category" onChange={onchangeHandler} value={data.category} className='w-40 pt-4 px-4 py-3 border text-gray-500'>
                <option value="Startup">Startup</option>
                <option value="Technology">Technology</option>
                <option value="Lifestyle">Lifestyle</option>
            </select>
            <br />
            <button type='submit' className='mt-8 w-40 h-12 bg-black text-white'>ADD</button>
        </form>  
    </>
  )
}

export default page