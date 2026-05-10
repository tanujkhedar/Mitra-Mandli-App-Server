import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";
import { createPost, deletePost, getCurrentUserAllPost, getSearchedUserAllPostByUsername, updatePost, getFeedPosts, getFeedReels } from "./post.controller.js";

const router = Router();

router.route('/upload').post(auth, upload.single('file'), createPost);
router.route('/getall').get(auth, getCurrentUserAllPost);
router.route('/getall/:username').get(auth, getSearchedUserAllPostByUsername);
router.route('/feedposts').get(auth, getFeedPosts);
router.route('/feedreels').get(auth, getFeedReels);
router.route('/update').patch(auth, upload.none(), updatePost);
router.route('/delete').delete(auth, deletePost);

export const postRouter = router;