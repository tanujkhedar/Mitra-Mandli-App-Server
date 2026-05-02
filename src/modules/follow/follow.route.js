import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware.js";
import { createFollow, removeFollow } from "./follow.controller.js";


const router = Router();

router.route('/add').post(auth, createFollow);
router.route('/remove').post(auth, removeFollow);

export const followRouter = router;