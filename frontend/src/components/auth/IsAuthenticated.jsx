import { useSelector } from 'react-redux'
import { selectIsAuth } from '../../redux/isAuth'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
export default function isAuth() {
    const navigate = useNavigate()
    const isAuth = useSelector(selectIsAuth)

    useEffect(() => {
        if (!isAuth) {
            navigate("/login")
        }
    }, [isAuth])

    return isAuth
}