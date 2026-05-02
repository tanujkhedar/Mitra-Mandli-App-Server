import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware.js";
import { createLike, removeLike } from "./like.controller.js";

const router = Router();

router.route('/add').post(auth, createLike);
router.route('/remove').post(auth, removeLike);

export const likeRouter = router;