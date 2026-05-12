import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware.js";
import {  isFollowingByCurrentUser, updateFollow } from "./follow.controller.js";


const router = Router();

router.route('/update').patch(auth, updateFollow);
router.route('/isfollow/:searcheduser_id').get(auth, isFollowingByCurrentUser)
//router.route('/remove').post(auth, removeFollow);

export const followRouter = router;