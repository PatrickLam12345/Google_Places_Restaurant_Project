import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

import { useDispatch, useSelector } from 'react-redux'
import { setIsAuth, selectIsAuth } from '../../redux/isAuth'

export default function AuthForm({ formType }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const isAuth = useSelector(selectIsAuth)

    useEffect(() => {
        if (isAuth) {
            navigate("/")
        }
    }, [isAuth])

    const onSubmit = (e) => {
        e.preventDefault() // prevents auto refresh
        if (formType === 'login') {
            login(username, password)
        } else {
            register(username, password)
        }
    }

    const login = async (username, password) => {
        try {
            const response = await axios.post(
                "http://localhost:3000/api/auth/login",
                {
                    username,
                    password,
                }
            );

            const token = response.data;
            window.localStorage.setItem("token", token);
            const userResponse = await axios.get(
                "http://localhost:3000/api/auth/me",
                {
                    headers: {
                        authorization: token,
                    },
                }
            );
            dispatch(setIsAuth(true))
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };


    const register = async (username, password) => {
        try {
            // we're trying to register a user
            // why are we using axios post?

            const response = await axios.post(
                "http://localhost:3000/api/auth/register",
                {
                    username,
                    password,
                }
            );

            const token = response.data;
            window.localStorage.setItem("token", token);
            const userResponse = await axios.get(
                "http://localhost:3000/api/auth/me",
                {
                    headers: {
                        authorization: token,
                    },
                }
            );
            setUsername("")
            setPassword("")
            navigate("/login");
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            {location.pathname === "/login" ? (
                <h1>Login</h1>
            ) : (
                <h1>Register</h1>
            )}
            <form onSubmit={onSubmit}>
                <input
                    placeholder="Username"
                    value={username}
                    onChange={(ev) => setUsername(ev.target.value)}
                />
                <input
                    placeholder="Password"
                    value={password}
                    onChange={(ev) => setPassword(ev.target.value)}
                />
                <button>{location.pathname === "/login" ? "Login" : "Register"}</button>
            </form>
            {location.pathname === "/login" ? (
                <>
                    <h3>Don't have an account?</h3>
                    <button onClick={() => {
                        setUsername("")
                        setPassword("")
                        navigate('/register')
                    }}>Register</button>
                </>
            ) : null}
        </div>
    )
}