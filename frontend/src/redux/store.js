import { configureStore } from "@reduxjs/toolkit"
import isAuthSlice from "./isAuth"

const store = configureStore({
    reducer: {
        isAuth: isAuthSlice
    }
})

export default store

window.store = store // store.getState()