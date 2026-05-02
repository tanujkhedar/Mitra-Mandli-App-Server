import { asyncHandler } from "../../utils/asyncHandler.util.js";
import { ApiResponse } from "../../utils/apiResponse.util.js";
import * as followService from "./follow.service.js";

export const createFollow = asyncHandler( async (req, res) => {
    const updatedInfo = await followService.createFollowService(req);

    return res
    .status(200)
    .json(new ApiResponse(200, updatedInfo, "following successfully"))
});

export const removeFollow = asyncHandler( async (req, res) => {
    const updatedInfo = await followService.removeFollowService(req);

    return res
    .status(200)
    .json(new ApiResponse(200, updatedInfo, "unFollowing successfully"))
});