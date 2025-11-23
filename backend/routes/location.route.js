import express  from "express"
import { createLocation, deleteLocation, getAllLocations, getLocationById, getNearbyPlaces, searchPlaces, seedPlaces, updateLocation } from "../controllers/location.controllers.js"
import {heritagePic} from "../middleware/fileUpload.js"
const router = express.Router()

router.post("/add", heritagePic.array("images", 5), createLocation);
router.get("/search", searchPlaces);
router.get("/nearby", getNearbyPlaces);
router.post("/seed", seedPlaces);
router.get("/", getAllLocations);

// Specific ID-based routes should come at the end
router.get("/:id", getLocationById);
router.post("/:id",heritagePic.array("images", 5), updateLocation);
router.delete("/:id", deleteLocation);


export default router