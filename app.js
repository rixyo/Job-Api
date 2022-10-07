const express =require('express')
const app=express()
require('dotenv').config()
require('express-async-errors')

const connectDB = require('./database/connect');
const authenticateUser=require("./middleware/auth")

//routers
const authRouter=require("./routes/auth")
const jobsRouter=require("./routes/jobs")


const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handelar');


app.use(express.json())

//route

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobsRouter);



//error handelar
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


const port = process.env.PORT || 3000;
//database connection and port
const start = async () => {
    try {
      await connectDB(process.env.MONGO_URI);
      app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)
      );
    } catch (error) {
      console.log(error);
    }
  };
  
  start();