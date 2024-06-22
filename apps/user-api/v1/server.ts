import app from "./src/app";
import {config} from "./src/config/config"
import connectdb from "./src/config/db"

const startServer = async ()=>{

    //database connection
    await connectdb();


    // const port = process.env.PORT || 3000;
     const port = config.port || 3000;


    app.listen(port,()=>{
        console.log(`listening on port : ${port}`);
    });
    // port with the callback it starts when the metod is being called
    // it also indicates the port is also started running
}

startServer();