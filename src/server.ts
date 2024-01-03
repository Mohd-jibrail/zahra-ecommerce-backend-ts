import express from "express";
import bodyParser from "body-parser";
import { notFound,errorHandler } from "./middlewares/errors/errorHandlers.js";
import { dbConnection } from "./config/db/dbConnection.js";
import { authRoutes } from "./routes/auth.routes.js";
const zahra_server = express();

dbConnection();

zahra_server.use(bodyParser.json());
zahra_server.use(bodyParser.urlencoded({extended:false}));

zahra_server.use("/api/auth",authRoutes);



zahra_server.use(notFound);
zahra_server.use(errorHandler);
zahra_server.listen(3000,()=>{
    console.log("Server running :: 3000");
})