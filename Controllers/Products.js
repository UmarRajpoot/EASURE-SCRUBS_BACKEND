import Joi from "joi";
import createHttpError from "http-errors";
import Product from "../Models/Products.js";
import fs from "fs";
import path from "path";
import Colors from "../Models/Colors.js";

export default {
  addProduct: async (req, res, next) => {
    try {
      const Product_joi_schema = Joi.object({
        productname: Joi.string().uppercase().required().trim(),
        // productimage: Joi.string().required().trim(),
        parentcategory: Joi.string().required().trim(),
        personname: Joi.string().required().trim(),
        varientname: Joi.string().required().trim(),
        typename: Joi.string().required().trim(),
        typestylename: Joi.string().required().trim(),
        price: Joi.number().required(),
        sizes: Joi.array().required(),
        colors: Joi.array().required(),
      });
      const validatesResult = await Product_joi_schema.validateAsync(req.body, {
        errors: true,
        warnings: true,
      });

      const {
        productname,
        // productimage,
        parentcategory,
        personname,
        varientname,
        typename,
        typestylename,
        price,
        sizes,
        colors,
      } = validatesResult.value;

      const AddProduct = await Product.create({
        productname,
        // productimage,
        parentcategory,
        personname,
        varientname,
        typename,
        typestylename,
        price,
        sizes,
        colors,
      })
        .then((resp) => {
          return res.status(201).send({
            success: true,
            message: "Product Added",
            response: resp.dataValues,
          });
        })
        .catch((error) => {
          return next(
            createHttpError(403, {
              success: false,
              message: error.errors[0].message,
            })
          );
        });
    } catch (error) {
      return next(
        createHttpError(406, { success: false, message: error.message })
      );
    }
  },
  deleteProduct: async (req, res, next) => {
    try {
      const Product_joi_schema = Joi.object({
        productname: Joi.string().required().trim(),
      });
      const validatesResult = await Product_joi_schema.validateAsync(req.body, {
        errors: true,
        warnings: true,
      });

      const { productname } = validatesResult.value;

      let ProductDataValues = {};
      const getAllDetail = await Product.findOne({
        where: {
          productname: productname,
        },
      }).then((resp) => {
        // console.log(resp.dataValues);
        Object.assign(ProductDataValues, resp.dataValues);
      });

      // Photo Deleting
      let PhotosResponse = [];

      if (
        ProductDataValues.productimage.length !== 0 ||
        ProductDataValues.productvideo.length !== ""
      ) {
        const ImageFolderPath = path.join(
          path.resolve("./"),
          "public",
          "images",
          "product",
          ProductDataValues.productimage[0]?.split("/").splice(-2)[0] || ""
        );
        const VideoFolderPath = path.join(
          path.resolve("./"),
          "public",
          "videos",
          "product",
          ProductDataValues.productimage[0]?.split("/").splice(-2)[0] || ""
        );

        fs.rm(ImageFolderPath, { recursive: true, force: true }, (err) => {
          if (err) {
            console.log(err);
          } else {
            PhotosResponse.push("Images Folder Deleted.");
            console.log("Images Folder Removes");
          }
        });
        fs.rm(VideoFolderPath, { recursive: true, force: true }, (err) => {
          if (err) {
            console.log(err);
          } else {
            PhotosResponse.push("Videos Folder Deleted.");
            console.log("Videos Folder Removes");
          }
        });
      }
      const delProduct = await Product.destroy({
        where: {
          productname: ProductDataValues.productname,
        },
      })
        .then((resp) => {
          return res.status(200).send({
            success: true,
            message: `Deleted Product`,
            response: PhotosResponse,
          });
        })
        .catch((error) => {
          return next(
            createHttpError(406, { success: false, message: error.message })
          );
        });
    } catch (error) {
      return next(
        createHttpError(406, { success: false, message: error.message })
      );
    }
  },
  getallProducts: async (req, res, next) => {
    try {
      const getAllProducts = await Product.findAll()
        .then((resp) => {
          return res.status(200).send({
            success: true,
            message: "Get all Products",
            response: resp,
          });
        })
        .catch((error) => {
          return next(
            createHttpError(406, { success: false, message: error.message })
          );
        });
    } catch (error) {
      return next(
        createHttpError(406, { success: false, message: error.message })
      );
    }
  },
  getProductByParams: async (req, res, next) => {
    try {
      const Product_joi_schema = Joi.object({
        productname: Joi.string().uppercase().required().trim(),
      });
      const validatesResult = await Product_joi_schema.validateAsync(
        req.params,
        {
          errors: true,
          warnings: true,
        }
      );

      const { productname } = validatesResult.value;
      const getProductByParams = await Product.findOne({
        where: {
          productname: productname,
        },
      })
        .then((resp) => {
          return res.status(200).send({
            success: true,
            message: "Get Products by params",
            response: resp,
          });
        })
        .catch((error) => {
          return next(
            createHttpError(406, { success: false, message: error.message })
          );
        });
    } catch (error) {
      return next(
        createHttpError(406, { success: false, message: error.message })
      );
    }
  },
  getProductsByColorandCateg: async (req, res, next) => {
    try {
      const Product_joi_schema = Joi.object({
        productcolorandcategory: Joi.string().uppercase().required().trim(),
      });
      const validatesResult = await Product_joi_schema.validateAsync(
        req.params,
        {
          errors: true,
          warnings: true,
        }
      );

      const { productcolorandcategory } = validatesResult.value;

      // console.log(productcolorandcategory);
      let color = productcolorandcategory
        .split("-")
        .slice(0, productcolorandcategory.split("-").length - 2)
        .toString()
        .replace(",", "-");
      let PCate = productcolorandcategory.split("-").slice(-1).toString();
      // console.log("Color is", color, "and", "parent Cate", PCate);
      const getAllColors = await Colors.findAll({});

      const getSpecColor = getAllColors.filter((Fcolor) => {
        if (Fcolor.dataValues.name === color.toUpperCase()) {
          return Fcolor.dataValues.colorcode;
        }
      });

      const getAllProducts = await Product.findAll({
        where: {
          parentcategory: PCate,
        },
      });

      // Filters by color e.g black, navy-blue, ceil-blue
      let finalProducts = [];
      getAllProducts.filter((filPro) => {
        if (
          filPro.dataValues.colors[0].colors.includes(
            getSpecColor[0].colorcode
          ) === true
        ) {
          finalProducts.push(filPro);
        }
      });

      // Filters by typestylename e.g top, pants, set

      let extrafinalProducts = [];
      let remainingfinalProducts = [];
      let styleValues = ["top", "pants", "set"];

      styleValues.map((style) => {
        return finalProducts.filter((filProd) => {
          if (filProd.typestylename.toLowerCase() === style) {
            return extrafinalProducts.push(filProd);
          }
        });
      });

      // res.send({ final: finalProducts.length }); // finalProducts
      return res.status(200).send({
        success: true,
        message: "Get Products by Color and Category",
        response: extrafinalProducts,
      });
    } catch (error) {
      return next(
        createHttpError(406, { success: false, message: error.message })
      );
    }
  },
};
