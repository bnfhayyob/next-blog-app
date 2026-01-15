import { ConnectDB } from "@/lib/config/db"
import BlogModel from "@/lib/models/BlogModel"
import {writeFile} from 'fs/promises'
const fs = require('fs')

const { NextResponse } = require("next/server")

const LoadDB = async () => {
    try {
        await ConnectDB()
    } catch (error) {
        console.error("Failed to connect to database:", error)
    }
}

LoadDB()

export async function GET(request) {
    try {
        const blogId = request.nextUrl.searchParams.get("id")

        if(blogId){
            const blog = await BlogModel.findById(blogId)
            if(!blog){
                return NextResponse.json({success: false, msg: "Blog not found"}, {status: 404})
            }
            return NextResponse.json({success: true, blog})
        }else{
            const blogs = await BlogModel.find({})
            return NextResponse.json({success: true, blogs})
        }
    } catch (error) {
        console.error("GET Error:", error)
        return NextResponse.json({success: false, msg: "Failed to fetch blogs", error: error.message}, {status: 500})
    }
}

export async function POST(request) {
    try {
        const formData = await request.formData()
        const timestamp = Date.now()

        const image = formData.get('image')
        const imageUrl = formData.get('imageUrl')

        let imgUrl = ''

        // Check if using URL or file upload
        if(imageUrl && imageUrl.trim() !== ''){
            // Using external image URL
            imgUrl = imageUrl.trim()
        } else if(image && image.size > 0){
            // Using file upload
            // Validate image type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
            if(!validTypes.includes(image.type)){
                return NextResponse.json({success: false, msg: "Invalid image type. Only JPEG, PNG, and WebP are allowed"}, {status: 400})
            }

            // Validate image size (max 5MB)
            if(image.size > 5 * 1024 * 1024){
                return NextResponse.json({success: false, msg: "Image size must be less than 5MB"}, {status: 400})
            }

            const imageByteData = await image.arrayBuffer()
            const buffer = Buffer.from(imageByteData)
            const path = `./public/${timestamp}_${image.name}`
            await writeFile(path,buffer)
            imgUrl = `/${timestamp}_${image.name}`
        } else {
            return NextResponse.json({success: false, msg: "Image is required (either upload or URL)"}, {status: 400})
        }

        const blogData = {
            title: `${formData.get('title')}`,
            description: `${formData.get('description')}`,
            category: `${formData.get('category')}`,
            author: `${formData.get('author')}`,
            image: imgUrl,
            authorImg: `${formData.get('authorImg')}`
        }

        await BlogModel.create(blogData)
        console.log("Blog saved")

        return NextResponse.json({success:true, msg:"Blog Added"})
    } catch (error) {
        console.error("POST Error:", error)
        return NextResponse.json({success: false, msg: "Failed to create blog", error: error.message}, {status: 500})
    }
}

export async function DELETE(request) {
    try {
        const id = await request.nextUrl.searchParams.get('id')

        if(!id){
            return NextResponse.json({success: false, msg: "Blog ID is required"}, {status: 400})
        }

        const blog = await BlogModel.findById(id)

        if(!blog){
            return NextResponse.json({success: false, msg: "Blog not found"}, {status: 404})
        }

        // Delete image file only if it's a local file (not external URL)
        if(blog.image && !blog.image.startsWith('http')){
            fs.unlink(`./public${blog.image}`, (err) => {
                if(err) console.error("Error deleting image:", err)
            })
        }

        await BlogModel.findByIdAndDelete(id)

        return NextResponse.json({success: true, msg:"Blog Deleted"})
    } catch (error) {
        console.error("DELETE Error:", error)
        return NextResponse.json({success: false, msg: "Failed to delete blog", error: error.message}, {status: 500})
    }
}