import { useEffect } from 'react'
import { useNavigate } from "react-router-dom"

import { useDispatch, useSelector } from 'react-redux'
import { setIsAuth, selectIsAuth } from '../../redux/isAuth'

export default function Logout() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const isAuth = useSelector(selectIsAuth)

    useEffect(() => {
        window.localStorage.removeItem("token");
        dispatch(setIsAuth(null))
        navigate("/");
        
    }, [navigate]);

    return null
}