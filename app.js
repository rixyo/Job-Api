const express =require('express')
const app=express()
//require('dotenv').config()
require("dotenv").config({ path: '.env' })
require('express-async-errors')
//extra security package
const helmet=require('helmet')
const core=require('cors')
const xss=require("xss-clean")
const rateLimiter = require('express-rate-limit')

const connectDB = require('./database/connect');
const authenticateUser=require("./middleware/auth")

//routers
const authRouter=require("./routes/auth")
const jobsRouter=require("./routes/jobs")


const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handelar');


app.use(express.json())
app.set('trust proxy', 1)
app.use(rateLimiter(
  {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  }
))
app.use(helmet())
app.use(core())
app.use(xss())


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