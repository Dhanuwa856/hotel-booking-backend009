import express from "express";
import {
  crateCategory,
  getCategory,
} from "../Controllers/categoryController.js";

const categoryRouter = express.Router();

categoryRouter.get("/", getCategory);
categoryRouter.post("/", crateCategory);

export default categoryRouter;
