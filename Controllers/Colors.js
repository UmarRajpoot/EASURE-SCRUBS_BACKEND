import Joi from "joi";
import createHttpError from "http-errors";
import Colors from "../Models/Colors.js";

export default {
  addColor: async (req, res, next) => {
    try {
      const Color_joi_schema = Joi.object({
        name: Joi.string().uppercase().required().trim(),
        colorcode: Joi.string().required().trim(),
        colorType: Joi.string().required().trim(),
      });
      const validatesResult = await Color_joi_schema.validateAsync(req.body, {
        errors: true,
        warnings: true,
      });

      const { name, colorcode, colorType } = validatesResult.value;

      const replaceSpace = name.replace(" ", "-");

      const AddColor = await Colors.create({
        name: replaceSpace,
        colorcode: colorcode,
        colorType: colorType,
      })
        .then((resp) => {
          return res.status(201).send({
            success: true,
            message: "Color Added",
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
  deleteColor: async (req, res, next) => {
    try {
      const Color_joi_schema = Joi.object({
        name: Joi.string().required().trim(),
      });
      const validatesResult = await Color_joi_schema.validateAsync(req.body, {
        errors: true,
        warnings: true,
      });

      const { name } = validatesResult.value;

      const delColor = await Colors.destroy({
        where: {
          name: name,
        },
      })
        .then((resp) => {
          return res.status(200).send({
            success: true,
            message: `Color Deleted.`,
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
  getallColors: async (req, res, next) => {
    try {
      let theColors = [];
      const getAllColors = await Colors.findAll().then((resp) =>
        resp?.map((response) => {
          theColors.push(response);
        })
      );

      let extrafinalShopByColors = [];
      let styleValues = [
        "BLACK",
        "CEIL-BLUE",
        "WINE",
        "ROYAL-BLUE",
        "PEWT",
        "NAVY-BLUE",
      ];
      // console.log("The Colors", theColors);

      styleValues.map((style) => {
        return theColors.filter((filColor) => {
          // console.log(filColor.dataValues);
          if (filColor.dataValues.name === style) {
            return extrafinalShopByColors.push(filColor);
          }
        });
      });

      return res.status(200).send({
        success: true,
        message: "Get all Colors",
        response: extrafinalShopByColors,
      });
    } catch (error) {
      return next(
        createHttpError(406, { success: false, message: error.message })
      );
    }
  },
};
