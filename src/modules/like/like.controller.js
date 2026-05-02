import { asyncHandler } from "../../utils/asyncHandler.util.js";
import { ApiResponse } from "../../utils/apiResponse.util.js";
import * as likeService from "./like.service.js";

export const createLike = asyncHandler( async (req, res) => {
    const updatedPost = await likeService.createLikeService(req);

    return res
    .status(200)
    .json(new ApiResponse(200, updatedPost, "liked successfully"))
});

export const removeLike = asyncHandler( async (req, res) => {
    const updatedPost = await likeService.removeLikeService(req);

    return res
    .status(200)
    .json(new ApiResponse(200, updatedPost, "remove like successfully"))
});