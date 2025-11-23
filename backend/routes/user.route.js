import express from "express"
import { changePassword, getProfile, login, logout, register, updateProfile } from "../controllers/user.controller.js"
import Authtoken from "../middleware/authtoken.js"
import { uploadUserProfile } from "../middleware/fileUpload.js"

const router  = express.Router()

router.post('/register',register)
router.post('/login',login)
router.get('/logout',logout)
router.post('/change-password', Authtoken,changePassword)
router.get('/me', Authtoken,getProfile)
router.post('/update', Authtoken, uploadUserProfile.single("profilePic"),updateProfile)


export default router