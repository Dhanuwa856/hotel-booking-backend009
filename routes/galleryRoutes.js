import express from "express";
import {
  createGalleryItem,
  getGalleryItems,
} from "../Controllers/galleryController.js";

const galleryRouter = express.Router();

galleryRouter.get("/", getGalleryItems);
galleryRouter.post("/", createGalleryItem);

export default galleryRouter;
