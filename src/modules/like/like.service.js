import { Like } from "./like.model.js";
import { Post } from "../post/post.model.js";
import { ApiError } from "../../utils/apiError.util.js";

export const createLikeService = async (data) => {
    const authUser = data.user;
    const {post_id} = data.body;

    if (!post_id) {
        throw new ApiError(400, "post id required");
    }

    const post = await Post.findById(post_id);

    if(!post) {
        throw new ApiError(400, "post id invalid");
    }

    const isLiked = await Like.create(
        {
            likedTo : post._id,
            likedBy : authUser._id
        }
    );

    if(!isLiked) {
        throw new ApiError(500, "something went wrong while updating like");
    }

    post.likeCount = post.likeCount + 1;

    await post.save();

    return post;
}

export const removeLikeService = async (data) => {
    const authUser = data.user;
    const {post_id} = data.body;

    if (!post_id) {
        throw new ApiError(400, "post id required");
    }

    const post = await Post.findById(post_id);

    if(!post) {
        throw new ApiError(400, "post id invalid");
    }

    const isdeleted = await Like.findOneAndDelete(
        {
            $and : [{likedBy : authUser._id}, {likedTo : post._id}]
        }
    );

    if(!isdeleted) {
        throw new ApiError(400, "alerady removed your like");
    }

    post.likeCount = post.likeCount - 1;

    await post.save();

    return post;
}