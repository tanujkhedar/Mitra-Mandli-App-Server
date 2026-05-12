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

    const user = await User.findById(authUser._id);

    if (!user) {
        throw new ApiError(400, "invalid user");
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

    user.postCount += 1;
    await user.save();

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

    if (!searchedUser?.isProfilePublic) {
        return [];
    }

    const allPosts = await Post.find({owner : searchedUser._id});

    if (!allPosts) {
        throw new ApiError(500, "something went wrong while getting all Posts");
    }

    return allPosts;
}

export const getfeedPostsService = async (data) => {
    const feedPosts = await Post.aggregate([
        {
            $match : {
                isPublic : true,
                resourceType : "image"
            }
        },
        {
            $sample : {
                size : 20
            }
        },
        {
            $lookup : {
                from : "users",
                localField : "owner",
                foreignField : "_id",
                as : "ownerInfo"
            }
        },
        {
            $unwind : "$ownerInfo"
        },
        {
            $project : {
                title : 1,
                "file.url" : 1,
                resourceType : 1,
                updatedAt : 1,
                likeCount : 1,
                commentCount : 1,
                viewCount : 1,
                "ownerInfo.userName" : 1,
                "ownerInfo.avatar.url" : 1,
                "ownerInfo.fullName" : 1,
                "ownerInfo._id" : 1
            }
        }
    ]);

    if (!feedPosts) {
        throw new ApiError(500, "something went wrong while getting feed Posts");
    }

    return feedPosts;
};

export const getfeedReelsService = async (data) => {
    const feedReels = await Post.aggregate([
        {
            $match : {
                isPublic : true,
                resourceType : "video"
            }
        },
        {
            $sample : {
                size : 20
            }
        },
        {
            $lookup : {
                from : "users",
                localField : "owner",
                foreignField : "_id",
                as : "ownerInfo"
            }
        },
        {
            $unwind : "$ownerInfo"
        },
        {
            $project : {
                title : 1,
                "file.url" : 1,
                resourceType : 1,
                updatedAt : 1,
                likeCount : 1,
                commentCount : 1,
                viewCount : 1,
                "ownerInfo.userName" : 1,
                "ownerInfo.avatar.url" : 1,
                "ownerInfo.fullName" : 1,
                "ownerInfo._id" : 1
            }
        }
    ]);

    if (!feedReels) {
        throw new ApiError(500, "something went wrong while getting feed Reels");
    }

    return feedReels;
};

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
    const authUser = data.user;
    const {post_id} = data.body;

    if (!post_id) {
        throw new ApiError(400, "post Id required");
    }

    const user = await User.findById(authUser._id);

    const post = await Post.findById(post_id);

    if (!post) {
        throw new ApiError(400, "wrong post id");
    }

    await cloudinaryDestroyar(post.file.public_id);

    await Post.findByIdAndDelete(post_id);

    user.postCount -= 1;
    await user.save();

    return;
}