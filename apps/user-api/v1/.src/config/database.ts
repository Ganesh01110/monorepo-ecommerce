const mongoose = require("mongoose");
import {config} from './config'

const connectDatabase = async() => {

  try{

    mongoose.connection.on('connected',()=>{
      console.log("datbase connected successfully");
  })

  mongoose.connection.on('error',(error)=>{
      console.log("error connecting to database",error);
  })

   await mongoose
    .connect(config.databaseurl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    });

  }catch(error){
    console.error(`failed to connect database `,error);
    process.exit(1);
  }
 
};

module.exports = connectDatabase;
