import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { getToken, signOut, getDashboard } from '../api/auth'

const roleToLoginPath = {
    admin: '/admin/login',
    user: '/user/login',
    validator: '/validator',
}

export default function ProtectedRoute({ role, children }) {
    const [loading, setLoading] = useState(true)
    const [authorized, setAuthorized] = useState(false)

    useEffect(() => {
        let cancelled = false
        async function verify() {
            const token = getToken()
            if (!token) {
                setAuthorized(false)
                setLoading(false)
                return
            }
            try {
                // Verify server-side that the user has the required role
                await getDashboard(role)
                if (!cancelled) setAuthorized(true)
            } catch (err) {
                // token invalid or role mismatch -> sign out and redirect
                try { await signOut() } catch { }
                if (!cancelled) setAuthorized(false)
            } finally {
                if (!cancelled) setLoading(false)
            }
        }
        verify()
        return () => { cancelled = true }
    }, [role])

    if (loading) return null // or a spinner
    if (!authorized) return <Navigate to={roleToLoginPath[role] || '/'} replace />
    return children
}
