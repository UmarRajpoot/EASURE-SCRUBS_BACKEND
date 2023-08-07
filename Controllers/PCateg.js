import Joi from "joi";
import createHttpError from "http-errors";
import PCateg from "../Models/PCateg.js";

export default {
  addPCateg: async (req, res, next) => {
    try {
      const Parent_joi_schema = Joi.object({
        name: Joi.string().uppercase().required().trim(),
      });
      const validatesResult = await Parent_joi_schema.validateAsync(req.body, {
        errors: true,
        warnings: true,
      });

      const { name } = validatesResult.value;

      const AddPCateg = await PCateg.create({
        name: name,
      })
        .then((resp) => {
          return res.status(201).send({
            success: true,
            message: "Parent Category Added",
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
  deletePCateg: async (req, res, next) => {
    try {
      const delete_joi_schema = Joi.object({
        name: Joi.string().required().trim(),
      });
      const validatesResult = await delete_joi_schema.validateAsync(req.body, {
        errors: true,
        warnings: true,
      });

      const { name } = validatesResult.value;

      const delPCateg = await PCateg.destroy({
        where: {
          name: name,
        },
      })
        .then((resp) => {
          return res.status(200).send({
            success: true,
            message: `Deleted ${name} Parent Category`,
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
  getallPCateg: async (req, res, next) => {
    try {
      const getAllCateg = await PCateg.findAll()
        .then((resp) => {
          return res.status(200).send({
            success: true,
            message: "Get all Parents Categories",
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
