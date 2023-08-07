import Joi from "joi";
import createHttpError from "http-errors";
import Size from "../Models/Sizes.js";

export default {
  addSize: async (req, res, next) => {
    try {
      const Sizes_joi_schema = Joi.object({
        name: Joi.string().uppercase().required().trim(),
      });
      const validatesResult = await Sizes_joi_schema.validateAsync(req.body, {
        errors: true,
        warnings: true,
      });

      const { name } = validatesResult.value;

      const AddSize = await Size.create({
        name: name,
      })
        .then((resp) => {
          return res.status(201).send({
            success: true,
            message: "Size Added",
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
  deleteSize: async (req, res, next) => {
    try {
      const Sizes_joi_schema = Joi.object({
        name: Joi.string().required().trim(),
      });
      const validatesResult = await Sizes_joi_schema.validateAsync(req.body, {
        errors: true,
        warnings: true,
      });

      const { name } = validatesResult.value;

      const delSize = await Size.destroy({
        where: {
          name: name,
        },
      })
        .then((resp) => {
          return res.status(200).send({
            success: true,
            message: `Deleted Size`,
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
  getallSizes: async (req, res, next) => {
    try {
      const getAllSizes = await Size.findAll()
        .then((resp) => {
          return res.status(200).send({
            success: true,
            message: "Get all Sizes",
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
};
