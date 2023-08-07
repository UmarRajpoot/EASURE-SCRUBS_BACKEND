import Express from "express";
import PhotosUpload from "../Controllers/PhotosUpload.js";

const router = Express.Router();
//
router.post("/UploadPhoto", PhotosUpload.UploadPhoto);
router.post("/DeletePhoto", PhotosUpload.deletePhoto);

export default router;
