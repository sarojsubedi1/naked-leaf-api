const Category = require("../models/categoryModel.js");

const { uploadToCloud } = require("../utils/cloudinary.js");

// Create New Category
exports.addcategory = async (req, res) => {
  const { name } = req.body;

  const existingcategory = await Category.findone({ name });

  if (existingcategory) {
    return res.status(400).json({ error: "Category already exists" });
  }

  try {
    const newCategory = new Category({ name });
    const category = newCategory.save();

    res.status(200).json({
      sucess: true,
      message: "Category created sucessfully.",
      category,
    });
  } catch (error) {
    console.error("error saving category:", error);
    res.status(500).json({ error: "failed to create category" });
  }
};

// Get All Category
exports.getallcategory = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      categories,
    });
  } catch (error) {
    console.error("error fetching categories:", error);
    res.status(500).json({ error: "failed to retrieve categories" });
  }
};

// Get Category by id
exports.getCategoryWithId = async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const category = await Category.findById(categoryId);

    if (!category) {
      return res
        .status(404)
        .json({ message: `Category with id ${categoryId} not found` });
    }
    res.status(200).json(category);
  } catch (error) {
    res.json({ message: "Error retrieving category", error });
  }
};
//Update Category by id
exports.updateCategoryWithId = async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const category = await Category.findById(categoryId);

    if (!category) {
      return res
        .status(404)
        .json({ message: `Category with id ${categoryId} not found` });
    }
    if (req.file) {
      const { mimetype, buffer } = req.file;
      const base64 = buffer.toString("base64");

      const result = await uploadToCloud(`data:${mimetype};base64,${base64}`, {
        folder: "category/",
      });
      category.icon = result.secure_url;
    }

    if (req.body.username) {
      category.name = req.body.name;
    }

    await category.save();

    res
      .status(200)
      .json({ message: "Category updated successfully", category });
  } catch (error) {
    res.json({ message: "Error updating category", error });
  }
};
