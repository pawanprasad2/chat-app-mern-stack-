import axios from "axios"

export const axiosInstance =axios.create(
    {
        baseURL:"https://chat-app-mern-stack-4kb1.onrender.com",
        withCredentials:true
    }
)