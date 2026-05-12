import { User } from "./user.model.js";
import { ApiError } from "../../utils/apiError.util.js";
import { generateAcessToken, generateRefreshToken } from "../../utils/token.util.js";
import { cloudinaryDestroyar, cloudinaryUploader } from "../../utils/cloudinary.util.js";

export const registerUserService = async (data) => {
    //recive data
    let {fullName, email, password, userName} = data.body;

    fullName = fullName?.trim();
    email = email?.trim();
    userName = userName?.trim();

    //conform data
    if (!(fullName && email && password && userName)) {
        throw new ApiError(400, "all field's are required");
    }

    //validate info
    const fullNameRegex = /^[A-za-z ]+$/;
    if (!fullNameRegex.test(fullName)) {
        throw new ApiError(400, "invalid fullName");
    }

    const userNameRegex = /^[a-z0-9_-]+$/
    if (!userNameRegex.test(userName)) {
        throw new ApiError(400, "invalid userName");
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(password)) {
        throw new ApiError(400, "password atleast 8 characters long and must contain at least one uppercase letter, one lowercase letter, one number and one special character");
    }

    //verify existing user
    const existEmailUser = await User.findOne({email});

    if (existEmailUser) {
        throw new ApiError (400, "this email alrady used");
    }

    const existUsernameUser = await User.findOne({userName});

    if (existUsernameUser) {
        throw new ApiError (400, "this Username alrady used");
    }

    //create user
    const user = await User.create({fullName, email, password, userName});

    if (!user) {
        throw new ApiError (500, "something went wrong while registring user");
    }

    //generate token
    const {accessToken, refreshToken} = await generateAccessOrRefreshTokenAndSaveRefreshToken (user);

    const registeredUser = await User.findById(user._id);

    if (!registeredUser) {
        throw new ApiError (500, "something went wrong while registring user");
    }

    return {registeredUser, accessToken, refreshToken}
}

export const loginUserService = async (data) => {
    //recive email or password
    let {email, password} = data.body;
    email = email.trim();

    //confrom data
    if (!(email && password)) {
        throw new ApiError(400, "all fields are required");
    }
    //find user
    const user = await User.findOne({email}).select("+password");

    if (!user) {
        throw new ApiError(400, "wrong email or password");
    }
    //compair password
    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "wrong email or password");
    }
    //generate tokens
    const {accessToken, refreshToken} = await generateAccessOrRefreshTokenAndSaveRefreshToken(user);

    const loginUser = await User.findById(user._id);

    return {loginUser, accessToken, refreshToken}
}

export const logoutUserService = async (data) => {
    const authUser = data.user;
    
    const user = await User.findById(authUser._id).select("+refreshToken +tokenVersion");
    //remove refreshToken and change tokenVersion    
    await removeTokenAndUpdateTokenversionFromDB(user);

    return;
}

export const getUserByUsernameService = async (data) => {
    const { username } = data.params;
    const authUser = data.user;

    const userName = username.trim();

    if (!userName) {
        throw new ApiError(400, "please enter userNmae");
    }

    const searchedUser = await User.findOne({ userName }).select("+blockedUsers -email");

    // kya current user bloked by searchedUser
    if (!searchedUser || searchedUser?.blockedUsers.includes(authUser._id)) {
        throw new ApiError(400, "this userName does not exist");
    }

    // remove sensitiv data like email
    // console.log("searcheduser:- ", searchedUser);
    
    return searchedUser;
}

export const getUserByIdService = async (data) => {
    const { id } = data.params;
    const authUser = data.user;

    if (!id) {
        throw new ApiError(400, "please enter userId");
    }

    const user = await User.findById(id).select("-email");

    if (!user) {
        throw new ApiError(400, "user not found");
    }

    return user;
}

export const updateUserDetailsService = async (data) => {
    const authUser = data.user;
    let {fullName, isProfilePublic} = data.body;
    fullName = fullName?.trim();

    if (!fullName && typeof isProfilePublic === "undefined") {
        throw new ApiError(400, "fullName or isProfilePublic, one is required");
    }

    const updatedUser = await User.findById(authUser._id);

    if (fullName) {
        const fullNameRegex = /^[A-za-z ]+$/;

        if (!fullNameRegex.test(fullName)) {
            throw new ApiError(400, "invalid fullName");
        }

        updatedUser.fullName = fullName;
    }

    if (isProfilePublic === false || isProfilePublic === true) {
        updatedUser.isProfilePublic = isProfilePublic;
    }

    await updatedUser.save();

    return updatedUser;
}

