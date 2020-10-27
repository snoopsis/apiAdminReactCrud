const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  cat: {
    type: String,
    required: true
  },
  texto: {
    type: String
  },
  ativo: {
    type: Boolean,
    default: false
  },
  img: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("post", PostSchema);
