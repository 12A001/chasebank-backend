import express from 'express'
import { getMe, updateProfile, verifyTransferPin } from '../controllers/userController.js'
import { protect } from '../middleware/authMiddleware.js'
import { uploadProfileImage } from "../controllers/uploadController.js";
import { upload } from "../middleware/upload.js";


const router = express.Router()

router.get('/', protect, getMe)
router.put('/profile', protect, updateProfile)
router.post('/verify-transfer-pin', protect, verifyTransferPin)
router.put(
  "/upload-avatar",
  protect,
  upload.single("image"),
  uploadProfileImage
)


export default router