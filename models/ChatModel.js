const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatSchema = new mongoose.Schema(
  {
    isGroupChat: {
      type: Boolean,
      default:false
    },
    users: [{ type: Schema.Types.ObjectId, ref: 'User',required: true}],
    chatName:  {
        type: String,
        default:'Dummy Chat'
    },
    latestMessage:  {
        type: String,
        default:'Dummy Message'
    },
  },{timestamps: true}
);

module.exports = mongoose.model("Chat", ChatSchema);