import { asyncHandler } from "../../utils/asyncHandler.util.js";
import { ApiResponse } from "../../utils/apiResponse.util.js";
import * as ccollectionService from "./collection.service.js";

// export const createCollection = asyncHandler( async (req, res) => {
//     const data = await ccollectionService.createCollectionService(req);

//     return res
//     .status(200)
//     .json(new ApiResponse(200, data, "collection created successfully"))
// });

export const getCollections = asyncHandler( async (req, res) => {
    const data = await ccollectionService.getCollectionsService(req);

    return res
    .status(200)
    .json(new ApiResponse(200, data, "collections fetched successfully"))
});

export const isPostSaved = asyncHandler( async (req, res) => {
    const data = await ccollectionService.isPostSavedService(req);

    return res
    .status(200)
    .json(new ApiResponse(200, data, "post save chacked successfully"));
});

// export const getCollectionData = asyncHandler( async (req, res) => {
//     const data = await ccollectionService.getCollectionDataService(req);

//     return res
//     .status(200)
//     .json(new ApiResponse(200, data, "collection data fetched successfully"))
// });

export const updateCollection = asyncHandler( async (req, res) => {
    const data = await ccollectionService.updateCollectionService(req);

    return res
    .status(200)
    .json(new ApiResponse(200, data, "collection updated successfully"))
});

// export const removeCollection = asyncHandler( async (req, res) => {
//     const data = await ccollectionService.removeCollectionService(req);

//     return res
//     .status(200)
//     .json(new ApiResponse(200, data, "collection removed successfully"))
// });

// export const removeCollectionContent = asyncHandler( async (req, res) => {
//     const data = await ccollectionService.removeCollectionContentService(req);

//     return res
//     .status(200)
//     .json(new ApiResponse(200, data, "collection content removed successfully"))
// });