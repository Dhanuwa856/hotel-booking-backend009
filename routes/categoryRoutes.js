import express from "express";
import {
  crateCategory,
  deleteCategory,
  getCategory,
  getCategoryByName,
  updateCategoryByName,
} from "../Controllers/categoryController.js";
import { checkAdmin, checkLoggedIn } from "../Controllers/userController.js";

const categoryRouter = express.Router();

categoryRouter.get("/", getCategory);
categoryRouter.post("/", checkLoggedIn, checkAdmin, crateCategory);
categoryRouter.delete("/:name", checkLoggedIn, checkAdmin, deleteCategory);
categoryRouter.get("/:name", getCategoryByName);
categoryRouter.put("/:name", checkLoggedIn, checkAdmin, updateCategoryByName);

export default categoryRouter;
