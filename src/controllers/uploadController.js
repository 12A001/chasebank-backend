import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";

export const uploadProfileImage = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // upload to cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "profile_images",
    });

    // save to user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profileImage: result.secure_url },
      { new: true }
    );

    res.json({
      message: "Profile image updated",
      image: result.secure_url,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
};