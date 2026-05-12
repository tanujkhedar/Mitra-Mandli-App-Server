import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware.js";
import { isLikedByUser, updateLike } from "./like.controller.js";

const router = Router();

router.route('/update').patch(auth, updateLike);
router.route('/ispostliked/:post_id').get(auth, isLikedByUser);
// router.route('/remove').post(auth, removeLike);

export const likeRouter = router;