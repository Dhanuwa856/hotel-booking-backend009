import mongoose from "mongoose";

const galleryItemSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  description: {
    type: String,
    required: true,
  },
});

const GalleryItem = mongoose.model("galleryItem009", galleryItemSchema);

export default GalleryItem;
