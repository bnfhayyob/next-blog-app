'use client'
import { blog_data } from '@/Assets/assets'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';

const page = ({}) => {

    const [data,setData] = useState(null)
    const params = useParams()
    const id = params.id

    const fetchBlogData = () =>{
        for(let i = 0; i< blog_data.length; i++){
            if(Number(id) === blog_data[i].id){
                setData(blog_data[i])
                console.log(blog_data[i])
                break
            }
        }
    }

    useEffect(()=>{
        fetchBlogData()
    },[])

  return (
    <div>
        {params.id}
    </div>
  )
}

export default page