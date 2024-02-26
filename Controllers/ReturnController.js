import Joi from "joi";
import createHttpError from "http-errors";
import Returns from "../Models/Returns.js";
import Orders from "../Models/Orders.js";

export default {
  addReturn: async (req, res, next) => {
    try {
      const Return_joi_schema = Joi.object({
        orderId: Joi.string().required().trim(),
        zipcode: Joi.string().required().trim(),
        returnreason: Joi.string().optional().trim(),
      });
      const validatesResult = await Return_joi_schema.validateAsync(req.body, {
        errors: true,
        warnings: true,
      });

      const { orderId, zipcode, returnreason } = validatesResult.value;

      const addReturn = await Returns.create({
        orderId: orderId,
        zipcode: zipcode,
        returnreason: returnreason,
      })
        .then((resp) => {
          return res.status(201).send({
            success: true,
            message: "Return Request Sended.",
            response: resp.dataValues,
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
  getReturns: async (req, res, next) => {
    try {
      const allReturn = await Returns.findAll({})
        .then((resp) => {
          return res.status(201).send({
            success: true,
            message: "get all returns",
            response: resp && resp,
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
  getReturnDetail: async (req, res, next) => {
    try {
      const Return_joi_schema = Joi.object({
        orderId: Joi.string().required().trim(),
        returnId: Joi.string().required().trim(),
      });
      const validatesResult = await Return_joi_schema.validateAsync(req.body, {
        errors: true,
        warnings: true,
      });

      const { orderId, returnId } = validatesResult.value;

      const getIndReturn = await Returns.findOne({
        where: {
          id: returnId,
        },
      });

      const getOrderDetail = await Orders.findOne({
        where: {
          order_id: orderId,
        },
      })
        .then((resp) => {
          return res.status(201).send({
            success: true,
            message: "getting Order Detail.",
            OrderDetail: resp && resp.dataValues,
            ReturnDetail: getIndReturn && getIndReturn.dataValues,
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
