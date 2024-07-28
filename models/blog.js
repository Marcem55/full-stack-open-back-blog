const { Schema, model } = require("mongoose");

const blogSchema = new Schema({
  author: {
    type: String,
    minLength: 3,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  votes: {
    type: Number,
    default: 0,
  },
});

blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = model("Blog", blogSchema);
