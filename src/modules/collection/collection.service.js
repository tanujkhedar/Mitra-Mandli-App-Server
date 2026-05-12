import { Collection } from "./collection.model.js";
import { ApiError } from "../../utils/apiError.util.js"

// export const createCollectionService = async (data) => {
//     const authUser = data.user;
//     const {title, description} = data.body;

//     if (!title) {
//         throw new ApiError(400, "title is required");
//     }

//     const collection = await Collection.create(
//         {
//             title, 
//             description : description || '', 
//             owner : authUser._id
//         }
//     );

//     if (!collection) {
//         throw new ApiError(500, "something went wrong while creating collection");
//     }

//     return collection;
//}

export const getCollectionsService = async (data) => {
    const authUser = data.user;

    const collections = await Collection.find({owner : authUser._id}).populate("content");

    if (!collections) {
        throw new ApiError(500, "something went wrong while fetching collection");
    }

    return collections;
}

export const isPostSavedService = async (data) => {
    const authUser = data.user;
    const {post_id} = data.params;

    const isPostSaved = await Collection.findOne({
        $and : [{owner: authUser._id}, {content: post_id}]
    });

    return  isPostSaved ? true : false
}

// export const getCollectionDataService = async (data) => {
//     const authUser = data.user;
//     const {collection_id} = data.body;

//     if (!collection_id) {
//         throw new ApiError(400, "collection id required");
//     }

//     const collection = await Collection.findById(collection_id);

//     if (!collection) {
//         throw new ApiError(500, "something went wrong while fetching collection");
//     }

//     return collection;
// }

export const updateCollectionService = async (data) => {
    const authUser = data.user;
    const {post_id} = data.body;

    if (!post_id) {
        throw new ApiError(400, "post id is required");
    }

    const collection = await Collection.findOne({
        $and : [{owner : authUser._id}, {content : post_id}]
    });

    if (!collection) {
        const newCollection = await Collection.create({owner: authUser._id, content: post_id});
        if(newCollection) return true;
        throw new ApiError(500, "post save failed");
    }

    await Collection.findByIdAndDelete(collection._id);
    return false;

}

// export const removeCollectionService = async (data) => {
//     const authUser = data.user;
//     const {collection_id} = data.body;

//     if (!collection_id) {
//         throw new ApiError(400, "collection id required");
//     }

//     const collection = await Collection.findByIdAndDelete(collection_id);

//     if (!collection) {
//         throw new ApiError(500, "something went wrong while removing collection");
//     }

//     return {};
// }

// export const removeCollectionContentService = async (data) => {
//     const authUser = data.user;
//     const {collection_id, post_id} = data.body;

//     if (!collection_id || !post_id) {
//         throw new ApiError(400, "collection or post id required");
//     }

//     const collection = await Collection.findById(collection_id);

//     if (!collection) {
//         throw new ApiError(500, "something went wrong while removing collection content");
//     }

//     // collection.content
//     // correction needed removing from array type data field

//     return collection;
// }