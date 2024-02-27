#! /usr/bin/env node

console.log(
  'This script populates some test categories and items to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Item = require("./models/item");
const Category = require("./models/category");

const items = [];
const categories = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  // await createGenres();
  // await createBooks();
  await createCategories();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name, description) {
  const category = new Category({ name: name, description: description });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function itemCreate(
  index,
  name,
  description,
  category,
  price,
  number_in_stock
) {
  const itemDetail = {
    name: name,
    description: description,
    price: price,
    number_in_stock: number_in_stock,
  };
  if (category != false) itemDetail.category = category;
  const item = new Item(itemDetail);
  await item.save();
  items[index] = item;
  console.log(`Added item: ${item}`);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(0, "Clothing", "Clothes for everyone"),
    categoryCreate(1, "Food", "To keep hunger away"),
    categoryCreate(2, "Drinks", "To keep you hydrated"),
  ]);
}

async function createItems() {
  console.log("Adding Items");
  await Promise.all([
    itemCreate(0, "Jeans", "The best Levi's", categories[0], 80, 230),
    itemCreate(
      1,
      "Pepperoni Pizza",
      "Made with love by italian nonnas",
      categories[1],
      8,
      95
    ),
    itemCreate(2, "Fanta", "An orange flavoured soda", categories[2], 2, 1000),
    itemCreate(
      3,
      "Mac and Cheese",
      "A cheesy delight for college students",
      categories[1],
      1,
      45
    ),
  ]);
}
