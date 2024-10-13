import express from "express";
import {
  crateCategory,
  deleteCategory,
  getCategory,
} from "../Controllers/categoryController.js";

const categoryRouter = express.Router();

categoryRouter.get("/", getCategory);
categoryRouter.post("/", crateCategory);
categoryRouter.delete("/:name", deleteCategory);

export default categoryRouter;
