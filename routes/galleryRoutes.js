import express from "express";
import {
  createGalleryItem,
  deleteGalleryItem,
  getGalleryItems,
} from "../Controllers/galleryController.js";
import { checkAdmin, checkLoggedIn } from "../Controllers/userController.js";

const galleryRouter = express.Router();

galleryRouter.get("/", getGalleryItems);
galleryRouter.post("/", checkLoggedIn, checkAdmin, createGalleryItem);
galleryRouter.delete("/:id", checkLoggedIn, checkAdmin, deleteGalleryItem);

export default galleryRouter;
