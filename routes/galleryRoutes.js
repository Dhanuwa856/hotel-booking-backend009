import express from "express";
import {
  createGalleryItem,
  deleteGalleryItem,
  getGalleryItems,
  updateGalleryItem,
} from "../Controllers/galleryController.js";
import { checkAdmin, checkLoggedIn } from "../Controllers/userController.js";

const galleryRouter = express.Router();

galleryRouter.get("/", getGalleryItems);
galleryRouter.post("/", checkLoggedIn, checkAdmin, createGalleryItem);
galleryRouter.delete("/:id", checkLoggedIn, checkAdmin, deleteGalleryItem);
galleryRouter.put("/:id", checkLoggedIn, checkAdmin, updateGalleryItem);

export default galleryRouter;
