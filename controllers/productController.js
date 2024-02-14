const Product = require("../models/productModel.js");

const {
  uploadToCloud,
  deleteProductFromCloud,
} = require("../utils/cloudinary.js");

// Add product
exports.addProduct = async (req, res) => {
  const productData = req.body;

  try {
    if (req.files["image"][0]) {
      const { mimetype, buffer } = req.files["image"][0];
      const base64 = buffer.toString("base64");
      const result = await uploadToCloud(`data:${mimetype};base64,${base64}`, {
        folder: `products/${productData.title}`,
      });
      productData.image = result.secure_url;
    }

    if (req.files["images"] && req.files["images"].length > 0) {
      productData.images = [];

      for (const imageFile of req.files["images"]) {
        const { mimetype, buffer } = imageFile;
        const base64 = buffer.toString("base64");

        const result = await uploadToCloud(
          `data:${mimetype};base64,${base64}`,
          {
            folder: `products/${productData.title}`,
          },
        );

        productData.images.push(result.secure_url);
      }
    }

    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();

    res.status(201).json({
      sucess: true,
      message: `${savedProduct.title} added Sucessfully.`,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllProduct = async (req, res) => {
  try {
    const Products = await Product.find();
    res.status(200).json(Products);
  } catch (error) {
    console.error("error fetching categories:", error);
    res.status(500).json({ error: "failed to retrieve Products" });
  }
};

// @desc   Get Product by id
// route   GET /api/products/:id
exports.getProduct = async (req, res) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findById(productId);

    if (product) {
      return res.status(200).json(product);
    }
    res.status(404).json({ message: "Product  not found" });
  } catch (error) {
    res.json({ message: "Error retrieving Product", error });
  }
};

// Delete product
// POST /api/products/:id
exports.deleteProduct = async (req, res) => {
  const productId = req.params.productId;

  try {
    const productToDelete = await Product.findById(productId);

    if (!productToDelete) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (productToDelete.image) {
      await deleteProductFromCloud(
        productToDelete.image,
        productToDelete.title,
      );
    }

    await Product.findByIdAndDelete(productId);

    res.status(200).json({
      success: true,
      message: `${productToDelete.title} deleted successfully.`,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// edit Product
exports.editProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (req.file) {
      const { mimetype, buffer } = req.file;
      const base64 = buffer.toString("base64");

      const result = await uploadToCloud(`data:${mimetype};base64,${base64}`, {
        folder: `products/${product.title}`,
      });
      product.image = result.secure_url;
    }

    if (req.body.title) {
      product.title = req.body.title;
    }

    if (req.body.featured) {
      product.featured = req.body.featured;
    }

    if (req.body.dec) {
      product.dec = req.body.dec;
    }

    if (req.body.price) {
      product.price = req.body.price;
    }

    if (req.body.category) {
      product.category = req.body.category;
    }

    if (req.body.countInStock) {
      product.countInStock = req.body.countInStock;
    }

    await product.save();

    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
