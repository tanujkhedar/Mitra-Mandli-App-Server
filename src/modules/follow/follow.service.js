import { Follow } from "./follow.model.js";
import { User } from "../user/user.model.js";
import { ApiError } from "../../utils/apiError.util.js";

export const updateFollowService = async (data) => {
    const authUser = data.user;
    const { followedTo } = data.body;

    if (!followedTo) {
        throw new ApiError(400, "follwed user Id required");
    }

    const isAleradyFollow = await Follow.findOne(
        {
            followedTo, followedBy : authUser._id
        }
    );

    if (followedTo == authUser._id) {
        throw new ApiError(400, "don't be too smart 😎");
    }

    const followedUser = await User.findById(followedTo);
    const followingUser = await User.findById(authUser._id);

    if (!followedUser) {
        throw new ApiError(400, "invalid followed user id");
    }

    if (isAleradyFollow) {
        console.log(isAleradyFollow)
        await Follow.findOneAndDelete(
            {
                followedTo, followedBy : authUser._id
            }
        );
        followedUser.followerCount = followedUser.followerCount - 1;
        await followedUser.save();
        followingUser.followingCount = followingUser.followingCount - 1;
        await followingUser.save();
        return false;
    }

    const addFollow = await Follow.create(
        {
            followedBy : authUser._id,
            followedTo : followedUser._id
        }
    );

    if (!addFollow) {
        throw new ApiError(500, "something went wrong while upedating follow info");
    }

    followedUser.followerCount = followedUser.followerCount + 1;
    await followedUser.save();

    followingUser.followingCount = followingUser.followingCount + 1;
    await followingUser.save();

    return true;
}

export const isFollowingByCurrentUserService = async (data) => {
    const authUser = data.user;
    const {searcheduser_id} = data.params;

    const isFollowing = await Follow.findOne({
        followedBy : authUser._id,
        followedTo : searcheduser_id
    });

    return isFollowing ? true : false
}


// export const removeFollowService = async (data) => {
//     const authUser = data.user;
//     const { followedTo } = data.body;

//     if (!followedTo) {
//         throw new ApiError(400, "follwed user Id required");
//     }

//     const followedUser = await User.findById(followedTo);
//     const followingUser = await User.findById(authUser._id);

//     if (!followedUser) {
//         throw new ApiError(400, "invalid followed user id");
//     }

//     const removeFollow = await Follow.findOneAndDelete(
//         {
//             $and : [{followedBy : authUser._id}, {followedTo : followedTo}]
//         }
//     );

//     if (!removeFollow) {
//         throw new ApiError(400, "alerady unfollowed");
//     }

//     followedUser.followerCount = followedUser.followerCount - 1;
//     await followedUser.save();

//     followingUser.followingCount = followingUser.followingCount - 1;
//     followingUser.save();

//     return ; // need some improvement
// }