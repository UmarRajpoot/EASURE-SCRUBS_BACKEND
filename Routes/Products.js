import express from "express";
import Product from "../Controllers/Products.js";
const router = express.Router();

router.post("/Product", Product.addProduct);
router.delete("/Product", Product.deleteProduct);
router.get("/Product", Product.getallProducts);
router.post("/ProductVideo", Product.updateVideoUrl);
// Params
router.get("/Product/:id", Product.getProductByParams);
router.get(
  "/collection/:productcolorandcategory",
  Product.getProductsByColorandCateg
);
// Set Displat Image for products
router.patch("/Product/displayImage", Product.addDisplayImage);

export default router;
