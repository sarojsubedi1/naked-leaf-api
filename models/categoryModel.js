const mongoose = require("mongoose");

const catagorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Catogory = mongoose.model("Category", catagorySchema);

module.exports = Catogory;
