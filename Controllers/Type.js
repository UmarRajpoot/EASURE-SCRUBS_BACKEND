import Joi from "joi";
import createHttpError from "http-errors";
import Type from "../Models/Type.js";

export default {
  addType: async (req, res, next) => {
    try {
      const Type_joi_schema = Joi.object({
        name: Joi.string().uppercase().required().trim(),
      });
      const validatesResult = await Type_joi_schema.validateAsync(req.body, {
        errors: true,
        warnings: true,
      });

      const { name } = validatesResult.value;

      const AddType = await Type.create({
        name: name,
      })
        .then((resp) => {
          return res.status(201).send({
            success: true,
            message: "Type Added",
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
  deleteType: async (req, res, next) => {
    try {
      const type_joi_schema = Joi.object({
        name: Joi.string().required().trim(),
      });
      const validatesResult = await type_joi_schema.validateAsync(req.body, {
        errors: true,
        warnings: true,
      });

      const { name } = validatesResult.value;

      const delType = await Type.destroy({
        where: {
          name: name,
        },
      })
        .then((resp) => {
          return res.status(200).send({
            success: true,
            message: `Deleted Type`,
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
  getallType: async (req, res, next) => {
    try {
      const getAllType = await Type.findAll()
        .then((resp) => {
          return res.status(200).send({
            success: true,
            message: "Get all Types",
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
