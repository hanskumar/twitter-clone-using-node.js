const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    postedBy: { type: Schema.Types.ObjectId, ref: 'User',required: true},
    pinned:  Boolean
  },{timestamps: true}
);

module.exports = mongoose.model("Post", PostSchema);