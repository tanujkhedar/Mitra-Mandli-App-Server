import { asyncHandler } from "../../utils/asyncHandler.util.js";
import { ApiResponse } from "../../utils/apiResponse.util.js";
import * as likeService from "./like.service.js";

export const updateLike = asyncHandler( async (req, res) => {
    const updatedPost = await likeService.updateLikeService(req);

    return res
    .status(200)
    .json(new ApiResponse(200, updatedPost, "like updated successfully"))
});

export const isLikedByUser = asyncHandler(async(req, res) => {
    const data = await likeService.isLikedByUserService(req);

    return res
    .status(200)
    .json(new ApiResponse(200, data, "like chacked successfully"));
});

// export const removeLike = asyncHandler( async (req, res) => {
//     const updatedPost = await likeService.removeLikeService(req);

//     return res
//     .status(200)
//     .json(new ApiResponse(200, updatedPost, "remove like successfully"))
// });