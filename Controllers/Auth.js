import createHttpError from "http-errors";
import Auth from "../Models/Auth.js";
import Joi from "joi";
import Bcrypt from "bcrypt";

export default {
  Register: async (req, res, next) => {
    try {
      const register_joi_schema = Joi.object({
        firstname: Joi.string().required().trim(),
        lastname: Joi.string().required().trim(),
        email: Joi.string().email().lowercase().required().trim(),
        password: Joi.string().min(6).required().trim(),
      });
      const validatesResult = await register_joi_schema.validateAsync(
        req.body,
        {
          errors: true,
          warnings: true,
        }
      );

      const { firstname, lastname, email, password } = validatesResult.value;

      const check_user = await Auth.findOne({
        where: {
          email: email,
        },
      });

      if (check_user) {
        return next(
          createHttpError(409, {
            success: false,
            message: "User Already Exists. Need to Login.",
          })
        );
      } else {
        const hash_password = await Bcrypt.hash(password, 10).then(
          (res) => res
        );
        const registerUser = await Auth.create({
          firstname: firstname,
          lastname: lastname,
          email: email,
          password: hash_password,
        }).then((resp) => {
          const {
            id,
            firstname,
            lastname,
            email,
            emailVerified,
            updatedAt,
            createdAt,
          } = resp.dataValues;

          const generateResponse = {
            id,
            firstname,
            lastname,
            email,
            emailVerified,
            updatedAt,
            createdAt,
          };

          return res.status(201).send({
            success: true,
            message: "Register Successfully.",
            response: generateResponse,
          });
        });
      }
    } catch (error) {
      return next(
        createHttpError(406, { success: false, message: error.message })
      );
    }
  },
  Login: async (req, res, next) => {
    try {
      const login_schema = Joi.object({
        email: Joi.string().email().lowercase().required().trim(),
        password: Joi.string().min(6).required().trim(),
      });

      const validatesResult = await login_schema.validateAsync(req.body, {
        errors: true,
        warnings: true,
      });

      const { email, password } = validatesResult.value;
      const check_user = await Auth.findOne({
        where: {
          email: email,
        },
      });
      if (!check_user) {
        return next(
          createHttpError(406, {
            success: false,
            message: "User is not Exists. Register Please.",
          })
        );
      } else {
        // User Existed
        const Compared_password = await Bcrypt.compare(
          password,
          check_user.dataValues.password
        ).then((res) => res);

        if (Compared_password) {
          const {
            id,
            firstname,
            lastname,
            email,
            emailVerified,
            updatedAt,
            createdAt,
          } = check_user.dataValues;

          const generateResponse = {
            id,
            firstname,
            lastname,
            email,
            emailVerified,
            updatedAt,
            createdAt,
          };
          return res.send({
            success: true,
            message: "Login Successfully.",
            response: generateResponse,
          });
          // const getAll = await Auth.findAll({
          //   include: SchoolProfile,
          //   where: {
          //     id: check_user.id,
          //   },
          // })
          //   .then((resp) => {
          //     return res.send({
          //       success: true,
          //       message: "Login Successfully.",
          //       response: resp[0],
          //     });
          //   })
          //   .catch((error) => {
          //     return next(
          //       createHttpError(406, { success: false, message: error.message })
          //     );
          //   });
        } else {
          return res
            .status(406)
            .send({ success: false, message: "Password is Incorrect" });
        }
      }
    } catch (error) {
      return next(
        createHttpError(406, { success: false, message: error.message })
      );
    }
  },

  forgetandResetPassword: async (req, res, next) => {
    try {
      let email = req.params.email;

      const getUserfromDB = await Auth.findOne({
        where: {
          email: email,
        },
      });

      if (getUserfromDB) {
        const UpdateDB = await Auth.update(
          {
            password: "",
          },
          {
            where: {
              email: email,
            },
          }
        )
          .then(() => {
            return res.redirect(`${RedirectURLLink}?email=${email}`);
          })
          .then(() => {
            return res.send({
              success: true,
              message: "Password Reset Successfully.",
            });
          })

          .catch((error) => {
            return next(
              createHttpError(406, { success: false, message: error.message })
            );
          });
      }
    } catch (error) {
      return next(
        createHttpError(406, { success: false, message: error.message })
      );
    }
  },
  ChangePassword: async (req, res, next) => {
    try {
      const change_Pass_schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      });

      const validatesResult = await change_Pass_schema.validateAsync(req.body, {
        errors: true,
        warnings: true,
      });

      const { email } = validatesResult.value;

      // Find the Auth exist in DB
      const check_user = await Auth.findOne({
        where: {
          email: email,
        },
      });

      if (!check_user) {
        return next(
          createHttpError(406, {
            success: false,
            message: "User is not Exists.",
          })
        );
      } else {
        // Convert into hash
        const hash_password = await Bcrypt.hash(
          validatesResult.value.password,
          10
        ).then((res) => res);

        // Update the password
        const AuthUpdate = await Auth.update(
          {
            password: hash_password,
          },
          {
            where: {
              email: email,
            },
          }
        )
          .then(() => {
            return res.status(201).send({
              success: true,
              message: "Password Updated Successfully.",
            });
          })
          .catch((error) => {
            return next(
              createHttpError(406, {
                success: false,
                message: error.message && error.errors,
              })
            );
          });
      }
    } catch (error) {
      return next(
        createHttpError(406, { success: false, message: error.message })
      );
    }
  },
};
