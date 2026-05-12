import { asyncHandler } from "../../utils/asyncHandler.util.js";
import { ApiResponse } from "../../utils/apiResponse.util.js";
import * as followService from "./follow.service.js";

export const updateFollow = asyncHandler( async (req, res) => {
    const updatedInfo = await followService.updateFollowService(req);

    return res
    .status(200)
    .json(new ApiResponse(200, updatedInfo, "following updated successfully"))
});

export const isFollowingByCurrentUser = asyncHandler( async (req, res) => {
    const isFollow = await followService.isFollowingByCurrentUserService(req);

    return res
    .status(200)
    .json(new ApiResponse(200, isFollow, "follow check successfully"));
})
// export const removeFollow = asyncHandler( async (req, res) => {
//     const updatedInfo = await followService.removeFollowService(req);

//     return res
//     .status(200)
//     .json(new ApiResponse(200, updatedInfo, "unFollowing successfully"))
// });