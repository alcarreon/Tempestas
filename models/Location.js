

//require mongoose to help us chech for the parameters
const mongoose = require("mongoose");



//mongoose model to let database expect certain objects.
const LocationSchema = new mongoose.Schema({
  zip: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  days: [],
  checked: { type: Boolean, default: false },
});


//links database to model
module.exports = mongoose.model("Location", LocationSchema);
