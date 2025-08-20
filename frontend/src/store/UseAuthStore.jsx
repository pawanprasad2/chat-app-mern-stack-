import {axiosInstance} from "../lib/axios"
import {create} from "zustand"
export const UseAuthStore = create((set)=>({
authUser:null,
isSigningup:false,
isLogging:false,
isupdateingProfile:false,

isCheckingAuth:true,

checkAuth:async()=>{
    try {
        const res = await axiosInstance.get("/auth/check")
        set({authUser:res.data})

    } catch (error) {
        console.log("error in checkAuth",error)
        set({authUser:null})

    }finally{
        set({isCheckingAuth:false})

    }
}

}))