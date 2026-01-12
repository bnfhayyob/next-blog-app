'use client'

export const checkAuth = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('adminAuth')
    return !!token
  }
  return false
}

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminAuth')
    window.location.href = '/admin/login'
  }
}
