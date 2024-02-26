import Joi from "joi";
import createHttpError from "http-errors";
import Contact from "../Models/Contact.js";

export default {
  addContactInfo: async (req, res, next) => {
    try {
      const Contact_joi_schema = Joi.object({
        email: Joi.string().email().required().trim(),
        gender: Joi.string().required().trim(),
      });
      const validatesResult = await Contact_joi_schema.validateAsync(req.body, {
        errors: true,
        warnings: true,
      });

      const { email, gender } = validatesResult.value;

      const AddSize = await Contact.create({
        email: email,
        gender: gender,
      })
        .then((resp) => {
          return res.status(201).send({
            success: true,
            message: "Contact Added",
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
  deleteContact: async (req, res, next) => {
    try {
      const Contact_joi_schema = Joi.object({
        id: Joi.string().required().trim(),
      });
      const validatesResult = await Contact_joi_schema.validateAsync(req.body, {
        errors: true,
        warnings: true,
      });

      const { id } = validatesResult.value;

      const delContact = await Contact.destroy({
        where: {
          id: id,
        },
      })
        .then((resp) => {
          return res.status(200).send({
            success: true,
            message: `Deleted Contact`,
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
  getallContacts: async (req, res, next) => {
    try {
      const getAllContacts = await Contact.findAll()
        .then((resp) => {
          return res.status(200).send({
            success: true,
            message: "Get all Contacts",
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
