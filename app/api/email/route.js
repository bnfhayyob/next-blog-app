import { ConnectDB } from "@/lib/config/db"
import EmailModel from "@/lib/models/EmailModel"
import { NextResponse } from "next/server"

const loadDB = async () => {
    try {
        await ConnectDB()
    } catch (error) {
        console.error("Failed to connect to database:", error)
    }
}

loadDB()

export async function POST(request) {
    try {
        const formData = await request.formData()
        const email = formData.get('email')

        if(!email){
            return NextResponse.json({success: false, msg: "Email is required"}, {status: 400})
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if(!emailRegex.test(email)){
            return NextResponse.json({success: false, msg: "Invalid email format"}, {status: 400})
        }

        // Check if email already exists
        const existingEmail = await EmailModel.findOne({email})
        if(existingEmail){
            return NextResponse.json({success: false, msg: "Email already subscribed"}, {status: 409})
        }

        const emailData = {
            email: `${email}`,
        }

        await EmailModel.create(emailData)
        return NextResponse.json({success:true, msg:"Email Subscribed"})
    } catch (error) {
        console.error("POST Error:", error)
        return NextResponse.json({success: false, msg: "Failed to subscribe email", error: error.message}, {status: 500})
    }
}

export async function GET(request) {
    try {
        const emails = await EmailModel.find({})
        return NextResponse.json({success: true, emails})
    } catch (error) {
        console.error("GET Error:", error)
        return NextResponse.json({success: false, msg: "Failed to fetch emails", error: error.message}, {status: 500})
    }
}

export async function DELETE(request) {
    try {
        const id = await request.nextUrl.searchParams.get("id")

        if(!id){
            return NextResponse.json({success: false, msg: "Email ID is required"}, {status: 400})
        }

        const email = await EmailModel.findById(id)

        if(!email){
            return NextResponse.json({success: false, msg: "Email not found"}, {status: 404})
        }

        await EmailModel.findByIdAndDelete(id)
        return NextResponse.json({success:true, msg:"Email deleted"})
    } catch (error) {
        console.error("DELETE Error:", error)
        return NextResponse.json({success: false, msg: "Failed to delete email", error: error.message}, {status: 500})
    }
}