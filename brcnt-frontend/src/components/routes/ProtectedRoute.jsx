import React from 'react'
import { Navigate } from 'react-router-dom'
import { getAuthData } from '../../utils/utils'

function ProtectedRoute({ children }) {
    const auth = getAuthData();
    if (!auth?.accessToken) {
        return (
            <Navigate to={"/"}></Navigate>
        )
    }
    return children;

}

export default ProtectedRoute