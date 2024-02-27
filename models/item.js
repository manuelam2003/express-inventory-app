const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category" }, // array cuz item can have more than 1 category??
  price: { type: Number, required: true },
  number_in_stock: { type: Number, required: true },
});

module.exports = mongoose.model("Item", ItemSchema);
