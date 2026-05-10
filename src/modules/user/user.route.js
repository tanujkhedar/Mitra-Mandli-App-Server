import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";
import { deleteUser, deleteUserAvatar, deleteUserCoverImage, getCurrentUser, getUserById, getUserByUsername, loginUser, logoutUser, registerUser, updateUserAvatar, updateUserCoverImage, updateUserDetails, updateUserEmail, updateUserPassword, updateUserUsername } from "./user.controller.js";
import multer from "multer";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(auth, logoutUser);
router.route("/get").get(auth, getCurrentUser);
router.route("/get/username/:username").get(auth, getUserByUsername);
router.route("/get/id/:id").get(auth, getUserById);
router.route("/updatedetails").put(auth, updateUserDetails);
router.route("/updatepassword").patch(auth, updateUserPassword);
router.route("/updateemail").patch(auth, updateUserEmail);
router.route("/updateusername").patch(auth, updateUserUsername);
router.route("/updateavatar").patch(auth, upload.single('avatar'), updateUserAvatar);
router.route("/updatecoverimage").patch(auth, upload.single('coverImage'), updateUserCoverImage);
router.route("/delete").delete(auth, deleteUser);
router.route("/deleteavatar").delete(auth, deleteUserAvatar);
router.route("/deletecoverimage").delete(auth, deleteUserCoverImage);

export const userRouter = router;