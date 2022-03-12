const { Schema, model } = require("mongoose");

const Photo = new Schema({
  title: String,
  description: String,
  imageURL: String,
  public_id: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = model("Photo", Photo);
