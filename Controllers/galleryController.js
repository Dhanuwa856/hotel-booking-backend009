import GalleryItem from "../models/gallery.js";

// Create a new gallery item
export const createGalleryItem = async (req, res) => {
  const user = req.user;

  if (user == null) {
    res.status(403).json({
      message: "Please Loging",
    });
    return;
  }
  if (user?.type != "admin") {
    res.status(403).json({
      message: "You do not have permission to crate a gallery item",
    });
    return;
  }
  const { name, image, description } = req.body.item;

  try {
    const newGalleryItem = new GalleryItem({ name, image, description });
    await newGalleryItem.save();
    res.status(201).json(newGalleryItem);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// Get all gallery items
export const getGalleryItems = async (req, res) => {
  try {
    const galleryItems = await GalleryItem.find();
    res.status(200).json(galleryItems);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
