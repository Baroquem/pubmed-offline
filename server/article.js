const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const ArticleSchema = new Schema(
  {
    id: Number,
    article_ids: {
      type: Object,
    },
    journal: String,
    title: String,
    authors: [String],
    pubDate: {
      year: String,
      month: String,
      day: String,
    },
    subjects: [String],
    abstract: String,
    sourceFile: String,
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Article", ArticleSchema);