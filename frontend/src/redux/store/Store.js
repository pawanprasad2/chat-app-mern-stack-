import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../slice/AuthSlice"
import themeReducer from "../slice/ThemeSlice"
import chatReducer from "../slice/ChatSlice";
const store= configureStore({
    reducer:{
        auth:authReducer,
        theme:themeReducer,
        chat:chatReducer
    },
})

export default store