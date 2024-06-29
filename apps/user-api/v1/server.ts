import app from "./.src/app";
import {v2 as cloudinary} from "cloudinary";
import connectDatabase from "./.src/config/database";
import {config} from './.src/config/config'

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

// Config
if (config.env !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

// Connecting to database
connectDatabase();

cloudinary.config({
  cloud_name: config.cloudinaryCloud,
  api_key: config.cloudinaryApiKey,
  api_secret: config.clouddinnaryApiSecret,
});

const server = app.listen(config.port, () => {
  console.log(`Server is working on http://localhost:${config.port}`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err:any) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});



// import app from "./src/app";
// import {config} from "./src/config/config"
// import connectdb from "./src/config/db"

// const startServer = async ()=>{

//     //database connection
//     await connectdb();


//     // const port = process.env.PORT || 3000;
//      const port = config.port || 3000;


//     app.listen(port,()=>{
//         console.log(`listening on port : ${port}`);
//     });
//     // port with the callback it starts when the metod is being called
//     // it also indicates the port is also started running
// }

// startServer();