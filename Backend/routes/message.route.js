import express from "express"
import { getMessages, getUnreadCount, getUser, markAsRead, sendMessage } from "../controllers/message.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"

const router= express.Router()

router.get('/user',protectRoute,getUser)
router.get('/unread', protectRoute, getUnreadCount);   // NEW
router.get('/:id',protectRoute,getMessages)
router.post('/mark-read/:id', protectRoute, markAsRead); 
router.post("/send/:id",protectRoute,sendMessage)

export default router