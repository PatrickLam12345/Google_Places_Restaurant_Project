import { useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import axios from 'axios'

import Root from './routes/root'
import ErrorPage from './routes/ErrorPage'

import AuthForm from './components/auth/AuthForm'
import Logout from './components/auth/Logout'
import Home from './components/Home'
import Wishlist from './components/Wishlist'
import Visited from './components/Visited'
import RestaurantReviews from './components/RestaurantReviews'

import { useDispatch, useSelector } from 'react-redux'
import { setIsAuth, selectIsAuth } from './redux/isAuth'

export default function App() {
    const dispatch = useDispatch()
    const isAuth = useSelector(selectIsAuth)

    const router = createBrowserRouter([
        {
            path: '/',
            element: <Root />,
            errorElement: <ErrorPage />,
            children: [
                {
                    index: true,
                    element: <Home />
                },
                {
                    path: "/user/wishlist",
                    element: <Wishlist />
                },
                {
                    path: "/user/visited",
                    element: <Visited />
                },
                { 
                    path: "/restaurant/:restaurantId/reviews",
                    element: <RestaurantReviews />
                },
                {
                    path: "/login",
                    element: <AuthForm formType="login" />
                },
                {
                    path: "/register",
                    element: <AuthForm formType="register" />
                },
                {
                    path: "/logout",
                    element: <Logout />
                },
            ]
        }
    ])

    useEffect(() => {
        const possiblyLogin = async () => {
            const token = window.localStorage.getItem("token")
            if (token) {
                try {
                    const userResponse = await axios.get(
                        "http://localhost:3000/api/auth/me",
                        {
                            headers: {
                                authorization: token,
                            },
                        }
                    );

                    dispatch(setIsAuth(true))
                } catch (error) {
                    console.log(error)
                }
            }
        };

        possiblyLogin()
    }, [])

    return (
        <RouterProvider router={router} />
    )
}
