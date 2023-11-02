import { createSlice } from "@reduxjs/toolkit"

const isAuthSlice = createSlice({
    name: "isAuth",
    initialState: {
        value: null
    },
    reducers: {
        setIsAuth: (state, action) => {
            state.value = action.payload; // Corrected this line
        }
    }
})

export const { setIsAuth } = isAuthSlice.actions;
export const selectIsAuth = (state) => state.isAuth.value; // Corrected the selector name
export default isAuthSlice.reducer;
