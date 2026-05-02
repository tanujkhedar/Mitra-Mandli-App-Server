import { Post } from "./post.model.js";
import { User } from "../user/user.model.js";
import { ApiError } from "../../utils/apiError.util.js";
import { cloudinaryDestroyar, cloudinaryUploader } from "../../utils/cloudinary.util.js";

export const createPostService = async (data) => {
    let {title, description, isPublic} = data.body;
    const authUser = data.user;
    const filePath = data.file?.path;
    
    if (!(title && filePath)) {
        throw new ApiError(400, "title and file both are required");
    }

    if (isPublic === undefined) {
        isPublic = true;
    }

    const response = await cloudinaryUploader(filePath);

    const post = await Post.create(
        {
            title,
            description : description || '',
            isPublic : isPublic,
            "file.url" : response.secure_url,
            "file.public_id" : response.public_id,
            resourceType : response.resource_type,
            owner : authUser._id
        }
    );

    if (!post) {
        throw new ApiError(500, "something went wrong while uploading post");
    }

    return post;
}

export const getCurrentUserAllPostService = async (data) => {
    const  authUser  = data.user;

    const allPosts = await Post.find({owner : authUser._id});

    if (!allPosts) {
        throw new ApiError(500, "something went wrong while getting all Posts");
    }

    return allPosts;
}

export const getSearchedUserAllPostByUsernameService = async (data) => {
    const { username } = data.params;
    const userName = username.trim();

    const searchedUser = await User.findOne({userName});

    if (!searchedUser.isProfilePublic) {
        return {};
    }

    const allPosts = await Post.find({owner : searchedUser._id});

    if (!allPosts) {
        throw new ApiError(500, "something went wrong while getting all Posts");
    }

    return allPosts;
}

export const updatePostService = async (data) => {
    const {post_id, title, description, isPublic} = data.body;

    if (!post_id || !(title || description || (isPublic !== undefined))) {
        throw new ApiError(400, "post_id and one of upedating field are required");
    }

    const post = await Post.findById(post_id);
    
    if (!post) {
        throw new ApiError(400, "post id invalid");
    }

    if (title) post.title = title;
    if (description) post.description = description;
    if (isPublic !== undefined) post.isPublic = isPublic;

    await post.save();

    return post;
}

export const deletePostService = async (data) => {
    const {post_id} = data.body;

    if (!post_id) {
        throw new ApiError(400, "post Id required");
    }

    const post = await Post.findById(post_id);

    if (!post) {
        throw new ApiError(400, "wrong post id");
    }

    await cloudinaryDestroyar(post.file.public_id);

    await Post.findByIdAndDelete(post_id);

    return;
}