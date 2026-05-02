import { asyncHandler } from "../../utils/asyncHandler.util.js";
import { ApiResponse } from "../../utils/apiResponse.util.js";
import * as commentService from "./comment.service.js";

export const createComment = asyncHandler( async (req, res) => {
    const data = await commentService.createCommentService(req);

    return res
    .status(200)
    .json(new ApiResponse(200, data, "comment created successfully"))
});

export const getComment = asyncHandler( async (req, res) => {
    const data = await commentService.getCommentService(req);

    return res
    .status(200)
    .json(new ApiResponse(200, data, "comment fetched successfully"))
});

export const updateComment = asyncHandler( async (req, res) => {
    const data = await commentService.updateCommentService(req);

    return res
    .status(200)
    .json(new ApiResponse(200, data, "comment updated successfully"))
});

export const removeComment = asyncHandler( async (req, res) => {
    const data = await commentService.removeCommentService(req);

    return res
    .status(200)
    .json(new ApiResponse(200, data, "comment deleted successfully"))
});