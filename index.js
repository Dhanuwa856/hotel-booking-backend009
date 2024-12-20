import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes.js";
import jwt from "jsonwebtoken";
import galleryRouter from "./routes/galleryRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import feedbackRouter from "./routes/feedbackRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors()); // Enable CORS
app.use(bodyParser.json());

const connectionString = process.env.MONGO_URL;

app.use((req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (token != null) {
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (decoded != null) {
        req.user = decoded;
        next();
      } else {
        next();
      }
    });
  } else {
    next();
  }
});

mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Conected to mongoDB");
  })
  .catch(() => {
    console.log("Conection Filed");
  });

app.use("/api/users/", userRouter);
app.use("/api/gallery/", galleryRouter);
app.use("/api/categories/", categoryRouter);
app.use("/api/rooms/", roomRouter);
app.use("/api/booking/", bookingRouter);
app.use("/api/feedback/", feedbackRouter);

app.listen(5000, (req, res) => {
  console.log("Sever is runing on the port 5000");
});
