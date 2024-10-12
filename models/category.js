import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  features: [
    {
      type: String,
    },
  ],
  image: {
    type: String,
  },
});

const Category = mongoose.model("category009", categorySchema);

export default Category;
