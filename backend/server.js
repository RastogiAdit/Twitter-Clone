import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import connectMongoDB from "./db/connectMongoDB.js";


const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();
// console.log(process.env.MONGO_URI);

app.use(express.json()); //to parse req.body
app.use(express.urlencoded({ extended: true })); //to parse urlencoded data
app.use(cookieParser()); //to parse cookies

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on : http://localhost:${PORT}`);
    connectMongoDB();
});