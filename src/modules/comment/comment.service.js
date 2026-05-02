import { Comment } from "./comment.model.js";
import { Post } from "../post/post.model.js";
import { ApiError } from "../../utils/apiError.util.js";

export const createCommentService = async (data) => {
    const authUser = data.user;
    const { content, commentTo } = data.body;

    if (!content || !commentTo) {
        throw new ApiError(400, "content or post id is required");
    }

    const post = await Post.findById(commentTo);

    if (!post) {
        throw new ApiError(400, "post id invalid");
    }

    const comment = await Comment.create(
        {
            commentBy : authUser._id,
            commentTo : post._id,
            content : content
        }
    );

    if (!comment) {
        throw new ApiError(500, "something went wrong while commenting");
    }

    post.commentCount = post.commentCount + 1;

    await post.save();

    return comment;
}

export const getCommentService = async (data) => {
    const authUser = data.user;
    const { post_id } = data.body;

    if (!post_id) {
        throw new ApiError(400, "post id is required");
    }

    const comments = await Comment.find({commentTo : post_id});

    if (!comments) {
        throw new ApiError(400, "invalid post id");
    }

    return comments;
}

export const updateCommentService = async (data) => {
    const authUser = data.user;
    const { content, comment_id } = data.body;

    if (!content || !comment_id) {
        throw new ApiError(400, "content or comment id is required");
    }

    const comment = await Comment.findById(comment_id);

    if (!comment) {
        throw new ApiError(400, "comment id invalid");
    }

    comment.content = content;
    await comment.save();

    return comment;
}

export const removeCommentService = async (data) => {
    const authUser = data.user;
    const { comment_id } = data.body;

    if (!comment_id) {
        throw new ApiError(400, "post id is required");
    }

    const comment = await Comment.findByIdAndDelete(comment_id);

    if (!comment) {
        throw new ApiError(500, "something went wrong while deleting comment");
    }

    return {};
}