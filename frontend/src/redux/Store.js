import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../redux/AuthSlice"
import themeReducer from "../redux/ThemeSlice"

const store= configureStore({
    reducer:{
        auth:authReducer,
        theme:themeReducer
    },
})

export default store