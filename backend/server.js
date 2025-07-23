import express from "express";
import authRoutes from "./routes/auth.routes.js";
import dotenv from "dotenv";
import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();
// console.log(process.env.MONGO_URI);

app.use(express.json()); //to parse req.body
app.use(express.urlencoded({ extended: true })); //to parse urlencoded data
app.use(cookieParser()); //to parse cookies

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on : http://localhost:${PORT}`);
    connectMongoDB();
});