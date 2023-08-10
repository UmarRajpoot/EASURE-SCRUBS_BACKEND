import Joi from "joi";
import createHttpError from "http-errors";
import Review from "../Models/Reviews.js";

export default {
  addReview: async (req, res, next) => {
    try {
      const Reviews_joi_schema = Joi.object({
        starcount: Joi.number().required(),
        title: Joi.string().required().trim(),
        desc: Joi.string().required().trim(),
        productID: Joi.string().required().trim(),
      });
      const validatesResult = await Reviews_joi_schema.validateAsync(req.body, {
        errors: true,
        warnings: true,
      });

      const { starcount, title, desc, productID } = validatesResult.value;

      const AddColor = await Review.create({
        starcount,
        title,
        desc,
        productID,
      })
        .then((resp) => {
          return res.status(201).send({
            success: true,
            message: "Review Added",
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
  deleteReviews: async (req, res, next) => {
    try {
      const Review_joi_schema = Joi.object({
        id: Joi.string().required().trim(),
      });
      const validatesResult = await Review_joi_schema.validateAsync(req.body, {
        errors: true,
        warnings: true,
      });

      const { id } = validatesResult.value;

      const delReview = await Review.destroy({
        where: {
          id: id,
        },
      })
        .then((resp) => {
          return res.status(200).send({
            success: true,
            message: `Reviews Deleted.`,
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
  getallReviews: async (req, res, next) => {
    try {
      const getAllReview = await Review.findAll()
        .then((resp) => {
          return res.status(200).send({
            success: true,
            message: "Get all Reviews",
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

  getReviewByProID: async (req, res, next) => {
    try {
      const Review_joi_schema = Joi.object({
        productid: Joi.string().required().trim(),
      });
      const validatesResult = await Review_joi_schema.validateAsync(
        req.params,
        {
          errors: true,
          warnings: true,
        }
      );

      const { productid } = validatesResult.value;

      const getAllReviews = await Review.findAll({
        where: {
          productID: productid,
        },
      })
        .then((resp) => {
          return res.status(200).send({
            success: true,
            message: "Get all Reviews By ID",
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
