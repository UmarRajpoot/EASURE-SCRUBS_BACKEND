import Joi from "joi";
import createHttpError from "http-errors";
import PersonCateg from "../Models/PersonCateg.js";

export default {
  addPersonCateg: async (req, res, next) => {
    try {
      const Person_joi_schema = Joi.object({
        name: Joi.string().uppercase().required().trim(),
      });
      const validatesResult = await Person_joi_schema.validateAsync(req.body, {
        errors: true,
        warnings: true,
      });

      const { name } = validatesResult.value;

      const AddPersonCateg = await PersonCateg.create({
        name: name,
      })
        .then((resp) => {
          return res.status(201).send({
            success: true,
            message: "Person Added",
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
  deletePersonCateg: async (req, res, next) => {
    try {
      const person_joi_schema = Joi.object({
        name: Joi.string().required().trim(),
      });
      const validatesResult = await person_joi_schema.validateAsync(req.body, {
        errors: true,
        warnings: true,
      });

      const { name } = validatesResult.value;

      const delPersonCateg = await PersonCateg.destroy({
        where: {
          name: name,
        },
      })
        .then((resp) => {
          return res.status(200).send({
            success: true,
            message: `Deleted Person`,
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
  getallPersonCateg: async (req, res, next) => {
    try {
      const getAllPersonCateg = await PersonCateg.findAll()
        .then((resp) => {
          return res.status(200).send({
            success: true,
            message: "Get all Persons",
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
