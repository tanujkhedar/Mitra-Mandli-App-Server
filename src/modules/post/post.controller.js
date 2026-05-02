import { asyncHandler } from '../../utils/asyncHandler.util.js';
import { ApiResponse } from '../../utils/apiResponse.util.js';
import * as postService from './post.service.js';

export const createPost = asyncHandler( async (req, res) => {
    const post = await postService.createPostService(req);

    return res
    .status(200)
    .json(new ApiResponse(200, post, "post uploaded successfully"))
});

export const getCurrentUserAllPost = asyncHandler( async (req, res) => {
    const allPosts = await postService.getCurrentUserAllPostService(req);

    return res
    .status(200)
    .json(new ApiResponse(200, allPosts, "post fetched successfully"))
});

export const getSearchedUserAllPostByUsername = asyncHandler( async (req, res) => {
    const allPosts = await postService.getSearchedUserAllPostByUsernameService(req);

    return res
    .status(200)
    .json(new ApiResponse(200, allPosts, "post fetched successfully"))
});

export const updatePost = asyncHandler( async (req, res) => {
    const updatedPost = await postService.updatePostService(req);

    return res
    .status(200)
    .json(new ApiResponse(200, updatedPost, "post updated successfully"))
});

export const deletePost = asyncHandler( async (req, res) => {
    await postService.deletePostService(req);

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "post deleted successfully"))
});