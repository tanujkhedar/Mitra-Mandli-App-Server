import { Collection } from "./collection.model.js";
import { ApiError } from "../../utils/apiError.util.js"

export const createCollectionService = async (data) => {
    const authUser = data.user;
    const {title, description} = data.body;

    if (!title) {
        throw new ApiError(400, "title is required");
    }

    const collection = await Collection.create(
        {
            title, 
            description : description || '', 
            owner : authUser._id
        }
    );

    if (!collection) {
        throw new ApiError(500, "something went wrong while creating collection");
    }

    return collection;
}

export const getCollectionsService = async (data) => {
    const authUser = data.user;

    const collections = await Collection.find({owner : authUser._id}).select("-content");

    if (!collections) {
        throw new ApiError(500, "something went wrong while fetching collection");
    }

    return collections;
}

export const getCollectionDataService = async (data) => {
    const authUser = data.user;
    const {collection_id} = data.body;

    if (!collection_id) {
        throw new ApiError(400, "collection id required");
    }

    const collection = await Collection.findById(collection_id);

    if (!collection) {
        throw new ApiError(500, "something went wrong while fetching collection");
    }

    return collection;
}

export const updateCollectionService = async (data) => {
    const authUser = data.user;
    const {title, description, collection_id, post_id} = data.body;

    if (!collection_id || (!title && !description && !post_id)) {
        throw new ApiError(400, "collection id or atlist one updating field are required");
    }

    const collection = await Collection.findById(collection_id);

    if (!collection) {
        throw new ApiError(400, "collection id invalid");
    }

    if (title) collection.title = title;
    if (description) collection.description = description;
    if (post_id) collection.content.push(post_id);

    await collection.save();

    return collection;
}

export const removeCollectionService = async (data) => {
    const authUser = data.user;
    const {collection_id} = data.body;

    if (!collection_id) {
        throw new ApiError(400, "collection id required");
    }

    const collection = await Collection.findByIdAndDelete(collection_id);

    if (!collection) {
        throw new ApiError(500, "something went wrong while removing collection");
    }

    return {};
}

export const removeCollectionContentService = async (data) => {
    const authUser = data.user;
    const {collection_id, post_id} = data.body;

    if (!collection_id || !post_id) {
        throw new ApiError(400, "collection or post id required");
    }

    const collection = await Collection.findById(collection_id);

    if (!collection) {
        throw new ApiError(500, "something went wrong while removing collection content");
    }

    // collection.content
    // correction needed removing from array type data field

    return collection;
}