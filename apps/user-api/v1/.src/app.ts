import  express from "express";
import globalErrorhandler from "./middlewares/globalErrorhandler"
import userRouter from "./user/userRouter"
import bookRouter from "./book/bookRouter"




const app= express();

app.use(express.json());

// routes  , callbecks => (req, res, next) => {}
app.get('/',(req, res, next) => {

    // const error = createHttpError(400,"something went wrong")
    // throw  error;

      res.json({message:"welcome to elib apis"});
})

app.use("/api/users",userRouter);
app.use("/api/books",bookRouter);



// error handler
app.use(globalErrorhandler);





export default app;