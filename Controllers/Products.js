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

      if (ProductDataValues.productimage) {
        ProductDataValues.productimage.map((element) => {
          const fileNamePath = path.join(
            path.resolve("./"),
            "public",
            "images",
            "product",
            element.split("/").splice(-2)[0],
            element.split("/").splice(-1).toString()
          );
          const folderNamePath = path.join(
            path.resolve("./"),
            "public",
            "images",
            "product",
            element.split("/").splice(-2)[0]
          );
          fs.rm(fileNamePath, (err) => {
            if (err) {
              console.log("There is no File");
              PhotosResponse.push("Files are not deleted");
            } else {
              console.log("Files are deleted");
              PhotosResponse.push("Files are deleted");
              fs.rmdir(folderNamePath, (err) => {
                if (err) {
                  PhotosResponse.push("Folder is not deleted");
                } else {
                  console.log("Folder Deleted.");
                  PhotosResponse.push("Folder is deleted");
                }
              });
            }
          });
        });

        // Video Deleting
        let ProductVideo = ProductDataValues.productvideo;
        const fileNamePath = path.join(
          path.resolve("./"),
          "public",
          "videos",
          "product",
          ProductVideo.split("/").splice(-2)[0],
          ProductVideo.split("/").splice(-1).toString()
        );
        const folderNamePath = path.join(
          path.resolve("./"),
          "public",
          "videos",
          "product",
          ProductVideo.split("/").splice(-2)[0]
        );
        fs.rm(fileNamePath, (err) => {
          if (err) {
            console.log("There is no File");
            PhotosResponse.push("Files are not deleted");
          } else {
            console.log("Files are deleted");
            PhotosResponse.push("Files are deleted");
            fs.rmdir(folderNamePath, (err) => {
              if (err) {
                PhotosResponse.push("Folder is not deleted");
              } else {
                console.log("Folder Deleted.");
                PhotosResponse.push("Folder is deleted");
              }
            });
          }
        });
      }

      const delProduct = await Product.destroy({
        where: {
          productname: productname,
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

      // res.send({ final: finalProducts.length });
      return res.status(200).send({
        success: true,
        message: "Get Products by Color and Category",
        response: finalProducts,
      });
    } catch (error) {
      return next(
        createHttpError(406, { success: false, message: error.message })
      );
    }
  },
};
