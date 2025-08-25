import { createSlice } from "@reduxjs/toolkit";
const getInitialTheme =()=>{
    if(typeof window==="undefined") return "coffee"
    return localStorage.getItem("chat-theme") || "coffee"

}

const themeSlice= createSlice({
    name:"theme",
    initialState:{theme:getInitialTheme()},
    reducers:{
        setThemeState(state,action){
            state.theme=action.payload
        }
    }
})

export const {setThemeState}=themeSlice.actions

export const setTheme =(theme)=> (dispatch)=>{
    if(typeof window !== "undefined"){
        localStorage.setItem("chat-theme",theme)
    }
    dispatch(setThemeState(theme))
}

export const selectTheme=(state)=>state.theme.theme

export default themeSlice.reducer