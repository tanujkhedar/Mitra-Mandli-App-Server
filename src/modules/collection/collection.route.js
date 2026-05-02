import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware.js";
import { createCollection, getCollectionData, getCollections, removeCollection, removeCollectionContent, updateCollection } from "./collection.controller.js";

const router = Router();

router.route('/create').post(auth, createCollection);
router.route('/get').get(auth, getCollections);
router.route('/getcontent').get(auth, getCollectionData); //needed
router.route('/update').patch(auth, updateCollection); //some validation needed
router.route('/remove').delete(auth, removeCollection);
router.route('/removecontent').delete(auth, removeCollectionContent);  //corretion needed

export const collectionRouter = router;