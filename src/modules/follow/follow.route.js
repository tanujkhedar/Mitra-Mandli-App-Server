import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware.js";
import {  updateFollow } from "./follow.controller.js";


const router = Router();

router.route('/update').patch(auth, updateFollow);
//router.route('/remove').post(auth, removeFollow);

export const followRouter = router;