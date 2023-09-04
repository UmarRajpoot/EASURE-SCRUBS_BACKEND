import express from "express";
import Product from "../Controllers/Products.js";
const router = express.Router();

router.post("/Product", Product.addProduct);
router.delete("/Product", Product.deleteProduct);
router.get("/Product", Product.getallProducts);
router.post("/ProductVideo", Product.updateVideoUrl);
// Params
router.get("/Product/:productname", Product.getProductByParams);
router.get(
  "/collection/:productcolorandcategory",
  Product.getProductsByColorandCateg
);

export default router;
