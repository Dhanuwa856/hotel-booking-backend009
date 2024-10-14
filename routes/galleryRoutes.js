import express from "express";
import {
  createGalleryItem,
  getGalleryItems,
} from "../Controllers/galleryController.js";
import { checkAdmin, checkLoggedIn } from "../Controllers/userController.js";

const galleryRouter = express.Router();

galleryRouter.get("/", getGalleryItems);
galleryRouter.post("/", checkLoggedIn, checkAdmin, createGalleryItem);

export default galleryRouter;
