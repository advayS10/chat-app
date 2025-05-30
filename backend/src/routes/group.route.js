import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js'
import { createGroup, getGroupForSidebar, getGroupMessages, sendGroupMessages, updateGroup, deleteGroup } from '../controllers/group.controller.js'

const router = express.Router()

router.post('/create', protectRoute, createGroup)

router.get('/groups', protectRoute, getGroupForSidebar)

router.get('/messages/:id', protectRoute, getGroupMessages)

router.put('/send/:id', protectRoute, sendGroupMessages)

router.put('/update/:id', protectRoute, updateGroup)

router.delete('/delete/:id', protectRoute, deleteGroup)

export default router 