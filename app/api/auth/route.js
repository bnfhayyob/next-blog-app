import { NextResponse } from "next/server"

export async function POST(request) {
    try {
        const formData = await request.formData()
        const email = formData.get('email')
        const password = formData.get('password')

        // Simple authentication (use proper auth solution in production)
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@blog.com'
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

        if(!email || !password){
            return NextResponse.json({success: false, msg: "Email and password are required"}, {status: 400})
        }

        if(email === adminEmail && password === adminPassword){
            // In production, use proper JWT tokens or session management
            return NextResponse.json({
                success: true,
                msg: "Login successful",
                token: "simple-auth-token" // Replace with real JWT in production
            })
        } else {
            return NextResponse.json({success: false, msg: "Invalid credentials"}, {status: 401})
        }
    } catch (error) {
        console.error("AUTH Error:", error)
        return NextResponse.json({success: false, msg: "Authentication failed", error: error.message}, {status: 500})
    }
}
