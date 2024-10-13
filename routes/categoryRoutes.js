import express from "express";
import {
  crateCategory,
  deleteCategory,
  getCategory,
  getCategoryByName,
} from "../Controllers/categoryController.js";

const categoryRouter = express.Router();

categoryRouter.get("/", getCategory);
categoryRouter.post("/", crateCategory);
categoryRouter.delete("/:name", deleteCategory);
categoryRouter.get("/:name", getCategoryByName);

export default categoryRouter;
