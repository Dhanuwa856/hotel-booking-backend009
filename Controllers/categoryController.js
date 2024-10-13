import Category from "../models/category.js";

// Create a new category
export const crateCategory = async (req, res) => {
  const user = req.user;

  if (user == null) {
    res.status(403).json({
      message: "Please Loging",
    });
    return;
  }
  if (user?.type != "admin") {
    res.status(403).json({
      message: "You do not have permission to crate a category",
    });
    return;
  }
  const newCategory = new Category(req.body);
  newCategory
    .save()
    .then((result) => {
      res.json({
        message: "Category create successfully",
        result: result,
      });
    })
    .catch((err) => {
      res.json({
        message: "Category creation failed",
        error: err,
      });
    });
};

// Get all categorys
export const getCategory = async (req, res) => {
  try {
    const category = await Category.find();
    res.status(200).json(category);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Delete a category by name (Admin only)
export const deleteCategory = async (req, res) => {
  const user = req.user;

  // Check if user is logged in
  if (user == null) {
    return res.status(403).json({ message: "Please Login" });
  }

  // Check if user is an admin
  if (user?.type !== "admin") {
    return res.status(403).json({
      message: "You do not have permission to delete a category",
    });
  }

  const categoryName = req.params.name;

  try {
    // Find and delete the category by name
    const deletedCategory = await Category.findOneAndDelete({
      name: categoryName,
    });

    // Check if the category was found and deleted
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: `Category '${categoryName}' deleted successfully`,
      result: deletedCategory,
    });
  } catch (err) {
    res.status(500).json({
      message: "Category deletion failed",
      error: err.message,
    });
  }
};

// Get category by name (Public access)
export const getCategoryByName = async (req, res) => {
  const categoryName = req.params.name;

  try {
    // Find the category by name, case-insensitive

    const category = await Category.findOne({
      name: new RegExp("^" + categoryName + "$", "i"),
    });

    if (!category) {
      return res
        .status(404)
        .json({ message: `Category '${categoryName}' not found` });
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching category information",
      error: err.message,
    });
  }
};