export const updateUserPasswordService = async (data) => {
    const authUser = data.user;
    const {oldPassword, newPassword} = data.body;

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Plese enter old or new password");
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(newPassword)) {
        throw new ApiError(400, "new password atleast 8 characters long and must contain at least one uppercase letter, one lowercase letter, one number and one special character");
    }

    const currentUser = await User.findById(authUser._id).select("+password");

    const isPasswordCorrect = await currentUser.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "wrong currentPassword");
    }

    currentUser.password = newPassword;

    await currentUser.save();

    currentUser.password = undefined;

    return currentUser;
}

export const updateUserEmailService = async (data) => {
    const authUser = data.user;
    let { email } = data.body;
    email = email.trim();

    if (!email) {
        throw new ApiError(400, "new Email required");
    }

    const isExistingEmail = await User.findOne({email});

    if (isExistingEmail) {
        throw new ApiError(400, "new email is alerady using by someOne");
    }

    const currentUser = await User.findById(authUser._id);

    currentUser.email = email;
    await currentUser.save();

    return currentUser;
}

export const updateUserUsernameService = async (data) => {
    const authUser = data.user;
    let { userName } = data.body;
    userName = userName.trim();

    if (!userName) {
        throw new ApiError(400, "userName is required");
    }

    const isUsernameExist = await User.findOne({userName});

    if (isUsernameExist) {
        throw new ApiError(400, "userName alerady exist");
    }

    const currentUser = await User.findById(authUser._id);

    currentUser.userName = userName;
    await currentUser.save();

    return currentUser;
}

export const deleteUserService = async (data) => {
    const authUser = data.user;

    await User.findByIdAndDelete(authUser._id);

    const isUserDeleted = await User.findById(authUser._id);

    if (isUserDeleted) {
        throw new ApiError(500, "something went wrong while deleting user");
    }

    return;
}

export const updateUserAvatarService = async (data) => {
    const authUser = data.user;
    const filePath = data.file?.path;

    if (!filePath) {
        throw new ApiError(400, "avtarFile is required");
    }

    const updatedUser = await User.findById(authUser._id);

    const public_id = updatedUser.avatar.public_id;

    if (public_id) {
        await cloudinaryDestroyar(public_id);
    }

    const response = await cloudinaryUploader(filePath);

    if (!response) {
        throw new ApiError(500, "something went wrong while uploading avtar");
    }

    updatedUser.avatar.url = response.secure_url;
    updatedUser.avatar.public_id = response.public_id;
    await updatedUser.save();

    return updatedUser;
}

export const updateUserCoverimageService = async (data) => {
    const authUser = data.user;
    const filePath = data.file?.path;

    if (!filePath) {
        throw new ApiError(400, "coverImageFile is required");
    }

    const updatedUser = await User.findById(authUser._id);

    const public_id = updatedUser.avatar.public_id;

    if (public_id) {
        await cloudinaryDestroyar(public_id);
    }

    const response = await cloudinaryUploader(filePath);

    if (!response) {
        throw new ApiError(500, "something went wrong while uploading coverImage");
    }

    updatedUser.coverImage.url = response.secure_url;
    updatedUser.coverImage.public_id = response.public_id;
    await updatedUser.save();

    return updatedUser;
}

export const deleteUserAvatarService = async (data) => {
    const authUser = data.user;
    const currentUser = await User.findById(authUser._id);
    const public_id = currentUser.avatar.public_id;
    
    if(!public_id) {
        throw new ApiError(400, "avtar file not exist");
    }
    await cloudinaryDestroyar(public_id);
    
    currentUser.avatar.url = null;
    currentUser.avatar.public_id = null;
    await currentUser.save();

    return currentUser;
}

export const deleteUserCoverImageService = async (data) => {
    const authUser = data.user;
    const currentUser = await User.findById(authUser._id);
    const public_id = currentUser.coverImage.public_id;

    if(!public_id) {
        throw new ApiError(400, "coverImage file not exist");
    }
    await cloudinaryDestroyar(public_id);
    
    currentUser.coverImage.url = null;
    currentUser.coverImage.public_id = null;
    await currentUser.save();

    return currentUser;
}

const generateAccessOrRefreshTokenAndSaveRefreshToken = async (user) => {
    const refreshToken = generateRefreshToken(user);
    user.tokenVersion = Math.floor((Math.random() * 1000 ) + 1);
    user.refreshToken = refreshToken;
    await user.save();
    const accessToken = generateAcessToken(user);
    return {accessToken, refreshToken}
}

const removeTokenAndUpdateTokenversionFromDB = async (user) => {
    user.refreshToken = null;
    user.tokenVersion = Math.floor((Math.random * 1000) + 1);
    await user.save();
}