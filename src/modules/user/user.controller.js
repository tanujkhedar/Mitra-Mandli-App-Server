import { asyncHandler } from "../../utils/asyncHandler.util.js";
import { ApiResponse } from "../../utils/apiResponse.util.js";
import  * as userService  from "./user.service.js";

const cookieOption = {
    httpOnly : true,
    secure : false, //localhost use ke liye temp solution
    sameSite : "lax"
}

export const registerUser = asyncHandler ( async (req, res) => {
    
    const {registeredUser, accessToken, refreshToken} = await userService.registerUserService(req);

    //send data
    return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOption)
    .cookie("refreshToken", refreshToken, cookieOption)
    .json(new ApiResponse(200, registeredUser, "user registered successfully"))
});

export const loginUser = asyncHandler ( async (req, res) => {
    
    const {loginUser, accessToken, refreshToken} = await userService.loginUserService(req);
    //send response
    return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOption)
    .cookie("refreshToken", refreshToken, cookieOption)
    .json(new ApiResponse(200, loginUser, "user logged in successfully"))
});

export const logoutUser = asyncHandler ( async (req, res) => {
    
    await userService.logoutUserService(req);

    //clearCookie
    return res
    .status(200)
    .clearCookie("accessToken", cookieOption)
    .clearCookie("refreshToken", cookieOption)
    .json(new ApiResponse(200, {}, "user logout successfully"))
});

export const getCurrentUser = asyncHandler ( async (req, res) => {
    
    const user = req.user;

    return res
    .status(200)
    .json(new ApiResponse(200, user, "user fatch successfully"))
});

export const getUserByUsername = asyncHandler ( async (req, res) => {
    const searchedUser = await userService.getUserByUsernameService(req);

    return res
    .status(200)
    .json(new ApiResponse(200, searchedUser, "user fatch successfully"))
});

export const updateUserDetails = asyncHandler ( async (req, res) => {
    const updatedUser = await userService.updateUserDetailsService(req);

    return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "user updated successfully"))
});

export const updateUserPassword = asyncHandler ( async (req, res) => {
    const updatedUser = await userService.updateUserPasswordService(req);

    return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "password updated successfully"))
});

export const updateUserEmail = asyncHandler ( async (req, res) => {
    const updatedUser = await userService.updateUserEmailService(req);

    return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "email updated successfully"))
});

export const updateUserUsername = asyncHandler ( async (req, res) => {
    const updatedUser = await userService.updateUserUsernameService(req);

    return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "userName updated successfully"))
});

export const updateUserAvatar = asyncHandler ( async (req, res) => {
    const updatedUser = await userService.updateUserAvatarService(req);

    return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "avatar udpated successfully"))
});

export const updateUserCoverImage = asyncHandler ( async (req, res) => {
    const updatedUser = await userService.updateUserCoverimageService(req);

    return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "coverImage udpated successfully"))
});

export const deleteUser = asyncHandler ( async (req, res) => {
    await userService.deleteUserService(req);

    return res
    .status(200)
    .clearCookie("accessToken", cookieOption)
    .clearCookie("refreshToken", cookieOption)
    .json(new ApiResponse(200, {}, "user deleted successfully"))
});

export const deleteUserAvatar = asyncHandler ( async (req, res) => {
    const updatedUser = await userService.deleteUserAvatarService(req);

    return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "avtar deleted successfully"))
});

export const deleteUserCoverImage = asyncHandler ( async (req, res) => {
    const updatedUser = await userService.deleteUserCoverImageService(req);

    return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "coverImage deleted successfully"))
});