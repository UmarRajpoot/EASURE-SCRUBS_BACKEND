import Joi from "joi";
import createHttpError from "http-errors";
import TypeStyle from "../Models/TypeStyle.js";

export default {
  addTypeStyle: async (req, res, next) => {
    try {
      const Type_style_joi_schema = Joi.object({
        name: Joi.string().uppercase().required().trim(),
      });
      const validatesResult = await Type_style_joi_schema.validateAsync(
        req.body,
        {
          errors: true,
          warnings: true,
        }
      );

      const { name } = validatesResult.value;

      const AddTypeStyle = await TypeStyle.create({
        name: name,
      })
        .then((resp) => {
          return res.status(201).send({
            success: true,
            message: "Type Style Added",
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
  deleteTypeStyle: async (req, res, next) => {
    try {
      const type_style_joi_schema = Joi.object({
        name: Joi.string().required().trim(),
      });
      const validatesResult = await type_style_joi_schema.validateAsync(
        req.body,
        {
          errors: true,
          warnings: true,
        }
      );

      const { name } = validatesResult.value;

      const delTypeStyle = await TypeStyle.destroy({
        where: {
          name: name,
        },
      })
        .then((resp) => {
          return res.status(200).send({
            success: true,
            message: `Deleted Type Style`,
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
  getallTypeStyle: async (req, res, next) => {
    try {
      const getAllTypeStyle = await TypeStyle.findAll()
        .then((resp) => {
          return res.status(200).send({
            success: true,
            message: "Get all Types Style",
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
