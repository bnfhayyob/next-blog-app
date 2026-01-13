'use client'
import { assets } from "@/Assets/assets";
import Sidebar from "@/Components/AdminComponents/Sidebar";
import Image from "next/image";
import { ToastContainer } from 'react-toastify';
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { checkAuth, logout } from "@/lib/auth/checkAuth";

export default function Layout({children}){
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isLoginPage, setIsLoginPage] = useState(false)

    useEffect(() => {
        // Check if we're on the login page
        const loginPage = window.location.pathname === '/admin/login'
        setIsLoginPage(loginPage)

        if(!checkAuth() && !loginPage){
            window.location.href = '/admin/login'
        } else {
            setIsLoading(false)
        }
    }, [])

    if(isLoginPage){
        return children
    }

    return(
        <>
            <div className="flex ">
                <ToastContainer theme="dark"/>
                <Sidebar/>
                <div className="flex flex-col w-full">
                    <div className="flex items-center justify-between w-full py-3 max-h-[60px] px-12 border-b border-black">
                        <h3 className="font-medium">Admin Panel</h3>
                        <div className="flex items-center gap-4">
                            <Image src={assets.profile_icon} alt="" width={40}/>
                            <button
                                onClick={logout}
                                className="text-sm bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                    {children}
                </div>
            </div>

        </>
    )
}
