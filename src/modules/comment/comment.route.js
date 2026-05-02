import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware.js";
import { createComment, getComment, removeComment, updateComment } from "./comment.controller.js";

const router = Router();

router.route('/create').post(auth, createComment);
router.route('/get').get(auth, getComment);
router.route('/update').patch(auth, updateComment);
router.route('/delete').delete(auth, removeComment);

export const commentRouter = router;