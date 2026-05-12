import { Like } from "./like.model.js";
import { Post } from "../post/post.model.js";
import { ApiError } from "../../utils/apiError.util.js";

export const updateLikeService = async (data) => {
    const authUser = data.user;
    const {post_id} = data.body;

    if (!post_id) {
        throw new ApiError(400, "post id required");
    }

    const post = await Post.findById(post_id);

    if(!post) {
        throw new ApiError(400, "post id invalid");
    }

    const isAlreadyLiked = await Like.findOne(
        {
            $and : [{likedBy : authUser._id}, {likedTo : post._id}]
        }
    );

    if(isAlreadyLiked) {
        await Like.findOneAndDelete(
            {
                $and : [{likedBy : authUser._id}, {likedTo : post._id}]
            }
        );

        post.likeCount = post.likeCount - 1;

        await post.save();

        return post;
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

export const isLikedByUserService = async (data) => {
    const {post_id} = data.params;
    const authUser = data.user;

    const isLiked = await Like.findOne({likedBy: authUser._id, likedTo : post_id});

    return isLiked ? true : false
}

// export const removeLikeService = async (data) => {
//     const authUser = data.user;
//     const {post_id} = data.body;

//     if (!post_id) {
//         throw new ApiError(400, "post id required");
//     }

//     const post = await Post.findById(post_id);

//     if(!post) {
//         throw new ApiError(400, "post id invalid");
//     }

//     const isdeleted = await Like.findOneAndDelete(
//         {
//             $and : [{likedBy : authUser._id}, {likedTo : post._id}]
//         }
//     );

//     if(!isdeleted) {
//         throw new ApiError(400, "alerady removed your like");
//     }

//     post.likeCount = post.likeCount - 1;

//     await post.save();

//     return post;
// }