import { request } from "express";
import { mongo } from "mongoose";

const express = require('express');
const Express = require('express');
const Request = require('express');
const Response = require('express');

const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');


dotenv.config();

const app  = express();


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err : Error) => console.log(err, "Connect to MongoDB failed"));


app.use(cors())

const PORT : string | number= process.env.PORT || 5000;


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

