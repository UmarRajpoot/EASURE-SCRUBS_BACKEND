import createHttpError from "http-errors";
import Joi from "joi";
import path from "path";
import fs from "fs";
import Colors from "../Models/Colors.js";
import { BASEURL } from "../Configs/URL.js";
import Products from "../Models/Products.js";

export default {
  UploadPhoto: async (req, res, next) => {
    try {
      if (!req.files) {
        return res.send({
          status: false,
          message: "No file uploaded",
        });
      } else if (
        req.files.UploadPhoto.mimetype === "image/jpeg" ||
        req.files.UploadPhoto.mimetype === "image/png" ||
        req.files.UploadPhoto.mimetype === "image/jpg" ||
        req.files.UploadPhoto.mimetype === "video/mp4"
      ) {
        // Photo Upload
        let UploadPhoto = req.files.UploadPhoto;
        const ImagesUpload_schema = Joi.object({
          slug: Joi.string().uppercase().required().trim(),
          // Purpose
          purpose: Joi.string().required().trim(),
        });
        const validatesResult = await ImagesUpload_schema.validateAsync(
          req.body,
          {
            errors: true,
            warnings: true,
          }
        );

        const { slug, purpose } = validatesResult.value;

        const replaceSpaceName = slug.replace(" ", "-");

        const ColorCatPhoto = async () => {
          // Create a file name
          const file_name =
            replaceSpaceName + "_" + UploadPhoto.name.split(" ").join("_");
          // Create a folder according to their ID
          const folderPath = path.join(
            path.resolve("./"),
            "public",
            "images",
            "colorcategories"
          );
          const createFolder = await fs.mkdir(folderPath, (err) => {
            if (err) {
              // console.log("Folder Already Exists");
              return;
            }
            console.log("Folder Created");
          });
          // Where all profile images will Store
          let PhotoPath = path.join(
            path.resolve("./"),
            "public",
            "images",
            "colorcategories"
          );

          // Upload file to Folder
          const UploadPhoto1 = await UploadPhoto.mv(
            path.join(PhotoPath, file_name)
          );

          // Save into Db

          const ExternalPhotoURL = `${BASEURL}/images/colorcategories/${file_name}`;
          // console.log(ExternalPhotoURL, replaceSpace);

          const AddProfilePhoto = await Colors.update(
            {
              photo: ExternalPhotoURL,
            },
            {
              where: {
                name: replaceSpaceName,
              },
            }
          )
            .then((resp) => {
              if (resp) {
                return res.send({
                  success: true,
                  message: "Color Photo Saved Successfully",
                  path: `${ExternalPhotoURL}`,
                });
              }
            })
            .catch((error) => {
              return next(
                createHttpError(406, { success: false, message: error.message })
              );
            });
        };

        //  Product Photo Upload
        const ProductPhoto = async () => {
          if (replaceSpaceName !== undefined) {
            // Create a file name
            const file_name =
              replaceSpaceName + "_" + UploadPhoto.name.split(" ").join("_");
            // Create a folder according to their ID
            const folderPath = path.join(
              path.resolve("./"),
              "public",
              "images",
              "product",
              `${replaceSpaceName}`
            );

            const createFolder = await fs.mkdir(folderPath, (err) => {
              if (err) {
                // console.log("Folder Already Exists");
                return;
              }
              console.log("Folder Created");
            });
            // Where all profile images will Store
            let PhotoPath = path.join(
              path.resolve("./"),
              "public",
              "images",
              "product",
              `${replaceSpaceName}`
            );

            // Upload file to Folder
            const UploadPhoto1 = await UploadPhoto.mv(
              path.join(PhotoPath, file_name)
            );

            const ExternalPhotoURL = `${BASEURL}/images/product/${replaceSpaceName}/${file_name}`;

            const getAllImages = await Products.findOne({
              where: {
                productname: replaceSpaceName,
              },
            });
            if (getAllImages !== null) {
              let preSaveImages = [];
              let preImages = await getAllImages.dataValues.productimage?.map(
                (image) => {
                  preSaveImages.push(image);
                }
              );

              const AddProfilePhoto = await Products.update(
                {
                  productimage: [...preSaveImages, ExternalPhotoURL],
                },
                {
                  where: {
                    productname: replaceSpaceName,
                  },
                  returning: true,
                }
              )
                .then((resp) => {
                  return res.send({
                    success: true,
                    message: "Product Photo Saved Successfully",
                    path: `${ExternalPhotoURL}`,
                  });
                })
                .catch((error) => {
                  return next(
                    createHttpError(406, {
                      success: false,
                      message: error.message,
                    })
                  );
                });
            }
          }
        };

        const ProductVideo = async () => {
          try {
            if (replaceSpaceName !== undefined) {
              // Create a file name
              const file_name =
                replaceSpaceName + "_" + UploadPhoto.name.split(" ").join("_");
              // Create a folder according to their ID
              const folderPath = path.join(
                path.resolve("./"),
                "public",
                "videos",
                "product",
                `${replaceSpaceName}`
              );

              const createFolder = await fs.mkdir(folderPath, (err) => {
                if (err) {
                  // console.log("Folder Already Exists");
                  return;
                }
                console.log("Folder Created");
              });
              // Where all profile images will Store
              let VideoPath = path.join(
                path.resolve("./"),
                "public",
                "videos",
                "product",
                `${replaceSpaceName}`
              );

              // Upload file to Folder
              const UploadPhoto1 = await UploadPhoto.mv(
                path.join(VideoPath, file_name)
              );

              const ExternalPhotoURL = `${BASEURL}/videos/product/${replaceSpaceName}/${file_name}`;

              const AddProfilePhoto = await Products.update(
                {
                  productvideo: ExternalPhotoURL,
                },
                {
                  where: {
                    productname: replaceSpaceName,
                  },
                  returning: true,
                }
              )
                .then((resp) => {
                  return res.send({
                    success: true,
                    message: "Product Video Saved Successfully",
                    path: `${ExternalPhotoURL}`,
                  });
                })
                .catch((error) => {
                  return next(
                    createHttpError(406, {
                      success: false,
                      message: error.message,
                    })
                  );
                });
            }
          } catch (error) {
            return next(
              createHttpError(406, {
                success: false,
                message: error.message,
              })
            );
          }
        };

        switch (purpose) {
          case "colorsCatPhoto":
            return ColorCatPhoto();
          case "productPhoto":
            return ProductPhoto();
          case "productVideo":
            return ProductVideo();
          default:
            return next(
              createHttpError(406, {
                success: false,
                message: "Purpose not Provided",
              })
            );
        }
      }
    } catch (error) {
      return next(
        createHttpError(406, { success: false, message: error.message })
      );
    }
  },
  deletePhoto: async (req, res, next) => {
    try {
      const ImagesDelete_schema = Joi.object({
        photoURL: Joi.string().required().trim(),
        // Purpose
        purpose: Joi.string().required().trim(),
      });
      const validatesResult = await ImagesDelete_schema.validateAsync(
        req.body,
        {
          errors: true,
          warnings: true,
        }
      );

      const { photoURL, purpose } = validatesResult.value;

      const DeleteColorPhoto = () => {
        // Folder Path
        // return res.send({ photoURL: photoURL.split("/").splice(-1), purpose });
        const folderNamePath = path.join(
          path.resolve("./"),
          "public",
          "images",
          "colorcategories",
          photoURL.split("/").splice(-1).toString()
        );

        fs.rm(folderNamePath, (err) => {
          if (err) {
            return next(
              createHttpError(406, {
                success: false,
                message: "File Not Found.",
              })
            );
          } else {
            return res.send({ success: true, message: "Color Photo Deleted." });
          }
        });
        return true;
      };
      const DeleteProductPhoto = async () => {
        // Folder Path
        // return res.send({ photoURL: photoURL.split("/").splice(-1), purpose });
        const folderNamePath = path.join(
          path.resolve("./"),
          "public",
          "images",
          "product",
          photoURL.split("/").splice(-2)[0],
          photoURL.split("/").splice(-1).toString()
        );

        const getAllImages = await Products.findOne({
          where: {
            productname: photoURL.split("/").splice(-2)[0],
          },
        });

        if (getAllImages !== null) {
          // let preSaveImages = [];
          // let preImages = await getAllImages.dataValues.productimage?.map(
          //   (image) => {
          //     preSaveImages.push(image);
          //   }
          // );
          const filterImages =
            await getAllImages.dataValues.productimage.filter(
              (fil_image) => fil_image !== photoURL
            );
          const addRemainingImages = await Products.update(
            {
              productimage: filterImages,
            },
            {
              where: {
                productname: photoURL.split("/").splice(-2)[0],
              },
            }
          )
            .then(() => {
              fs.rm(folderNamePath, (err) => {
                if (err) {
                  return next(
                    createHttpError(406, {
                      success: false,
                      message: "File Not Found.",
                    })
                  );
                } else {
                  return res.send({
                    success: true,
                    message: "Product Photo Deleted.",
                  });
                }
              });
            })
            .catch((error) => {
              return next(
                createHttpError(406, {
                  success: false,
                  message: error.message,
                })
              );
            });
        }
        return true;
      };
      const DeleteProductVideo = async () => {
        // Folder Path
        // return res.send({ photoURL: photoURL.split("/").splice(-1), purpose });
        const FolderPath = path.join(
          path.resolve("./"),
          "public",
          "videos",
          "product",
          photoURL.split("/").splice(-2)[0]
        );
        const FileNamePath = path.join(
          path.resolve("./"),
          "public",
          "videos",
          "product",
          photoURL.split("/").splice(-2)[0],
          photoURL.split("/").splice(-1).toString()
        );

        const updatevideoMeta = await Products.update(
          {
            productvideo: "",
          },
          {
            where: {
              productname: photoURL.split("/").splice(-2)[0],
            },
          }
        )
          .then(() => {
            fs.rm(FileNamePath, (err) => {
              if (err) {
                return next(
                  createHttpError(406, {
                    success: false,
                    message: "File Not Found.",
                  })
                );
              } else {
                fs.rmdir(FolderPath, (err) => {
                  if (err) {
                    return next(
                      createHttpError(406, {
                        success: false,
                        message: err.message,
                      })
                    );
                  } else {
                    return res.send({
                      success: true,
                      message: "Product Video Deleted.",
                    });
                  }
                });
              }
            });
          })
          .catch((error) => {
            return next(
              createHttpError(406, {
                success: false,
                message: error.message,
              })
            );
          });

        return true;
      };

      switch (purpose) {
        case "DELcolorsCatPhoto":
          return DeleteColorPhoto();
        case "DELproductsPhoto":
          return DeleteProductPhoto();
        case "DELproductsVideo":
          return DeleteProductVideo();
        default:
          return next(
            createHttpError(406, {
              success: false,
              message: "Purpose not Provided",
            })
          );
      }
    } catch (error) {
      return next(
        createHttpError(406, { success: false, message: error.message })
      );
    }
  },
};
