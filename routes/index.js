const { Router } = require("express");
const router = Router();
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const Image = require("../models/Image");
const path = require("path");

router.get("/", async (req, res) => {
  const result = await Image.find().sort({ createdAt: -1 });
  let collection = [];
  result.forEach((data) => {
    collection.push({
      title: data.title,
      description: data.description,
      imageURL: data.imageURL,
      timestamp: data.timestamp,
    });
  });

  res.render("home", { photos: collection });
});

router.get("/admin", async (req, res) => {
  const result = await Image.find().sort({ createdAt: -1 });
  let collection = [];
  result.forEach((data) => {
    collection.push({
      _id: data._id,
      title: data.title.slice(0, 10),
      description: data.description.slice(0, 10),
      imageURL: data.imageURL,
      public_id: data.public_id,
    });
  });

  res.render("admin", { photos: collection });
});
router.post("/admin", upload.single("image"), async (req, res) => {
  const { title, description } = req.body;

  const result = await cloudinary.uploader.upload(req.file.path);

  //   create a new instance of image model
  const image = new Image({
    title,
    description,
    imageURL: result.secure_url,
    public_id: result.public_id,
  });

  await image.save();

  res.redirect("/");
});
router.get("/delete/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const image = await Image.findByIdAndDelete(id);
  const result = await cloudinary.uploader.destroy(image.public_id);
  console.log(result);
  res.redirect("/admin");
});

module.exports = router;
