import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import path from "path";
import {config} from './config/config'

import errorMiddleware from "./middlewares/error";
import { Request, Response, NextFunction } from "express";

// Config
if (config.env !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

const app= express();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// Route Imports
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

app.use(express.static(path.join(__dirname, "../v1/build")));

app.get("*", (req:Request, res:Response) => {
  res.sendFile(path.resolve(__dirname, "../v1/build/index.html"));
});

// Middleware for Errors
app.use(errorMiddleware);


export default app;




// import  express from "express";
// import globalErrorhandler from "./middlewares/globalErrorhandler"
// import userRouter from "./user/userRouter"
// import bookRouter from "./book/bookRouter"




// const app= express();

// app.use(express.json());

// // routes  , callbecks => (req, res, next) => {}
// app.get('/',(req, res, next) => {

//     // const error = createHttpError(400,"something went wrong")
//     // throw  error;

//       res.json({message:"welcome to elib apis"});
// })

// app.use("/api/users",userRouter);
// app.use("/api/books",bookRouter);



// // error handler
// app.use(globalErrorhandler);





// export default app;