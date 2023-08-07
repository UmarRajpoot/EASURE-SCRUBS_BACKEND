import Joi from "joi";
import createHttpError from "http-errors";
import Varient from "../Models/Varient.js";

export default {
  addVarient: async (req, res, next) => {
    try {
      const Varient_joi_schema = Joi.object({
        name: Joi.string().uppercase().required().trim(),
      });
      const validatesResult = await Varient_joi_schema.validateAsync(req.body, {
        errors: true,
        warnings: true,
      });

      const { name } = validatesResult.value;

      const AddVarient = await Varient.create({
        name: name,
      })
        .then((resp) => {
          return res.status(201).send({
            success: true,
            message: "Varient Added",
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
  deleteVarient: async (req, res, next) => {
    try {
      const Varient_joi_schema = Joi.object({
        name: Joi.string().required().trim(),
      });
      const validatesResult = await Varient_joi_schema.validateAsync(req.body, {
        errors: true,
        warnings: true,
      });

      const { name } = validatesResult.value;

      const delVarient = await Varient.destroy({
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
  getallVarients: async (req, res, next) => {
    try {
      const getAllVarient = await Varient.findAll()
        .then((resp) => {
          return res.status(200).send({
            success: true,
            message: "Get all Varients Categories",
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
