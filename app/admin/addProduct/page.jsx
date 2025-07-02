'use client'
import { assets } from '@/Assets/assets'
import Image from 'next/image'
import React, { useState } from 'react'

const page = () => {

    const [image, setImage] = useState(false)

  return (
    <>
        <form className='pt-5 px-5 sm:pt-15 sm:pl-16'>
            <p className='text-xl'>Upload thumbnnail</p>
            <label htmlFor="image">
                <Image className='mt-4' src={!image?assets.upload_area:URL.createObjectURL(image)} width={140} alt='' height={70}/>
            </label>
            <input onChange={(e) =>setImage(e.target.files[0])} type="file" id='image' hidden required/>
            <p className='text-xl mt-4'>Blog title</p>
            <input className='w-full sm:w-[500px] mt-4 px-4 py-3 border' type="text" placeholder='type here..' required/>
            <p className='text-xl mt-4'>Blog Description</p>
            <textarea className='w-full sm:w-[500px] mt-4 px-4 py-3 border' type="text" placeholder='write content here..' rows={6} required/>
            <p className='text-xl mt-4'>Blog category</p>
            <select name="category">
                <option value="Startup">Startup</option>
                <option value="Technology">Technology</option>
                <option value="Lifestyle">Lifestyle</option>
            </select>
        </form>  
    </>
  )
}

export default page