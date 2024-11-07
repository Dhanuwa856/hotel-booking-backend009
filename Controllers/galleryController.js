import GalleryItem from "../models/gallery.js";

// Create a new gallery item
export const createGalleryItem = async (req, res) => {
  const { name, images, description } = req.body;

  try {
    const newGalleryItem = new GalleryItem({ name, images, description });
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

export const deleteGalleryItem = async (req, res) => {
  const galleryId = req.params.id;

  try {
    const deletedGalleryItem = await GalleryItem.findByIdAndDelete({
      _id: galleryId,
    });

    if (!deleteGalleryItem) {
      return res.status(404).json({ message: "Gallery Item not found" });
    }
    res.status(200).json({
      message: "Gallery Item deleted successfully",
      result: deletedGalleryItem,
    });
  } catch (err) {
    res.status(500).json({
      message: "Gallery Item deletion failed",
      error: err.message,
    });
  }
};

export const updateGalleryItem = async (req, res) => {
  const galleryId = req.params.id;
  const updatedData = req.body;

  try {
    const updateddGalleryItem = await GalleryItem.findByIdAndUpdate(
      { _id: galleryId },
      updatedData,
      { new: true }
    );
    if (!updateGalleryItem) {
      return res.status(404).json({ message: `'${galleryId}' not found` });
    }
    res.status(200).json({
      message: "Category updated successfully",
      gallery: updateddGalleryItem,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update Gallery Item", error: err.message });
  }
};
