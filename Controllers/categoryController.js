import Category from "../models/category.js";

// crate a new category

export const crateCategory = async (req, res) => {
  const user = req.user;

  if (user == null) {
    res.status(403).json({ message: "Please Loging" });
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
      res.json({ message: "Category creation failed", error: err });
    });
};

// Get all categorys
export const getcategory = async (req, res) => {
  try {
    const category = await Category.find();
    res.status(200).json(category);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
