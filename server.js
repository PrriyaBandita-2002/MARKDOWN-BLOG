const express = require("express");
const mongoose = require("mongoose");
const Article = require("./models/article");
const articleRouter = require("./routes/articles");
const methodOverride = require("method-override");
const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/newDb", {})
  .then(() => console.log("DB is connected"))
  .catch((err) => console.log(err));

const userSchema = new mongoose.Schema({
  largeData: {
    part1: String,
    part2: String,
    // ... more parts as needed
  },
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

app.get("/", async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const options = { /* other options */ maxTimeMS: 20000 };

    const articles = await Article.find({}, null, options);

    res.render("articles/index", { articles: articles });
  } catch (error) {
    console.error(error.message);
    // Handle the error here and potentially send a response to the client
    res.status(500).send("Internal Server Error");
  }
});

app.use("/articles", articleRouter);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
