import dotenv from "dotenv";
dotenv.config();
import express from "express";
import createHttpError from "http-errors";
import bodyParser from "body-parser";
import cors from "cors";
import sys from "os";

// Model Runner
import ModelRunner from "./Configs/ModelRunner.js";

// Routes
import Auths_Routes from "./Routes/Auth.js";
import PCateg_Routes from "./Routes/PCateg.js";
import PersonCateg from "./Routes/PersonCateg.js";
import Varient from "./Routes/Varient.js";
import Type from "./Routes/Type.js";
import TypeStyle from "./Routes/TypeStyle.js";
import Sizes from "./Routes/Sizes.js";
import Colors from "./Routes/Colors.js";
import Product from "./Routes/Products.js";
import PhotoUpload from "./Routes/PhotoUpload.js";
import Orders from "./Routes/Orders.js";
import Reviews from "./Routes/Reviews.js";

import fileUpload from "express-fileupload";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const app = express();
const { API_PORT } = process.env;
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(
  cors({
    origin: [
      "https://admin-easure.netlify.app",
      "https://easure.netlify.app",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);
app.use(express.static("public"));

//  for Express Upload
app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.get("/", (req, res) => {
  return res.send({
    Status: 200,
    Messages: "Success",
    os: sys.arch(),
  });
});

app.use("/api", Auths_Routes);
app.use("/api", PCateg_Routes);
app.use("/api", PersonCateg);
app.use("/api", Varient);
app.use("/api", Type);
app.use("/api", TypeStyle);
app.use("/api", Sizes);
app.use("/api", Colors);
app.use("/api", Product);
app.use("/api", Orders);
app.use("/api", Reviews);
// photos upload
app.use("/api", PhotoUpload);

app.use(async (req, res, next) => {
  next(createHttpError(404));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      success: err.success,
      status: err.status || 500,
      message: err.message,
    },
  });
});

app.listen(API_PORT, () => {
  console.log(`App is LIstenting on Port ${API_PORT}`);
});
