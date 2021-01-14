const mongoose = require("mongoose");

//const MongooseQueryLogger =  require("mongoose-query-logger");
 
//const queryLogger = MongooseQueryLogger();

//mongoose.set('debug', true);

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim:true
    },
    last_name: {
      type: String,
      required: true,
      trim:true
    },
    username: {
      type: String,
      required: true,
      trim:true
    },
    email: {
      type: String,
      required: true,
      trim:true
    },
    phone: {
        type: String,
        required: false,
        trim:true
    },
    password: {
      type: String,
      required: true,
    },
    pofile_pic: {
      type: String,
      default:'/images/user-default.png'
    },
    cover_photo: {
      type: String,
      default:'/images/default_cover.jpg'
    },
    online_status: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);

//userSchema.plugin(queryLogger.getPlugin());

module.exports = mongoose.model("User", userSchema);