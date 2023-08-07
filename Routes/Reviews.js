import express from "express";
import Reviews from "../Controllers/Reviews.js";
const router = express.Router();

router.post("/Review", Reviews.addReview);
router.delete("/Review", Reviews.deleteReviews);
router.get("/Review", Reviews.getallReviews);
router.get("/Review/:productid", Reviews.getReviewByProID);

export default router;
